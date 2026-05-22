-- Create flights table
CREATE TABLE flights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flight_no TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departs_at TIMESTAMP WITH TIME ZONE NOT NULL,
  arrives_at TIMESTAMP WITH TIME ZONE NOT NULL,
  aircraft_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  base_price NUMERIC NOT NULL
);

-- Create seats table
CREATE TABLE seats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
  seat_number TEXT NOT NULL,
  class TEXT CHECK (class IN ('economy', 'business', 'first')) NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  extra_fee NUMERIC NOT NULL DEFAULT 0
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- References auth.users(id)
  flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
  seat_id UUID REFERENCES seats(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('confirmed', 'rescheduled', 'cancelled')) NOT NULL DEFAULT 'confirmed',
  booked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_price NUMERIC NOT NULL,
  pnr_code TEXT NOT NULL
);

-- Create passengers table
CREATE TABLE passengers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  passport_no TEXT NOT NULL,
  nationality TEXT NOT NULL,
  dob DATE NOT NULL
);

-- Create reschedules table
CREATE TABLE reschedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  old_flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
  new_flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  fee_charged NUMERIC NOT NULL DEFAULT 0
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reschedules ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Flights & Seats: Read-only for everyone
CREATE POLICY select_flights ON flights FOR SELECT USING (true);
CREATE POLICY select_seats ON seats FOR SELECT USING (true);

-- Bookings: Users can select, insert, or update their own bookings
CREATE POLICY select_bookings ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_bookings ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY update_bookings ON bookings FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Passengers: Users can view/insert details if they own the parent booking
CREATE POLICY select_passengers ON passengers FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings WHERE bookings.id = passengers.booking_id AND bookings.user_id = auth.uid())
);
CREATE POLICY insert_passengers ON passengers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM bookings WHERE bookings.id = passengers.booking_id AND bookings.user_id = auth.uid())
);

-- Reschedules: Users can view/insert if they own the parent booking
CREATE POLICY select_reschedules ON reschedules FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings WHERE bookings.id = reschedules.booking_id AND bookings.user_id = auth.uid())
);
CREATE POLICY insert_reschedules ON reschedules FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM bookings WHERE bookings.id = reschedules.booking_id AND bookings.user_id = auth.uid())
);

-- RPC 1: Lock Seat & Book
CREATE OR REPLACE FUNCTION lock_seat(
  p_flight_id UUID,
  p_seat_id UUID,
  p_user_id UUID,
  p_total_price NUMERIC,
  p_pnr TEXT,
  p_full_name TEXT,
  p_passport_no TEXT,
  p_nationality TEXT,
  p_dob DATE
) RETURNS JSONB SECURITY DEFINER AS $$
DECLARE
  v_booking_id UUID;
  v_seat_available BOOLEAN;
BEGIN
  -- Select seat for update to prevent race conditions
  SELECT is_available INTO v_seat_available FROM seats WHERE id = p_seat_id AND flight_id = p_flight_id FOR UPDATE;
  
  IF v_seat_available IS NOT TRUE THEN
    RAISE EXCEPTION 'Seat is already occupied or does not exist';
  END IF;

  -- Mark seat as occupied
  UPDATE seats SET is_available = FALSE WHERE id = p_seat_id;

  -- Create the booking
  INSERT INTO bookings (user_id, flight_id, seat_id, status, total_price, pnr_code)
  VALUES (p_user_id, p_flight_id, p_seat_id, 'confirmed', p_total_price, p_pnr)
  RETURNING id INTO v_booking_id;

  -- Add passenger details
  INSERT INTO passengers (booking_id, full_name, passport_no, nationality, dob)
  VALUES (v_booking_id, p_full_name, p_passport_no, p_nationality, p_dob);

  RETURN jsonb_build_object('booking_id', v_booking_id);
END;
$$ LANGUAGE plpgsql;

-- RPC 2: Cancel Booking
CREATE OR REPLACE FUNCTION cancel_booking(
  p_booking_id UUID,
  p_user_id UUID
) RETURNS JSONB SECURITY DEFINER AS $$
DECLARE
  v_flight_id UUID;
  v_seat_id UUID;
  v_departs_at TIMESTAMPTZ;
BEGIN
  -- Verify ownership of the booking
  SELECT flight_id, seat_id INTO v_flight_id, v_seat_id FROM bookings
  WHERE id = p_booking_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found or unauthorized';
  END IF;

  -- Get flight departure time
  SELECT departs_at INTO v_departs_at FROM flights WHERE id = v_flight_id;

  -- Enforce cancellation within 2 hours constraint
  IF v_departs_at - NOW() < INTERVAL '2 hours' THEN
    RAISE EXCEPTION 'Cancellations within 2 hours of departure are not allowed';
  END IF;

  -- Update booking status
  UPDATE bookings SET status = 'cancelled' WHERE id = p_booking_id;

  -- Make the seat available again
  UPDATE seats SET is_available = TRUE WHERE id = v_seat_id;

  RETURN jsonb_build_object('success', TRUE);
END;
$$ LANGUAGE plpgsql;

-- RPC 3: Reschedule Booking
CREATE OR REPLACE FUNCTION reschedule_booking(
  p_booking_id UUID,
  p_user_id UUID,
  p_new_flight_id UUID,
  p_new_seat_id UUID
) RETURNS JSONB SECURITY DEFINER AS $$
DECLARE
  v_old_flight_id UUID;
  v_old_seat_id UUID;
  v_old_price NUMERIC;
  v_new_price NUMERIC;
  v_fee NUMERIC := 50.00; -- Flat reschedule fee
  v_seat_available BOOLEAN;
BEGIN
  -- Get existing booking details and lock the row
  SELECT flight_id, seat_id, total_price INTO v_old_flight_id, v_old_seat_id, v_old_price FROM bookings
  WHERE id = p_booking_id AND user_id = p_user_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found or unauthorized';
  END IF;

  -- Check if new seat is available and lock it
  SELECT is_available INTO v_seat_available FROM seats WHERE id = p_new_seat_id AND flight_id = p_new_flight_id FOR UPDATE;

  IF v_seat_available IS NOT TRUE THEN
    RAISE EXCEPTION 'New seat is already occupied';
  END IF;

  -- Free the old seat
  UPDATE seats SET is_available = TRUE WHERE id = v_old_seat_id;

  -- Occupy the new seat
  UPDATE seats SET is_available = FALSE WHERE id = p_new_seat_id;

  -- Log the reschedule
  INSERT INTO reschedules (booking_id, old_flight_id, new_flight_id, fee_charged)
  VALUES (p_booking_id, v_old_flight_id, p_new_flight_id, v_fee);

  -- Update the booking
  UPDATE bookings
  SET flight_id = p_new_flight_id,
      seat_id = p_new_seat_id,
      status = 'rescheduled',
      total_price = total_price + v_fee
  WHERE id = p_booking_id;

  RETURN jsonb_build_object('success', TRUE, 'fee_charged', v_fee);
END;
$$ LANGUAGE plpgsql;

-- Trigger: DB-level enforcement of the 2-hour cancellation rule
CREATE OR REPLACE FUNCTION enforce_cancellation_time()
RETURNS TRIGGER AS $$
DECLARE
  v_departs_at TIMESTAMP WITH TIME ZONE;
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
    SELECT departs_at INTO v_departs_at FROM flights WHERE id = OLD.flight_id;
    IF v_departs_at - NOW() < INTERVAL '2 hours' THEN
      RAISE EXCEPTION 'Cancellations within 2 hours of departure are not allowed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_cancellation_time
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION enforce_cancellation_time();

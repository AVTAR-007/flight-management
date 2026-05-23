-- Dynamic Seed Script for SkyBook Flights and Seats
-- Generates daily flights for the current month and the next month dynamically relative to today

DO $$
DECLARE
  v_date DATE;
  v_start_date DATE := date_trunc('month', CURRENT_DATE)::DATE;
  v_end_date DATE := (date_trunc('month', CURRENT_DATE) + INTERVAL '2 months' - INTERVAL '1 day')::DATE;
  v_flight_id UUID;
  v_row INT;
  v_col CHAR(1);
BEGIN
  -- Clear existing flights that do not have active user bookings (keeps historical user test bookings intact)
  DELETE FROM flights WHERE id NOT IN (SELECT DISTINCT flight_id FROM bookings);

  -- Loop over every date in the current and next month range
  FOR v_date IN SELECT generate_series(v_start_date, v_end_date, '1 day'::interval)::DATE LOOP

    ----------------------------------------------------
    -- ROUTE 1: Delhi (DEL) -> Mumbai (BOM)
    ----------------------------------------------------
    -- Morning Flight (AI-101)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-101', 'Delhi', 'Mumbai', (v_date + TIME '08:00:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '10:30:00') AT TIME ZONE 'Asia/Kolkata', 'Boeing 787', 'scheduled', 4500);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;

    -- Evening Flight (AI-102)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-102', 'Delhi', 'Mumbai', (v_date + TIME '16:00:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '18:30:00') AT TIME ZONE 'Asia/Kolkata', 'Boeing 787', 'scheduled', 4800);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;

    ----------------------------------------------------
    -- ROUTE 1 RETURN: Mumbai (BOM) -> Delhi (DEL)
    ----------------------------------------------------
    -- Morning Return (AI-103)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-103', 'Mumbai', 'Delhi', (v_date + TIME '11:30:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '14:00:00') AT TIME ZONE 'Asia/Kolkata', 'Boeing 787', 'scheduled', 4600);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;

    -- Evening Return (AI-104)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-104', 'Mumbai', 'Delhi', (v_date + TIME '19:30:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '22:00:00') AT TIME ZONE 'Asia/Kolkata', 'Boeing 787', 'scheduled', 4900);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;


    ----------------------------------------------------
    -- ROUTE 2: Mumbai (BOM) -> Bangalore (BLR)
    ----------------------------------------------------
    -- Morning Flight (AI-201)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-201', 'Mumbai', 'Bangalore', (v_date + TIME '09:00:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '11:00:00') AT TIME ZONE 'Asia/Kolkata', 'Airbus A320', 'scheduled', 3200);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;

    -- Evening Flight (AI-202)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-202', 'Mumbai', 'Bangalore', (v_date + TIME '19:00:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '21:00:00') AT TIME ZONE 'Asia/Kolkata', 'Airbus A320', 'scheduled', 3500);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;

    ----------------------------------------------------
    -- ROUTE 2 RETURN: Bangalore (BLR) -> Mumbai (BOM)
    ----------------------------------------------------
    -- Afternoon Return (AI-203)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-203', 'Bangalore', 'Mumbai', (v_date + TIME '12:00:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '14:00:00') AT TIME ZONE 'Asia/Kolkata', 'Airbus A320', 'scheduled', 3300);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;

    -- Night Return (AI-204)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-204', 'Bangalore', 'Mumbai', (v_date + TIME '22:00:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '23:59:59') AT TIME ZONE 'Asia/Kolkata', 'Airbus A320', 'scheduled', 3600);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;


    ----------------------------------------------------
    -- ROUTE 3: Bangalore (BLR) -> Hyderabad (HYD)
    ----------------------------------------------------
    -- Morning Flight (AI-301)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-301', 'Bangalore', 'Hyderabad', (v_date + TIME '10:00:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '11:15:00') AT TIME ZONE 'Asia/Kolkata', 'ATR 72', 'scheduled', 2500);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;

    -- Evening Flight (AI-302)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-302', 'Bangalore', 'Hyderabad', (v_date + TIME '18:00:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '19:15:00') AT TIME ZONE 'Asia/Kolkata', 'ATR 72', 'scheduled', 2700);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;

    ----------------------------------------------------
    -- ROUTE 3 RETURN: Hyderabad (HYD) -> Bangalore (BLR)
    ----------------------------------------------------
    -- Afternoon Return (AI-303)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-303', 'Hyderabad', 'Bangalore', (v_date + TIME '12:30:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '13:45:00') AT TIME ZONE 'Asia/Kolkata', 'ATR 72', 'scheduled', 2600);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;

    -- Night Return (AI-304)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-304', 'Hyderabad', 'Bangalore', (v_date + TIME '20:30:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '21:45:00') AT TIME ZONE 'Asia/Kolkata', 'ATR 72', 'scheduled', 2800);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;


    ----------------------------------------------------
    -- ROUTE 4: Hyderabad (HYD) -> Delhi (DEL)
    ----------------------------------------------------
    -- Morning Flight (AI-401)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-401', 'Hyderabad', 'Delhi', (v_date + TIME '07:00:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '09:15:00') AT TIME ZONE 'Asia/Kolkata', 'Boeing 737', 'scheduled', 3800);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;

    -- Afternoon Flight (AI-402)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-402', 'Hyderabad', 'Delhi', (v_date + TIME '15:00:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '17:15:00') AT TIME ZONE 'Asia/Kolkata', 'Boeing 737', 'scheduled', 4100);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;

    ----------------------------------------------------
    -- ROUTE 4 RETURN: Delhi (DEL) -> Hyderabad (HYD)
    ----------------------------------------------------
    -- Morning Return (AI-403)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-403', 'Delhi', 'Hyderabad', (v_date + TIME '10:15:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '12:30:00') AT TIME ZONE 'Asia/Kolkata', 'Boeing 737', 'scheduled', 3900);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;

    -- Evening Return (AI-404)
    v_flight_id := gen_random_uuid();
    INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price)
    VALUES (v_flight_id, 'AI-404', 'Delhi', 'Hyderabad', (v_date + TIME '18:15:00') AT TIME ZONE 'Asia/Kolkata', (v_date + TIME '20:30:00') AT TIME ZONE 'Asia/Kolkata', 'Boeing 737', 'scheduled', 4200);
    -- Generate Seats
    FOR v_row IN 1..2 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500); END LOOP; END LOOP;
    FOR v_row IN 3..5 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800); END LOOP; END LOOP;
    FOR v_row IN 6..15 LOOP FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0); END LOOP; END LOOP;

  END LOOP;
END;
$$;

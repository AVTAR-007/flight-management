-- Seed flights
INSERT INTO flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price) VALUES
('f1000000-0000-0000-0000-000000000001', 'AI-101', 'Delhi', 'Mumbai', NOW() + INTERVAL '1 day 12 hours', NOW() + INTERVAL '1 day 14 hours 30 mins', 'Boeing 787', 'scheduled', 4500),
('f1000000-0000-0000-0000-000000000002', 'AI-102', 'Delhi', 'Mumbai', NOW() + INTERVAL '2 days 6 hours', NOW() + INTERVAL '2 days 8 hours 30 mins', 'Boeing 787', 'scheduled', 4800),
('f2000000-0000-0000-0000-000000000001', 'AI-201', 'Mumbai', 'Bangalore', NOW() + INTERVAL '1 day 8 hours', NOW() + INTERVAL '1 day 10 hours', 'Airbus A320', 'scheduled', 3200),
('f2000000-0000-0000-0000-000000000002', 'AI-202', 'Mumbai', 'Bangalore', NOW() + INTERVAL '3 days 10 hours', NOW() + INTERVAL '3 days 12 hours', 'Airbus A320', 'scheduled', 3500),
('f3000000-0000-0000-0000-000000000001', 'AI-301', 'Bangalore', 'Hyderabad', NOW() + INTERVAL '2 days 8 hours', NOW() + INTERVAL '2 days 9 hours 15 mins', 'ATR 72', 'scheduled', 2500),
('f3000000-0000-0000-0000-000000000002', 'AI-302', 'Bangalore', 'Hyderabad', NOW() + INTERVAL '4 days 14 hours', NOW() + INTERVAL '4 days 15 hours 15 mins', 'ATR 72', 'scheduled', 2700),
('f4000000-0000-0000-0000-000000000001', 'AI-401', 'Hyderabad', 'Delhi', NOW() + INTERVAL '1 day 4 hours', NOW() + INTERVAL '1 day 6 hours 15 mins', 'Boeing 737', 'scheduled', 3800),
('f4000000-0000-0000-0000-000000000002', 'AI-402', 'Hyderabad', 'Delhi', NOW() + INTERVAL '5 days 9 hours', NOW() + INTERVAL '5 days 11 hours 15 mins', 'Boeing 737', 'scheduled', 4100);

-- Generate seats dynamically for each flight using an anonymous block
DO $$
DECLARE
  v_flight_id UUID;
  v_row INT;
  v_col CHAR(1);
  v_class TEXT;
  v_fee NUMERIC;
BEGIN
  -- Loop over all flights
  FOR v_flight_id IN SELECT id FROM flights LOOP
    
    -- Rows 1 to 2: First Class
    FOR v_row IN 1..2 LOOP
      FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'D', 'E']) LOOP -- 4 seats per row in First Class
        INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee)
        VALUES (v_flight_id, v_row::text || v_col, 'first', TRUE, 1500);
      END LOOP;
    END LOOP;

    -- Rows 3 to 5: Business Class
    FOR v_row IN 3..5 LOOP
      FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP
        INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee)
        VALUES (v_flight_id, v_row::text || v_col, 'business', TRUE, 800);
      END LOOP;
    END LOOP;

    -- Rows 6 to 15: Economy Class
    FOR v_row IN 6..15 LOOP
      FOR v_col IN SELECT unnest(ARRAY['A', 'B', 'C', 'D', 'E', 'F']) LOOP
        INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee)
        VALUES (v_flight_id, v_row::text || v_col, 'economy', TRUE, 0);
      END LOOP;
    END LOOP;

  END LOOP;
END;
$$;

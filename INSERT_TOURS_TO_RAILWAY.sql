-- SQL Commands to insert the 4 tours directly into Railway MySQL database
-- Run these commands in your Railway MySQL database

-- Clear existing tours (optional - only if you want to start fresh)
-- DELETE FROM tour_highlights;
-- DELETE FROM tours;

-- Insert the 4 specific tours from Railway production database
INSERT INTO tours (title, description, price, departure_time, location, rating, image, max_guests, route_description, start_location_link) VALUES 
('Tirana [Terminal] → Koman', 'Bus trip from Tirana through the Albanian Alps to Koman ferry dock', 10.0, '06:00', 'Tirana', 5.0, '/koman .jpg', 50, 'Departure from Tirana North-South Terminal at 06:00, arriving at Koman ferry dock', 'https://maps.app.goo.gl/CbEDq9ZmBcyqH5jS6');

INSERT INTO tours (title, description, price, departure_time, location, rating, image, max_guests, route_description, start_location_link) VALUES 
('Koman → Tirana', 'Afternoon return journey from Koman to Tirana', 10.0, '15:30', 'Koman', 5.0, '/Tirana.webp', 50, 'Departure from Koman ferry dock at 15:30, arriving at Tirana North-South Terminal', 'https://maps.app.goo.gl/HBLEbRbWruJBKf4KA');

INSERT INTO tours (title, description, price, departure_time, location, rating, image, max_guests, route_description, start_location_link) VALUES 
('Fierza → Valbonë', 'Ride through mountainous roads from Fierza to Valbonë', 7.0, '12:30', 'Fierza', 5.0, '/valbona.jpg', 50, 'Departure at 12:30 from Fierza ferry area to Valbonë village', 'https://maps.app.goo.gl/LyzZLKrrHtUZdesM6');

INSERT INTO tours (title, description, price, departure_time, location, rating, image, max_guests, route_description, start_location_link) VALUES 
('Valbonë → Fierza (Ferry)', 'A scenic transfer from Valbonë to Fierza, where you can catch the ferry', 7.0, '10:00', 'Valbonë', 5.0, '/fierza.jpg', 50, 'Departure from Valbonë at 10:00 heading towards Fierza ferry dock', 'https://maps.app.goo.gl/ieNwY6kLX8Ea6gKz8');

-- Insert tour highlights for the 4 tours
INSERT INTO tour_highlights (tour_id, highlight) VALUES (1, 'Albanian Alps');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (1, 'Scenic mountain roads');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (1, 'Koman ferry dock');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (1, 'Early morning departure');

INSERT INTO tour_highlights (tour_id, highlight) VALUES (2, 'Return journey');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (2, 'Afternoon departure');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (2, 'Tirana terminal');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (2, 'Comfortable bus ride');

INSERT INTO tour_highlights (tour_id, highlight) VALUES (3, 'Mountainous terrain');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (3, 'Valbonë village');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (3, 'Scenic mountain roads');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (3, 'Fierza ferry connection');

INSERT INTO tour_highlights (tour_id, highlight) VALUES (4, 'Valbonë departure');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (4, 'Ferry connection');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (4, 'Scenic transfer');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (4, 'Fierza ferry dock');

-- Verify the tours were inserted
SELECT * FROM tours;
SELECT * FROM tour_highlights; 
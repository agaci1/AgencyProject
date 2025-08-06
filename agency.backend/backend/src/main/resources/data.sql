-- Insert sample tours
INSERT INTO tours (title, description, price, departure_time, location, rating, image, max_guests, route_description, start_location_link) VALUES ('Tropoja Adventure', 'Explore the beautiful mountains and valleys of Tropoja', 150.0, '08:00', 'Tropoja', 4.8, '/tropojaFoto.jpg', 15, 'Scenic mountain route through Valbona Valley', 'https://maps.google.com/?q=Tropoja,Albania');

INSERT INTO tours (title, description, price, departure_time, location, rating, image, max_guests, route_description, start_location_link) VALUES ('Koman Lake Cruise', 'Boat tour through the stunning Koman Lake', 120.0, '09:30', 'Koman', 4.9, '/koman .jpg', 20, 'Peaceful cruise through crystal clear waters', 'https://maps.google.com/?q=Koman,Albania');

INSERT INTO tours (title, description, price, departure_time, location, rating, image, max_guests, route_description, start_location_link) VALUES ('Valbona Valley Trek', 'Hiking adventure in Valbona National Park', 180.0, '07:00', 'Valbona', 4.7, '/valbona.jpg', 12, 'Challenging trek with breathtaking views', 'https://maps.google.com/?q=Valbona,Albania');

INSERT INTO tours (title, description, price, departure_time, location, rating, image, max_guests, route_description, start_location_link) VALUES ('Tirana City Tour', 'Discover the vibrant capital city', 80.0, '10:00', 'Tirana', 4.5, '/Tirana.webp', 25, 'Urban exploration with historical sites', 'https://maps.google.com/?q=Tirana,Albania');

INSERT INTO tours (title, description, price, departure_time, location, rating, image, max_guests, route_description, start_location_link) VALUES ('Shkodra Lake Experience', 'Visit the largest lake in the Balkans', 100.0, '08:30', 'Shkodra', 4.6, '/ujvaraSh.jpg', 18, 'Lakeside adventure with cultural sites', 'https://maps.google.com/?q=Shkodra,Albania');

-- Insert tour highlights
INSERT INTO tour_highlights (tour_id, highlight) VALUES (1, 'Mountain hiking');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (1, 'Valley exploration');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (1, 'Local cuisine');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (2, 'Boat cruise');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (2, 'Water activities');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (2, 'Scenic photography');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (3, 'National park visit');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (3, 'Wildlife watching');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (3, 'Mountain climbing');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (4, 'City landmarks');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (4, 'Historical sites');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (4, 'Local markets');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (5, 'Lake activities');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (5, 'Cultural heritage');
INSERT INTO tour_highlights (tour_id, highlight) VALUES (5, 'Nature walks'); 
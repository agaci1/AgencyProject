-- Insert sample tours
INSERT INTO tours (title, description, price, departure_time, location, rating, image, max_guests, route_description, start_location_link) VALUES
('Tropoja Adventure', 'Explore the beautiful mountains and valleys of Tropoja', 150.0, '08:00', 'Tropoja', 4.8, '/tropojaFoto.jpg', 15, 'Scenic mountain route through Valbona Valley', 'https://maps.google.com/?q=Tropoja,Albania'),
('Koman Lake Cruise', 'Boat tour through the stunning Koman Lake', 120.0, '09:30', 'Koman', 4.9, '/koman .jpg', 20, 'Peaceful cruise through crystal clear waters', 'https://maps.google.com/?q=Koman,Albania'),
('Valbona Valley Trek', 'Hiking adventure in Valbona National Park', 180.0, '07:00', 'Valbona', 4.7, '/valbona.jpg', 12, 'Challenging trek with breathtaking views', 'https://maps.google.com/?q=Valbona,Albania'),
('Tirana City Tour', 'Discover the vibrant capital city', 80.0, '10:00', 'Tirana', 4.5, '/Tirana.webp', 25, 'Urban exploration with historical sites', 'https://maps.google.com/?q=Tirana,Albania'),
('Shkodra Lake Experience', 'Visit the largest lake in the Balkans', 100.0, '08:30', 'Shkodra', 4.6, '/ujvaraSh.jpg', 18, 'Lakeside adventure with cultural sites', 'https://maps.google.com/?q=Shkodra,Albania');

-- Insert tour highlights
INSERT INTO tour_highlights (tour_id, highlight) VALUES
(1, 'Mountain hiking'),
(1, 'Valley exploration'),
(1, 'Local cuisine'),
(2, 'Boat cruise'),
(2, 'Water activities'),
(2, 'Scenic photography'),
(3, 'National park visit'),
(3, 'Wildlife watching'),
(3, 'Mountain climbing'),
(4, 'City landmarks'),
(4, 'Historical sites'),
(4, 'Local markets'),
(5, 'Lake activities'),
(5, 'Cultural heritage'),
(5, 'Nature walks'); 
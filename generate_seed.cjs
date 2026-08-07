const fs = require('fs');

const seed = `
-- AZM Group B2B Platform
-- Seed Data

SET FOREIGN_KEY_CHECKS=0;

-- --------------------------------------------------------
-- 1. Demo Admin Roles & Users
-- --------------------------------------------------------
INSERT INTO roles (id, name, description) VALUES
(1, 'Super Admin', 'Full access to all modules'),
(2, 'Sales Manager', 'Access to leads, CRM, and quotations'),
(3, 'Catalog Manager', 'Access to products, brands, and categories'),
(4, 'Marketing', 'Access to blogs, SEO, and content');

-- Note: In production, password hashes must be generated using bcrypt (e.g. cost factor 12)
-- Here we use a dummy bcrypt hash string for '$2b$12$dummyhash...' corresponding to 'password123'
INSERT INTO users (id, role_id, first_name, last_name, email, password_hash) VALUES
(1, 1, 'Admin', 'User', 'admin@azmgroup.demo', '$2b$12$KkQJbHj6bWv9k4XfQ9N8w.x.sX3mK6eA/3L9GZ6bWv9k4XfQ9N8w.'),
(2, 2, 'Sales', 'Lead', 'sales@azmgroup.demo', '$2b$12$KkQJbHj6bWv9k4XfQ9N8w.x.sX3mK6eA/3L9GZ6bWv9k4XfQ9N8w.'),
(3, 3, 'Catalog', 'Editor', 'catalog@azmgroup.demo', '$2b$12$KkQJbHj6bWv9k4XfQ9N8w.x.sX3mK6eA/3L9GZ6bWv9k4XfQ9N8w.');

-- --------------------------------------------------------
-- 2. Demo Brands
-- --------------------------------------------------------
INSERT INTO brands (id, slug, logo_url, country_of_origin, is_featured, sort_order) VALUES
(1, 'vado', '/media/brands/vado-logo.png', 'United Kingdom', 1, 1),
(2, 'jaquar', '/media/brands/jaquar-logo.png', 'India', 1, 2),
(3, 'roman', '/media/brands/roman-logo.png', 'United Kingdom', 1, 3),
(4, 'kludi-rak', '/media/brands/kludi-rak-logo.png', 'UAE/Germany', 1, 4),
(5, 'sanit', '/media/brands/sanit-logo.png', 'Germany', 0, 5),
(6, 'italian-standards', '/media/brands/is-logo.png', 'Italy', 0, 6);

INSERT INTO brand_translations (brand_id, language_code, name, description) VALUES
(1, 'en', 'VADO', 'Premium British bathroom brassware manufacturer renowned for quality and design.'),
(2, 'en', 'JAQUAR', 'Global leader in complete bathroom and lighting solutions.'),
(3, 'en', 'ROMAN', 'Leading designer and manufacturer of premium shower enclosures.'),
(4, 'en', 'KLUDI RAK', 'Joint venture producing high-quality European bathroom fittings.'),
(5, 'en', 'SANIT', 'German engineered concealed flushing systems and sanitary technology.'),
(6, 'en', 'Italian Standards', 'Luxury Italian sanitaryware and bathroom furniture.');

-- --------------------------------------------------------
-- 3. Demo Categories
-- --------------------------------------------------------
INSERT INTO categories (id, slug, sort_order, is_featured) VALUES
(1, 'bathroom-mixers', 1, 1),
(2, 'shower-systems', 2, 1),
(3, 'sanitaryware', 3, 1),
(4, 'shower-enclosures', 4, 0),
(5, 'concealed-systems', 5, 0),
(6, 'accessories', 6, 1);

INSERT INTO category_translations (category_id, language_code, name, description) VALUES
(1, 'en', 'Bathroom Mixers', 'Premium basin mixers, bath fillers, and bidet mixers.'),
(2, 'en', 'Shower Systems', 'Thermostatic shower valves, rain showers, and hand showers.'),
(3, 'en', 'Sanitaryware', 'High-quality water closets, bidets, and wash basins.'),
(4, 'en', 'Shower Enclosures', 'Luxury glass shower enclosures and wetroom panels.'),
(5, 'en', 'Concealed Systems', 'Concealed cisterns and flush plates for modern bathrooms.'),
(6, 'en', 'Accessories', 'Towel rails, robe hooks, soap dispensers, and bathroom accessories.');

-- --------------------------------------------------------
-- 4. Sample Products (24 items)
-- --------------------------------------------------------
INSERT INTO products (id, sku, slug, brand_id, category_id, status, is_featured, main_image_url, sort_order) VALUES
(1, 'VAD-IND-101', 'vado-individual-basin-mixer-gold', 1, 1, 'published', 1, '/media/products/vad-ind-101.jpg', 1),
(2, 'VAD-IND-102', 'vado-individual-basin-mixer-black', 1, 1, 'published', 0, '/media/products/vad-ind-102.jpg', 2),
(3, 'VAD-IND-201', 'vado-individual-bath-mixer-gold', 1, 1, 'published', 1, '/media/products/vad-ind-201.jpg', 3),
(4, 'VAD-SEN-301', 'vado-sensori-smart-shower', 1, 2, 'published', 1, '/media/products/vad-sen-301.jpg', 4),
(5, 'JAQ-ART-101', 'jaquar-artize-confluence-basin', 2, 1, 'published', 1, '/media/products/jaq-art-101.jpg', 5),
(6, 'JAQ-ART-102', 'jaquar-artize-confluence-tall', 2, 1, 'published', 0, '/media/products/jaq-art-102.jpg', 6),
(7, 'JAQ-ART-201', 'jaquar-artize-shower-system', 2, 2, 'published', 1, '/media/products/jaq-art-201.jpg', 7),
(8, 'JAQ-FLR-101', 'jaquar-florentine-basin-mixer', 2, 1, 'published', 0, '/media/products/jaq-flr-101.jpg', 8),
(9, 'ROM-DEC-101', 'roman-decem-hinged-door', 3, 4, 'published', 1, '/media/products/rom-dec-101.jpg', 9),
(10, 'ROM-DEC-102', 'roman-decem-wetroom-panel', 3, 4, 'published', 1, '/media/products/rom-dec-102.jpg', 10),
(11, 'ROM-LIB-101', 'roman-liberty-sliding-door', 3, 4, 'published', 0, '/media/products/rom-lib-101.jpg', 11),
(12, 'ROM-LIB-102', 'roman-liberty-corner-entry', 3, 4, 'published', 0, '/media/products/rom-lib-102.jpg', 12),
(13, 'KLU-PRO-101', 'kludi-rak-profile-basin-mixer', 4, 1, 'published', 1, '/media/products/klu-pro-101.jpg', 13),
(14, 'KLU-PRO-201', 'kludi-rak-profile-shower-mixer', 4, 2, 'published', 0, '/media/products/klu-pro-201.jpg', 14),
(15, 'KLU-POL-101', 'kludi-rak-polaris-basin-mixer', 4, 1, 'published', 0, '/media/products/klu-pol-101.jpg', 15),
(16, 'KLU-POL-201', 'kludi-rak-polaris-kitchen-mixer', 4, 1, 'published', 1, '/media/products/klu-pol-201.jpg', 16),
(17, 'SAN-INEO-101', 'sanit-ineo-concealed-cistern', 5, 5, 'published', 1, '/media/products/san-ineo-101.jpg', 17),
(18, 'SAN-INEO-102', 'sanit-ineo-front-flush-plate', 5, 5, 'published', 0, '/media/products/san-ineo-102.jpg', 18),
(19, 'SAN-INEO-103', 'sanit-ineo-black-flush-plate', 5, 5, 'published', 1, '/media/products/san-ineo-103.jpg', 19),
(20, 'SAN-INEO-104', 'sanit-ineo-sensor-flush-plate', 5, 5, 'published', 0, '/media/products/san-ineo-104.jpg', 20),
(21, 'IS-VEN-101', 'italian-standards-venezia-wc', 6, 3, 'published', 1, '/media/products/is-ven-101.jpg', 21),
(22, 'IS-VEN-102', 'italian-standards-venezia-bidet', 6, 3, 'published', 0, '/media/products/is-ven-102.jpg', 22),
(23, 'IS-MIL-101', 'italian-standards-milano-basin', 6, 3, 'published', 1, '/media/products/is-mil-101.jpg', 23),
(24, 'IS-MIL-102', 'italian-standards-milano-freestanding', 6, 3, 'published', 1, '/media/products/is-mil-102.jpg', 24);

INSERT INTO product_translations (product_id, language_code, name, short_description) VALUES
(1, 'en', 'VADO Individual Basin Mixer (Brushed Gold)', 'Premium single lever basin mixer featuring knurled details.'),
(2, 'en', 'VADO Individual Basin Mixer (Brushed Black)', 'Premium single lever basin mixer in striking brushed black.'),
(3, 'en', 'VADO Individual Bath Mixer (Brushed Gold)', 'Elegant freestanding bath shower mixer.'),
(4, 'en', 'VADO Sensori Smart Touch Shower', 'Digital thermostatic shower system with touch control.'),
(5, 'en', 'Jaquar Artize Confluence Basin Mixer', 'Biomorphic design single lever basin mixer.'),
(6, 'en', 'Jaquar Artize Confluence Tall Mixer', 'Extended height basin mixer for vessel sinks.'),
(7, 'en', 'Jaquar Artize Shower System', 'Complete thermostatic shower system with rain head.'),
(8, 'en', 'Jaquar Florentine Basin Mixer', 'Classic contemporary single lever basin mixer.'),
(9, 'en', 'Roman Decem Hinged Door', '10mm thick glass luxury hinged shower door.'),
(10, 'en', 'Roman Decem Wetroom Panel', 'Frameless wetroom panel with bracing bar.'),
(11, 'en', 'Roman Liberty Sliding Door', 'Premium sliding shower enclosure with easy-clean glass.'),
(12, 'en', 'Roman Liberty Corner Entry', 'Space-saving corner entry shower enclosure.'),
(13, 'en', 'Kludi RAK Profile Basin Mixer', 'Modern geometric basin mixer with ceramic cartridge.'),
(14, 'en', 'Kludi RAK Profile Shower Mixer', 'Exposed shower mixer valve.'),
(15, 'en', 'Kludi RAK Polaris Basin Mixer', 'Ergonomic and reliable basin mixer.'),
(16, 'en', 'Kludi RAK Polaris Kitchen Mixer', 'Swivel spout kitchen sink mixer.'),
(17, 'en', 'Sanit INEO Concealed Cistern', 'Robust concealed cistern for wall-hung WCs.'),
(18, 'en', 'Sanit INEO Front Flush Plate', 'Dual flush control plate in chrome.'),
(19, 'en', 'Sanit INEO Black Flush Plate', 'Matte black dual flush control plate.'),
(20, 'en', 'Sanit INEO Sensor Flush Plate', 'Touchless electronic flush plate.'),
(21, 'en', 'Italian Standards Venezia Wall-Hung WC', 'Rimless wall-hung toilet pan.'),
(22, 'en', 'Italian Standards Venezia Bidet', 'Wall-hung ceramic bidet.'),
(23, 'en', 'Italian Standards Milano Countertop Basin', 'Ultra-thin ceramic countertop wash basin.'),
(24, 'en', 'Italian Standards Milano Freestanding Basin', 'Monolithic floor-standing wash basin.');

SET FOREIGN_KEY_CHECKS=1;
\`;

fs.writeFileSync('database/seed.sql', seed);

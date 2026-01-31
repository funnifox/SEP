# SEP

## INTRODUCTION:

Customer:
URL:  http://localhost:8081/B/selectCountry.html
email: junwei10255@gmail.com
pwd: junwei123

Staff of IslandFurniture:
URL:  http://localhost:8081/A1/staffLogin.html
email: admin@if.com
pwd: admin123

### Step 1:
1. create .env

2. put this inside:
```
STRIPE_SECRET_KEY=(direct message us for the key)
```

### Step 2: Install the required module
```
npm i
```

### Step 3: Run the server
```
nvm use 8.12.0
```
```
node server.js
```

### Step 4: Ensure you are using the default database SQL tables so that the playwright test would fit

<br>
<br>
<br>

# Using Playwright for Automated Testing
Since Playwright is avaliable for the more newer version of Node.js while Islandfurniture uses a outdated version, there is a workround for it to run the server in an outdated node.js while the testing is occuring at a later version

### Step 1:
Ensure islandfurniture is running on 8.12.0 of node.js
```
nvm ls 
```

### Step 2:
Start a new terminal by pressing the Plus button near the bottom right

### Step 3:
Run this command to change node.js to a later version
```
nvm use 24.10.0
```

### Step 4:
You should have two terminal running 8.12.0 for server and 24.10.0 for your current terminal

Now in that terminal running node.js 24.10.0, run this command to run the Playwright Test. 
```
npx playwright test --headed
```

Note:
- --headed will cause a popup browser to show the test running live, remove --headed if you do not want the popup

### Step 5: 
Show latest report of test
```
npx playwright show-report
```

<br>
<br>
<br>

# SQL NEW COMMANDS FOR TABLE AND INSERT
## First SQL for Showroom Category
```sql
-- run this first
DROP TABLE IF EXISTS showroom;
DROP TABLE IF EXISTS showroom_category;

CREATE TABLE showroom_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

INSERT INTO showroom_category (id, name, description) VALUES
(1, 'Bedroom', 'A private space designed for sleeping, relaxing, and personal comfort after a long day.'),
(2, 'Kitchen', 'A functional area equipped for cooking, food preparation, and meal storage.'),
(3, 'Living Room', 'A shared space for relaxation, entertainment, and spending time with family or guests.'),
(4, 'Bathroom', 'A personal hygiene area used for bathing, showering, and daily grooming.');
```

## Second SQL for Showroom
```sql
-- run this second
DROP TABLE IF EXISTS showroom_furniture;
DROP TABLE IF EXISTS showroom;

CREATE TABLE showroom (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INT NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
        REFERENCES showroom_category(id)
);

INSERT INTO showroom (id, name, category_id, description, cover_image_url, created_at)
VALUES
-- Bedroom showrooms
(9,  'Serene Sleep Haven', 1,
 'A calm and thoughtfully designed bedroom showcasing modern bed frames, soft lighting, and storage solutions that create a relaxing and comfortable sleeping environment.',
 '/uploads/showrooms/1766504711891.jpg',
 '2025-12-23 23:45:11'),

(16, 'Tranquil Night Retreat', 1,
 'A peaceful bedroom arrangement with plush bedding, ambient lighting, and minimalistic décor for a restful sleep environment.',
 '/uploads/showrooms/1766552952922.jpg',
 '2025-12-24 13:09:12'),

-- Bathroom showrooms
(20, 'Pure Comfort Bath Sanctuary', 4,
 'A thoughtfully designed bathroom showcasing elegant fittings, warm tones, and practical storage solutions for a comfortable and relaxing daily routine.',
 '/uploads/showrooms/1767196768837.jpg',
 '2025-12-31 23:59:28'),

(21, 'Zen Bath Haven', 4,
 'A minimalist bathroom environment with natural textures, gentle lighting, and modern sanitary fittings for a peaceful, stress-free experience.',
 '/uploads/showrooms/1767197077216.jpg',
 '2026-01-01 00:04:37'),

-- Children bedroom
(22, 'Playful Dreamland Retreat', 1,
 'A bright and cheerful children’s bedroom designed with fun accents, cozy sleeping areas, and practical storage solutions to create a safe, comfortable, and imaginative space for growing kids.',
 '/uploads/showrooms/1767197383153.jpeg',
 '2026-01-01 00:09:43'),

-- Kitchen showrooms
(23, 'Modern Culinary Haven', 2,
 'A sleek and functional kitchen design featuring contemporary cabinetry, efficient storage solutions, and well-organized workspaces for an enjoyable and practical cooking experience.',
 '/uploads/showrooms/1767197693436.jpg',
 '2026-01-01 00:14:53'),

(24, 'Warm Family Kitchen Retreat', 2,
 'A welcoming kitchen setup with warm tones, spacious countertops, and smart storage options, designed to support everyday cooking and family gatherings.',
 '/uploads/showrooms/1767198079252.jpg',
 '2026-01-01 00:21:19'),

-- Living room showrooms
(25, 'Modern Social Retreat', 3,
 'A contemporary living room design with clean lines, neutral tones, and functional furniture pieces, ideal for entertaining guests or spending quality time with family.',
 '/uploads/showrooms/1767198276183.png',
 '2026-01-01 00:24:36'),

(26, 'Cozy Living Lounge', 3,
 'A comfortable living room setup featuring soft seating, warm lighting, and thoughtfully arranged furniture to create a welcoming space for relaxation and everyday living.',
 '/uploads/showrooms/1767198433707.jpg',
 '2026-01-01 00:27:13');
```

## Third SQL for Showroom Furniture
```sql
-- run this third
DROP TABLE IF EXISTS showroom_furniture;

CREATE TABLE showroom_furniture (
    showroom_id INT NOT NULL,
    furniture_id BIGINT NOT NULL,  -- same type as itementity.ID
    position_json JSON NOT NULL,
    PRIMARY KEY (showroom_id, furniture_id),

    FOREIGN KEY (showroom_id)
        REFERENCES showroom(id)
        ON DELETE CASCADE,

    FOREIGN KEY (furniture_id)
        REFERENCES itementity(ID)
        ON DELETE CASCADE
);

INSERT INTO showroom_furniture (showroom_id, furniture_id, position_json) VALUES
-- Showroom 9
(9, 902, JSON_OBJECT('x', 799.3578110201131, 'y', 629.836265108634)),
(9, 914, JSON_OBJECT('x', 517.8359084243407, 'y', 79.52582035964461)),
(9, 920, JSON_OBJECT('x', 749.0126532566355, 'y', 403.1774163049776)),
(9, 924, JSON_OBJECT('x', 117.12955071502944, 'y', 619.767101454193)),

-- Showroom 16
(16, 756, JSON_OBJECT('x', 415.3957133705299, 'y', 746.7565531998141)),
(16, 808, JSON_OBJECT('x', 1110.1299934134163, 'y', 687.7577197041417)),
(16, 905, JSON_OBJECT('x', 748.9163296129555, 'y', 646.5789521259217)),
(16, 914, JSON_OBJECT('x', 545.4326323386958, 'y', 67.42722778221902)),

-- Showroom 20
(20, 765, JSON_OBJECT('x', 180.1252136818298, 'y', 547.1237911471486)),
(20, 768, JSON_OBJECT('x', 771.5523858777843, 'y', 583.7271433717817)),
(20, 943, JSON_OBJECT('x', 365.06660954766573, 'y', 474.8803328090568)),

-- Showroom 21
(21, 762, JSON_OBJECT('x', 692.5669980600835, 'y', 464.6699255004034)),
(21, 767, JSON_OBJECT('x', 346.7651172484424, 'y', 429.99306549811934)),
(21, 768, JSON_OBJECT('x', 236.9561634531023, 'y', 581.8006511494326)),
(21, 916, JSON_OBJECT('x', 425.75050506614315, 'y', 230.60111910705135)),
(21, 938, JSON_OBJECT('x', 631.8831025416061, 'y', 466.21111780848577)),

-- Showroom 22
(22, 907, JSON_OBJECT('x', 755.4984452644305, 'y', 556.1950637824389)),
(22, 920, JSON_OBJECT('x', 339.1394954570993, 'y', 46.5408986791941)),
(22, 930, JSON_OBJECT('x', 477.92581205954303, 'y', 430.1380970271378)),
(22, 944, JSON_OBJECT('x', 39.65323331498392, 'y', 329.3342613152934)),

-- Showroom 23
(23, 761, JSON_OBJECT('x', 446.6206278635031, 'y', 502.97564867380026)),
(23, 764, JSON_OBJECT('x', 544.7102050110949, 'y', 393.1975602418008)),
(23, 806, JSON_OBJECT('x', 660.5393865364426, 'y', 283.83688057940594)),
(23, 928, JSON_OBJECT('x', 728.3672856278625, 'y', 492.3317648559315)),
(23, 940, JSON_OBJECT('x', 1148.9002599946657, 'y', 555.9863593976365)),

-- Showroom 24
(24, 69,  JSON_OBJECT('x', 697.0621014318226, 'y', 652.8248317017617)),
(24, 765, JSON_OBJECT('x', 703.3231382710305, 'y', 457.4782679379128)),
(24, 930, JSON_OBJECT('x', 1033.071078469318, 'y', 624.2324344821727)),
(24, 940, JSON_OBJECT('x', 482.09983661901504, 'y', 218.30395453589)),

-- Showroom 25
(25, 920, JSON_OBJECT('x', 765.9335066631105, 'y', 328.29074486475116)),
(25, 931, JSON_OBJECT('x', 564.5368216685869, 'y', 463.11326642405066)),
(25, 937, JSON_OBJECT('x', 919.328909223706, 'y', 479.3921427569997)),
(25, 938, JSON_OBJECT('x', 203.4836972742596, 'y', 285.2978033116122)),

-- Showroom 26
(26, 71,  JSON_OBJECT('x', 691.8445707324826, 'y', 641.7635351335833)),
(26, 936, JSON_OBJECT('x', 477.92581205954303, 'y', 556.1950637824389)),
(26, 937, JSON_OBJECT('x', 832.7178996146623, 'y', 532.8202602600882)),
(26, 941, JSON_OBJECT('x', 714.8017058095786, 'y', 363.14424427071054)),
(26, 943, JSON_OBJECT('x', 538.4491681718869, 'y', 354.7961007242574));
;

```

## SQL for Promotion Furniture
```sql
ALTER TABLE promotionentity
MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT;

INSERT INTO promotionentity
(
    DESCRIPTION,
    DISCOUNTRATE,
    STARTDATE,
    ENDDATE,
    IMAGEURL,
    COUNTRY_ID,
    ITEM_ID
)
VALUES
('Holiday Sale 20% Off', 0.20, '2025-12-01', '2026-02-28', NULL, 25, 69),
('Holiday Sale 25% Off', 0.25, '2025-12-01', '2026-02-28', NULL, 25, 70),
('Holiday Sale 30% Off', 0.30, '2025-12-01', '2026-02-28', NULL, 25, 71),
('Holiday Sale 35% Off', 0.35, '2025-12-01', '2026-02-28', NULL, 25, 72),
('Holiday Sale 40% Off', 0.40, '2025-12-01', '2026-02-28', NULL, 25, 73),

('Holiday Sale 20% Off', 0.20, '2025-12-01', '2026-02-28', NULL, 25, 74),
('Holiday Sale 25% Off', 0.25, '2025-12-01', '2026-02-28', NULL, 25, 75),
('Holiday Sale 30% Off', 0.30, '2025-12-01', '2026-02-28', NULL, 25, 751),
('Holiday Sale 35% Off', 0.35, '2025-12-01', '2026-02-28', NULL, 25, 752),
('Holiday Sale 40% Off', 0.40, '2025-12-01', '2026-02-28', NULL, 25, 755),

('Holiday Sale 20% Off', 0.20, '2025-12-01', '2026-02-28', NULL, 25, 756),
('Holiday Sale 25% Off', 0.25, '2025-12-01', '2026-02-28', NULL, 25, 757),
('Holiday Sale 30% Off', 0.30, '2025-12-01', '2026-02-28', NULL, 25, 759),
('Holiday Sale 35% Off', 0.35, '2025-12-01', '2026-02-28', NULL, 25, 760),
('Holiday Sale 40% Off', 0.40, '2025-12-01', '2026-02-28', NULL, 25, 761),

('Holiday Sale 20% Off', 0.20, '2025-12-01', '2026-02-28', NULL, 25, 762),
('Holiday Sale 25% Off', 0.25, '2025-12-01', '2026-02-28', NULL, 25, 763),
('Holiday Sale 30% Off', 0.30, '2025-12-01', '2026-02-28', NULL, 25, 764),
('Holiday Sale 35% Off', 0.35, '2025-12-01', '2026-02-28', NULL, 25, 765),
('Holiday Sale 40% Off', 0.40, '2025-12-01', '2026-02-28', NULL, 25, 767),

('Holiday Sale 20% Off', 0.20, '2025-12-01', '2026-02-28', NULL, 25, 768),
('Holiday Sale 25% Off', 0.25, '2025-12-01', '2026-02-28', NULL, 25, 769),
('Holiday Sale 30% Off', 0.30, '2025-12-01', '2026-02-28', NULL, 25, 770),
('Holiday Sale 35% Off', 0.35, '2025-12-01', '2026-02-28', NULL, 25, 771),
('Holiday Sale 40% Off', 0.40, '2025-12-01', '2026-02-28', NULL, 25, 772),

('Holiday Sale 50% Off', 0.50, '2026-01-01', '2026-02-28', NULL, 25, 2301),
('Holiday Sale 45% Off', 0.45, '2026-01-01', '2026-02-28', NULL, 25, 2302),
('Holiday Sale 40% Off', 0.40, '2026-01-01', '2026-02-28', NULL, 25, 2303),

('Clearance Sale 50% Off', 0.50, '2026-02-01', '2026-02-28', NULL, 25, 4551),
('Clearance Sale 50% Off', 0.50, '2026-02-01', '2026-02-28', NULL, 25, 4552),
('Clearance Sale 50% Off', 0.50, '2026-02-01', '2026-02-28', NULL, 25, 4553);
```

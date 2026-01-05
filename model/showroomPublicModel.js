const { response } = require('../controller/showroomPublicDB.js');
var db = require('./databaseConfig.js');

var showroomPublicDB = {
    // Carousel, show 3 random showrooms to be featured
    showRandomCarousel: function () {
        return new Promise((resolve, reject) => {
            const conn = db.getConnection();

            conn.connect((err) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                const sql = `
                    SELECT s.*, c.name AS category_name
                    FROM showroom s
                    JOIN showroom_category c
                    ON s.category_id = c.id
                    ORDER BY RAND()
                    LIMIT 3
                `;

                conn.query(sql, (err, rows) => {
                    conn.end();

                    if (err) {
                        return reject(err);
                    }

                    resolve(rows);
                });
            })
        })
    },

    showShowroomByCategory: function(category) {
        return new Promise((resolve, reject) => {
            const conn = db.getConnection();

            conn.connect((err) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                let sql = `
                    SELECT s.*, c.name AS category_name
                    FROM showroom s
                    JOIN showroom_category c
                    ON s.category_id = c.id
                `;

                const params = [];

                // if not 'all', filter by category
                if (category && category !== 'all') {
                    sql += ` WHERE c.name = ?`;
                    params.push(category);
                }

                conn.query(sql, params, (err, rows) => {
                    conn.end();

                    if (err) {
                        return reject(err);
                    }

                    resolve(rows);
                });
            })
        })
    },

    searchShowroomByName: function(search) {
        return new Promise((resolve, reject) => {
            const conn = db.getConnection();

            conn.connect((err) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                let sql = `
                    SELECT s.*, c.name AS category_name
                    FROM showroom s
                    JOIN showroom_category c
                    ON s.category_id = c.id
                    WHERE s.name LIKE ?
                `;
                const params = [`%${search}%`]; // search

                conn.query(sql, params, (err, rows) => {
                    conn.end();
                    if (err) return reject(err);
                    resolve(rows);
                });
            });
        });
    },

    // Filter Panel Features
    // Show all furniture category in list for filter panel
    showFurnitureCategory: function() {
        return new Promise((resolve, reject) => {
            const conn = db.getConnection();

            conn.connect((err) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                const sql = `
                    SELECT DISTINCT CATEGORY
                    FROM itementity
                    WHERE DTYPE = 'FurnitureEntity';
                `;

                conn.query(sql, (err, rows) => {
                    conn.end();

                    if (err) {
                        return reject(err);
                    }

                    resolve(rows);
                });
            })
        })
    },

    // Filter by Furniture category and/or dimensions 
    filter: function (filters) {
        return new Promise((resolve, reject) => {

            const conn = db.getConnection();

            conn.connect(err => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                console.log('Filters:', filters);

                /** SAMPLE INPUT 
                {
                    "name": "a" ,
                    "categories": ["Beds & Mattresses"],
                    
                    "width": 10,
                    "height": 44,
                    "length": 44
                }
                */

                let sql = `
                    SELECT s.*
                    FROM showroom s
                    WHERE EXISTS (
                        SELECT 1
                        FROM showroom_furniture sf
                        JOIN itementity f ON sf.furniture_id = f.ID
                        WHERE sf.showroom_id = s.id
                `;

                const params = [];

                // Furniture category filter
                if (filters.categories && filters.categories.length > 0) {
                    sql += ` AND f.CATEGORY IN (${filters.categories.map(() => '?').join(',')})`;
                    params.push(...filters.categories);
                }

                // Dimension filters 
                if (filters.lengthMin != null) {
                    sql += ` AND f._LENGTH >= ?`;
                    params.push(filters.lengthMin);
                }
                if (filters.lengthMax != null) {
                    sql += ` AND f._LENGTH <= ?`;
                    params.push(filters.lengthMax);
                }

                if (filters.widthMin != null) {
                    sql += ` AND f.WIDTH >= ?`;
                    params.push(filters.widthMin);
                }
                if (filters.widthMax != null) {
                    sql += ` AND f.WIDTH <= ?`;
                    params.push(filters.widthMax)
                }

                if (filters.heightMin != null) {
                    sql += ` AND f.HEIGHT >= ?`;
                    params.push(filters.heightMin);
                }
                if (filters.heightMax != null) {
                    sql += ` AND f.HEIGHT <= ?`;
                    params.push(filters.heightMax);
                }

                // Furniture Name Filter
                if (filters.name) {
                    sql += ` AND f.NAME LIKE ?`;
                    params.push(`%${filters.name}%`);
                }

                sql += `)`;

                console.log('FINAL SQL:', sql);
                console.log('PARAMS:', params);

                conn.query(sql, params, (err, results) => {
                    conn.end();

                    if (err) {
                        console.error('SQL ERROR:', err);
                        return reject(err);
                    }

                    console.log('ROWS RETURNED:', results.length);
                    resolve(results);
                });
            });
        });
    },

    // Individual Showroom Layout Display with furnitures attached 
    showShowroomDetailsById: function(id) {
        return new Promise((resolve, reject) => {
            const conn = db.getConnection();

            conn.connect((err) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                let sql = `
                    SELECT 
                        s.id AS showroom_id, s.name AS showroom_name, s.cover_image_url, s.description, -- showroom info
                        sf.furniture_id, sf.position_json,           -- furniture info
                        f.IMAGEURL,                                         
                        i.name AS furniture_name                                 
                    FROM showroom s
                    LEFT JOIN showroom_furniture sf ON s.id = sf.showroom_id
                    LEFT JOIN furnitureentity f ON sf.furniture_id = f.ID
                    LEFT JOIN itementity i ON sf.furniture_id = i.ID
                    WHERE s.id = ?
                `;

                conn.query(sql, [id], (err, results) => {
                    conn.end();
                    if (err) return reject(err);
                    resolve(results);
                });
            });
        });
    },

    showFurnitureDetailById: function(id) {
        return new Promise((resolve, reject) => {
            const conn = db.getConnection();

            conn.connect((err) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                let sql = `
                    SELECT
                        sf.furniture_id,
                        f.IMAGEURL,
                        i.ID, i.NAME, i.CATEGORY, i.DESCRIPTION, i.HEIGHT, i.WIDTH, i._LENGTH, i.SKU,
                        ce.RETAILPRICE AS PRICE

                    FROM showroom_furniture sf
                    LEFT JOIN furnitureentity f ON sf.furniture_id = f.ID
                    LEFT JOIN itementity i ON sf.furniture_id = i.ID
                    LEFT JOIN item_countryentity ce ON sf.furniture_id = ce.ITEM_ID
                    WHERE sf.furniture_id = ? 
                `
                conn.query(sql, [id], (err, results) => {
                    conn.end();
                    if (err) return reject(err);
                    resolve(results);
                });
            })
        })
    },

    showOtherFurnitureByCategory: function(showroomId) {
        return new Promise((resolve, reject) => {
            const conn = db.getConnection();
            conn.connect(err => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                console.log('Showroom id:', showroomId);

                // Get furnitures that uses the same category in the showroom
                // but NOT already in the showroom
                let sql = `
                    SELECT DISTINCT i.*, f.IMAGEURL, ic.RETAILPRICE
                    FROM itementity i
                    JOIN furnitureentity f ON i.ID = f.ID
                    JOIN item_countryentity ic ON f.ID = ic.ITEM_ID
                    JOIN countryentity c ON ic.COUNTRY_ID = c.ID
                    WHERE i.CATEGORY IN (
                        SELECT DISTINCT i2.CATEGORY
                        FROM showroom_furniture sf
                        JOIN itementity i2 ON sf.furniture_id = i2.ID
                        WHERE sf.showroom_id = ?
                    )
                    AND i.ID NOT IN (
                        SELECT furniture_id 
                        FROM showroom_furniture
                        WHERE showroom_id = ?
                    )
                    AND c.NAME = 'United States'
                    ORDER BY RAND()
                    LIMIT 8;
                `
                conn.query(sql, [showroomId, showroomId], (err, results) => {
                    conn.end();
                    if (err) return reject(err);
                    resolve(results);
                })
            })
        })
    }
    
}

module.exports = showroomPublicDB;
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
    filter: function() {
        
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
                        s.id AS showroom_id, s.name AS showroom_name, s.cover_image_url, -- showroom info
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
    }


}

module.exports = showroomPublicDB;
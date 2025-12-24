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
    } 

}

module.exports = showroomPublicDB;
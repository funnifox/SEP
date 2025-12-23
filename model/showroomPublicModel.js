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
    }
}

module.exports = showroomPublicDB;
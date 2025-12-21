var db = require('./databaseConfig.js');

var showroomDB = {
    // Create Category. Showrooms can have categories 
    addShowroomCategory: function (details) {
        return new Promise((resolve, reject) => {
            const conn = db.getConnection();

            conn.connect((err) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                // Check if name already exists
                const checkSql = `
                    SELECT id FROM showroom_category WHERE name = ?
                `;

                conn.query(checkSql, [details.name], (err, rows) => {
                    if (err) {
                        conn.end();
                        return reject(err);
                    }

                    // dupe
                    if (rows.length > 0) {
                        conn.end();
                        return reject({ type: 'DUPLICATE' });
                    }

                    // Insert only if not duplicate
                    const insertSql = `
                        INSERT INTO showroom_category (name, description)
                        VALUES (?, ?)
                    `;

                    conn.query(
                        insertSql,
                        [details.name, details.description],
                        (err, result) => {
                            conn.end();

                            if (err) {
                                return reject(err);
                            }

                            // Return inserted data
                            resolve({
                                success: true,
                                data: {
                                    id: result.insertId,
                                    name: details.name,
                                    description: details.description
                                }
                            });
                        }
                    );
                });
            });
        });
    },

    // Get Category
    getShowroomCategory: function() {
        return new Promise((resolve, reject) => {
            const conn = db.getConnection();

            conn.connect((err) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                const sql = `
                    SELECT id, name, description
                    FROM showroom_category
                    ORDER BY name ASC
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

module.exports = showroomDB;
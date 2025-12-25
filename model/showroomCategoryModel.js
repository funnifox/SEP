const { response } = require('../controller/showroomCategoryDB.js');
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
    },

    // Add Showroom Design
    addShowroom: function (details) {
        return new Promise((resolve, reject) => {
            const conn = db.getConnection();

            conn.connect((err) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                const checkSql = `
                    SELECT id FROM showroom WHERE name = ?
                `;

                conn.query(checkSql, [details.name], (err, rows) => {
                    if (err) {
                        conn.end();
                        return reject(err);
                    }

                    if (rows.length > 0) {
                        conn.end();
                        return reject({ type: 'DUPLICATE' });
                    }

                    const insertSql = `
                        INSERT INTO showroom
                            (name, description, category_id, cover_image_url)
                        VALUES
                            (?, ?, ?, ?)
                    `;

                    conn.query(
                        insertSql,
                        [details.name, details.description, details.categoryId, details.coverImage],
                        (err, result) => {
                            conn.end();
                            if (err) {
                                return reject(err);
                            }
                            resolve({
                                success: true,
                                data: {
                                    id: result.insertId,
                                    name: details.name,
                                    description: details.description,
                                    categoryId: details.categoryId,
                                    coverImage: details.coverImage
                                }
                            })
                        }
                    )
                    
                    
                })
            })
            
        })
    },

    // Get showrooms
    getShowroom: function() {
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

    // Get showroom by id
    getShowroomById: function (showroomId) {
        return new Promise((resolve, reject) => {
            const conn = db.getConnection();

            conn.connect(err => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                const showroomSql = `
                    SELECT s.*, c.name AS category_name
                    FROM showroom s
                    JOIN showroom_category c
                    ON s.category_id = c.id
                    WHERE s.id = ?;
                `;

                conn.query(showroomSql, [showroomId], (err, showroomRows) => {
                    if (err) {
                        conn.end();
                        return reject(err);
                    }

                    if (showroomRows.length === 0) {
                        conn.end();
                        return resolve(null);
                    }

                    const furnitureSql = `
                        SELECT f.*, position_json, fe.IMAGEURL
                        FROM showroom_furniture sf
                        JOIN itementity f
                        ON f.id = sf.furniture_id
                        JOIN furnitureentity fe
                        ON fe.id = sf.furniture_id
                        WHERE sf.showroom_id = ?;
                    `;

                    conn.query(furnitureSql, [showroomId], (err, furnitureRows) => {
                        conn.end();

                        if (err) {
                            return reject(err);
                        }

                        resolve({
                            showroom: showroomRows[0],
                            furniture: furnitureRows
                        });
                    });
                });
            });
        });
    },

    // Delete showroom by ID
    delShowroom: function (details) { 
        return new Promise((resolve, reject) => {
            const conn = db.getConnection();

            conn.connect((err) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                const checkSql = `
                    SELECT * FROM staffentity_roleentity WHERE staffs_ID = ? AND roles_ID = 1;
                `;

                conn.query(checkSql, [details.staffId], (err, rows, result) => {
                    if (err) {
                        conn.end();
                        return reject(err);
                    }

                    if (result.affectedRows === 0) {
                        conn.end();
                        return reject({ type: 'NOT_AUTHORIZED', staffId: rows[0].staffs_ID });
                    }

                    const insertSql = `
                        DELETE FROM showroom WHERE id = ?;
                    `;

                    conn.query(
                        insertSql,
                        [details.showroomId],
                        (err, result) => {
                            conn.end();
                            if (err) {
                                return reject(err);
                            }
                            resolve({
                                success: true,
                                data: {
                                    showroomId: details.showroomId,
                                    staffId: details.staffId
                                }
                            })
                        }
                    )
                    

                    if (result.affectedRows === 0) {
                        return reject({ type: 'NOT_FOUND', message: 'Showroom not found' });
                    }

                    
                })
            })
            
        })
    },
    // add furniture to showroom
    addShowroomFurniture: function (details, showroomId) {
        return new Promise((resolve, reject) => {
            const conn = db.getConnection();

            conn.connect(err => {
                if (err) return reject(err);

                const checkStaffSql = `
                    SELECT 1
                    FROM staffentity_roleentity
                    WHERE staffs_ID = ? AND roles_ID = 1
                    LIMIT 1;
                `;

                conn.query(checkStaffSql, [details.staffId], (err, staffRows) => {
                    if (err) {
                        conn.end();
                        return reject(err);
                    }

                    if (staffRows.length === 0) {
                        conn.end();
                        return reject({ type: "NOT_AUTHORIZED" });
                    }

                    const checkFurnitureSql = `
                        SELECT id
                        FROM itementity
                        WHERE name = ?
                        LIMIT 1;
                    `;

                    conn.query(checkFurnitureSql, [details.furnitureName], (err, furnitureRows) => {
                        if (err) {
                            conn.end();
                            return reject(err);
                        }

                        if (furnitureRows.length === 0) {
                            conn.end();
                            return reject({ type: "FURNITURE_NOT_FOUND" });
                        }

                        const furnitureId = furnitureRows[0].id;

                        console.log(furnitureId)
                        const insertSql = `
                            INSERT INTO showroom_furniture
                            (showroom_id, furniture_id, position_json)
                            VALUES (?, ?, ?);
                        `;

                        conn.query(
                            insertSql,
                            [showroomId, furnitureId, "{}"],
                            (err, result) => {
                                conn.end();

                                if (err) return reject(err);

                                resolve({
                                    success: true,
                                    data: {
                                        showroomId,
                                        furnitureId,
                                        staffId: details.staffId
                                    }
                                });
                            }
                        );
                    });
                });
            });
        });
    }

}

module.exports = showroomDB;
var db = require('./databaseConfig.js');
var promoFurniture = require('../model/promoFurniture');

var promotionDB = {

    /**
     * Get promotion products with filters
     * filters = {
     *   countryId: number (required),
     *   category: string (optional),
     *   minDiscount: number (optional, e.g. 0.3),
     *   maxPrice: number (optional),
     *   sort: 'discount' | 'endingSoon' | 'price'
     * }
     */
    getPromotionProducts: function (filters) {
        return new Promise((resolve, reject) => {
            var conn = db.getConnection();

            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }

                let sql = `
                    SELECT
                        i.ID as id,
                        i.NAME as name,
                        f.IMAGEURL as imageURL,
                        i.SKU as sku,
                        i.DESCRIPTION as description,
                        i.TYPE as type,
                        i._LENGTH as length,
                        i.WIDTH as width,
                        i.HEIGHT as height,
                        i.CATEGORY as category,
                        ic.RETAILPRICE as price,
                        p.DISCOUNTRATE as discountRate,
                        p.STARTDATE as startDate,
                        p.ENDDATE as endDate,
                        p.id as promoId,
                        (ic.RETAILPRICE * (1 - p.DISCOUNTRATE)) AS discountedPrice
                    FROM itementity i
                    INNER JOIN furnitureentity f ON i.ID = f.ID
                    INNER JOIN promotionentity p ON p.ITEM_ID = i.ID
                    INNER JOIN item_countryentity ic ON ic.ITEM_ID = i.ID
                    WHERE
                        i.ISDELETED = FALSE
                        AND ic.COUNTRY_ID = ?
                        AND p.COUNTRY_ID = ?
                        AND CURDATE() BETWEEN p.STARTDATE AND p.ENDDATE
                `;

                const params = [
                    filters.countryId,
                    filters.countryId
                ];

                // Optional filters
                if (filters.category && filters.category !== '') {
                    sql += ' AND i.CATEGORY = ?';
                    params.push(filters.category);
                }

                if (filters.minDiscount) {
                    sql += ' AND p.DISCOUNTRATE >= ?';
                    params.push(filters.minDiscount);
                }

                if (filters.maxPrice) {
                    sql += ' AND (ic.RETAILPRICE * (1 - p.DISCOUNTRATE)) <= ?';
                    params.push(filters.maxPrice);
                }

                // Sorting
                switch (filters.sort) {
                    case 'price':
                        sql += ' ORDER BY discountedPrice ASC';
                        break;
                    case 'endingSoon':
                        sql += ' ORDER BY p.ENDDATE ASC';
                        break;
                    default:
                        sql += ' ORDER BY p.DISCOUNTRATE DESC';
                        break;
                }

                conn.query(sql, params, function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return reject(err);
                    }

                    var promoList = [];
                    
                    for (var i = 0; i < result.length; i++) {
                        var fur = new promoFurniture();
                        fur.id = result[i].id;
                        fur.name = result[i].name;
                        fur.imageURL = result[i].imageURL;
                        fur.sku = result[i].sku;
                        fur.description = result[i].description;
                        fur.type = result[i].type;
                        fur.length = result[i].length;
                        fur.width = result[i].width;
                        fur.height = result[i].height;
                        fur.category = result[i].category;
                        

                        // pricing
                        fur.price = result[i].price;
                        fur.discountRate = result[i].discountRate;
                        fur.discountedPrice = result[i].discountedPrice;

                        // promotion dates
                        fur.startDate = result[i].startDate;
                        fur.endDate = result[i].endDate;
                        fur.promoId = result[i].promoId;

                        promoList.push(fur);
                    }

                    return resolve(promoList);
                });
            });
        });
    },
    createPromotion: function (data) {
        return new Promise((resolve, reject) => {
            var conn = db.getConnection();
            conn.connect(err => {
                if (err) return reject(err);

                const sql = `
                    INSERT INTO promotionentity
                    (DESCRIPTION, DISCOUNTRATE, STARTDATE, ENDDATE, COUNTRY_ID, ITEM_ID)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;

                conn.query(sql, [
                    data.description,
                    data.discountRate,
                    data.startDate,
                    data.endDate,
                    data.countryId,
                    data.itemId
                ], (err, result) => {
                    conn.end();
                    if (err) return reject(err);
                    resolve(result.insertId);
                });
            });
        });
    },

    updatePromotion: function (id, data) {
        return new Promise((resolve, reject) => {
            var conn = db.getConnection();
            conn.connect(err => {
                if (err) return reject(err);

                const sql = `
                    UPDATE promotionentity
                    SET DESCRIPTION = ?, DISCOUNTRATE = ?, STARTDATE = ?, ENDDATE = ?
                    WHERE ID = ?
                `;

                conn.query(sql, [
                    data.description,
                    data.discountRate,
                    data.startDate,
                    data.endDate,
                    id
                ], (err, result) => {
                    conn.end();
                    if (err) return reject(err);
                    resolve(result.affectedRows > 0);
                });
            });
        });
    },

    deletePromotion: function (id) {
        return new Promise((resolve, reject) => {
            var conn = db.getConnection();
            conn.connect(err => {
                if (err) return reject(err);

                conn.query(
                    'DELETE FROM promotionentity WHERE ID = ? LIMIT 1;',
                    [id],
                    (err, result) => {
                        conn.end();
                        if (err) return reject(err);
                        resolve(result.affectedRows > 0);
                    }
                );
            });
        });
    }
};



module.exports = promotionDB;

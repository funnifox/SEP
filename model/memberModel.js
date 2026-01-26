var db = require('./databaseConfig.js');
var Member = require('./member.js');
var ShoppingCartLineItem = require('./shoppingCartLineItem.js');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
let jwt = require('jsonwebtoken');
let config = require('./config');
var memberDB = {
    checkMemberLogin: function (email, password) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM memberentity m WHERE m.EMAIL=?';
                    conn.query( sql, [email], (err, result) => {
                        if (err){
                            conn.end();
                            return reject(err);
                        }
                        else {
                            if(result == null || result == undefined || result == '') {
                                conn.end();
                                return resolve({success:false});
                            }
                            var member = new Member();
                            member.email = result[0].EMAIL;
                            member.passwordHash = result[0].PASSWORDHASH;

                            bcrypt.compare(password, member.passwordHash, function(err, res) {
                                if(res) {
                                    var token = jwt.sign({username: member.email},
                                        config.secret,
                                        { 
                                            expiresIn: '12h'
                                        }
                                    );
                                    conn.end();
                                    return resolve({success:true, email:member.email, token: token});
                                } else {
                                    conn.end();
                                    return resolve({success:false});
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    getMemberAuthState: function (email) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM memberentity m WHERE m.EMAIL=?';
                    conn.query(sql, [email], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var member = new Member();
                            member.accountActivationStatus = result[0].ACCOUNTACTIVATIONSTATUS;
                            conn.end();
                            return resolve(member);
                        }
                    });
                }
            });
        });
    },
    getMember: function (email) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT m.*, c.NAME as COUNTRY_NAME FROM memberentity m LEFT JOIN countryentity c ON m.country_id = c.COUNTRYCODE WHERE m.email = ?;';
                    conn.query(sql, [email], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var member = new Member();
                            member.id = result[0].ID;
                            member.dob = result[0].DOB;
                            member.accountActivationStatus = result[0].ACCOUNTACTIVATIONSTATUS;
                            member.accountLockStatus = result[0].ACCOUNTLOCKSTATUS;
                            member.activationCode = result[0].ACTIVATIONCODE;
                            member.address = result[0].ADDRESS;
                            member.age = result[0].AGE;
                            member.city = result[0].CITY;
                            member.cumulativeSpending = result[0].CUMULATIVESPENDING;
                            member.email = result[0].EMAIL;
                            member.income = result[0].INCOME;
                            member.isDeleted = result[0].ISDELETED;
                            member.joinDate = result[0].JOINDATE;
                            member.loyaltyCardId = result[0].LOYALTYCARDID;
                            member.loyaltyPoints = result[0].LOYALTYPOINTS;
                            member.name = result[0].NAME;
                            member.occupation = result[0].OCCUPATION;
                            member.passwordHash = result[0].PASSWORDHASH;
                            member.passwordReset = result[0].PASSWORDRESET;
                            member.phone = result[0].PHONE;
                            member.securityAnswer = result[0].SECURITYANSWER;
                            member.securityQuestion = result[0].SECURITYQUESTION;
                            member.sla = result[0].SERVICELEVELAGREEMENT;
                            member.zipcode = result[0].ZIPCODE;
                            member.loyaltyTierId = result[0].LOYALTYTIER_ID;
                            member.countryName = result[0].COUNTRY_NAME;
                            member.wishlistId = result[0].WISHLIST_ID;
                            member.stripeCustomerId = result[0].STRIPECUSTOMERID;
                            conn.end();
                            return resolve(member);
                        }
                    });
                }
            });
        });
    },
    getBoughtItem: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = "SELECT i.SKU,i.NAME as 'ITEM_NAME',ic.RETAILPRICE,li.QUANTITY,sr.CREATEDDATE,f.IMAGEURL,sr.ID,"
                        +" d.NAME, d.DELIVERY_ADDRESS, d.POSTAL_CODE, d.CONTACT"
                        +" FROM itementity i,item_countryentity ic,lineitementity li,salesrecordentity sr,"
                        +" salesrecordentity_lineitementity sl,furnitureentity f, deliverydetailsentity d"
                        +" WHERE sr.MEMBER_ID=? AND d.SALERECORD_ID = sr.id AND i.ID=ic.ITEM_ID AND"
                        +" ic.COUNTRY_ID=25 AND li.ITEM_ID=i.ID AND sr.ID=sl.SalesRecordEntity_ID AND"
                        +" li.ID=sl.itemsPurchased_ID AND f.ID=i.ID";
                    conn.query(sql, [id], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var itemList = [];
                            for(var i = 0; i < result.length; i++) {
                                var boughtItems = new ShoppingCartLineItem();
                                boughtItems.id = result[i].ID;
                                boughtItems.sku = result[i].SKU;
                                boughtItems.itemName = result[i].ITEM_NAME;
                                boughtItems.retailPrice = result[i].RETAILPRICE;
                                boughtItems.quantity = result[i].QUANTITY;
                                boughtItems.createddate = result[i].CREATEDDATE;
                                boughtItems.imageUrl = result[i].IMAGEURL;
                                boughtItems.customerName = result[i].NAME;
                                boughtItems.address = result[i].DELIVERY_ADDRESS;
                                boughtItems.postalCode = result[i].POSTAL_CODE;
                                boughtItems.phone = result[i].CONTACT;
                                itemList.push(boughtItems);
                            }
                            conn.end();
                            return resolve(itemList);
                        }
                    });
                }
            });
        });
    },
    checkMemberEmailExists: function (email) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM memberentity m WHERE m.EMAIL=?';
                    conn.query(sql, [email], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.length == 0) {
                                conn.end();
                                return resolve(false);
                            }
                            else {
                                conn.end();
                                return resolve(true);
                            }
                        }
                    });
                }
            });
        });
    },
    registerMember: function (email, password, hostName) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    bcrypt.hash(password, 5, function(err, hash) {
                        var activationCode = generateRandomNumber(40);
                        var passwordReset = generateRandomNumber(40);
                        var sqlArgs = [activationCode, email, new Date(), hash, passwordReset];
                        var sql = 'INSERT INTO memberentity(ACTIVATIONCODE,EMAIL,JOINDATE,PASSWORDHASH,PASSWORDRESET,LOYALTYTIER_ID)'
                            + 'values(?,?,?,?,?,15)';
                        conn.query(sql, sqlArgs, function (err, result) {
                            if (err) {
                                conn.end();
                                return reject(err);
                            } else {
                                if(result.affectedRows > 0) {
                                    var mailOptions = {
                                        from: 'islandfurnituresep@gmail.com',
                                        to: email,
                                        subject: 'Island Furniture Member Account Activation',
                                        text: 'Greetings from Island Furniture... \n\n'
                                            + 'Click on the link below to activate your Island Furniture account: \n\n'
                                            + 'http://' + hostName + '/activateMemberAccount.html?email=' + email + '&activateCode=' + activationCode
                                    };
                                    emailer.sendMail(mailOptions, function(error, info){
                                        if (error) {
                                            console.log(error);
                                        }
                                    });
                                    conn.end();
                                    return resolve({success:true});
                                }
                            }
                        });
                    });
                }
            });
        });
    },
    getMemberActivateCode: function (email) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM memberentity m WHERE m.EMAIL=?';
                    conn.query(sql, [email], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var member = new Member();
                            member.activationCode = result[0].ACTIVATIONCODE;
                            conn.end();
                            return resolve(member);
                        }
                    });
                }
            });
        });
    },
    memberActivateAccount: function (email) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    sql = 'UPDATE memberentity SET ACCOUNTACTIVATIONSTATUS=1 WHERE EMAIL=?';
                    conn.query(sql, [email], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.affectedRows > 0) {
                                conn.end();
                                return resolve({success:true});
                            }
                        }
                    });
                }
            });
        });
    },

    // new updateMember Model (fixed)
    // Change Request: Editing User Profile should allow user to change password if user chooses to. 
    // Change Request: User should be allowed to update user profile without changing password.
    updateMember: function (details) {
        return new Promise((resolve, reject) => {
            const conn = db.getConnection();

            conn.connect((err) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                // fields and values are stored as array first
                var fields = [];
                var values = [];

                // Change Request: Editing User Profile should allow user to change password if user chooses to.
                
                // Fields and value array contains the updated profile field values
                fields.push("NAME=?");
                values.push(details.name);

                fields.push("PHONE=?");
                values.push(details.phone);

                fields.push("CITY=?");
                values.push(details.country);

                fields.push("ADDRESS=?");
                values.push(details.address);

                fields.push("SECURITYQUESTION=?");
                values.push(details.securityQuestion);

                fields.push("SECURITYANSWER=?");
                values.push(details.securityAnswer);

                fields.push("AGE=?");
                values.push(details.age);

                fields.push("INCOME=?");
                values.push(details.income);

                fields.push("SERVICELEVELAGREEMENT=?");
                values.push(details.sla);

                // password can be optional
                // Change Request: User should be allowed to update user profile without changing password.
                if (details.password && details.password !== "") {
                    // if user did input password as seen in details, hash the password
                    bcrypt.hash(details.password, 5, function (err, hash) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        }

                        // now password is considered as an updated value
                        fields.push("PASSWORDHASH=?");
                        values.push(hash);

                        runUpdate(fields, values);
                    });
                } else {
                    runUpdate(fields, values);
                }

                // This function collects the fields and values as parameter 
                // It also contains the sql query to update all the fields by the value
                function runUpdate(fields, values) {

                    // Update member by email
                    var sql = `
                        UPDATE memberentity
                        SET ${fields.join(", ")}
                        WHERE EMAIL=?
                    `;

                    values.push(details.email);

                    conn.query(sql, values, function (err, result) {
                        conn.end();

                        if (err) return reject(err);

                        if (result.affectedRows === 0) {
                            return reject(new Error("No member updated"));
                        }

                        resolve({ success: true });
                    });
                }
            })
        })
    },

    // bug? (old model)
    /*
    updateMember: function (details) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var email = details.email;
                    var name = details.name;
                    var phone = details.phone;
                    var country = details.country;
                    var address = details.address;
                    var securityQuestion = details.securityQuestion;
                    var securityAnswer = details.securityAnswer;
                    var age = details.age;
                    var income = details.income;
                    var sla = details.sla;
                    var password = details.password;
                    if(password == null || password == '') {
                        var sql = 'UPDATE memberentity SET NAME=?, PHONE=?, CITY=?, ADDRESS=?, SECURITYQUESTION=?,'
                        + 'SECURITYANSWER=?, AGE=?, INCOME=?, SERVICELEVELAGREEMENT=? WHERE EMAIL=?';
                        var sqlArgs = [name,phone,country,address,securityQuestion,securityAnswer,age,income,sla,email];
                        conn.query(sql, sqlArgs, function (err, result) {
                            if (err) {
                                conn.end();
                                return reject(err);
                            } else {
                                if(result.affectedRows > 0) {
                                    conn.end();
                                    return resolve({success:true});
                                }
                            }
                        });
                    }
                    else {
                        bcrypt.hash(password, 5, function(err, hash) {
                            var sql = 'UPDATE memberentity SET NAME=?, PHONE=?, CITY=?, ADDRESS=?, SECURITYQUESTION=?,'
                                + 'SECURITYANSWER=?, AGE=?, INCOME=?, SERVICELEVELAGREEMENT=?, PASSWORDHASH=? WHERE EMAIL=?';
                            var sqlArgs = [name,phone,country,address,securityQuestion,securityAnswer,age,income,sla,hash,email];
                            conn.query(sql, sqlArgs, function (err, result) {
                                if (err) {
                                    conn.end();
                                    return reject(err);
                                } else {
                                    if(result.affectedRows > 0) {
                                        conn.end();
                                        return resolve({success:true});
                                    }
                                }
                            });
                        });
                    }
                }
            });
        });
    },
    */

    sendPasswordResetCode: function (email, url) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM memberentity m WHERE m.EMAIL=?';
                    conn.query(sql, [email], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var member = JSON.parse(JSON.stringify(result[0]));
                            var mailOptions = {
                                from: 'islandfurnituresep@gmail.com',
                                to: email,
                                subject: 'Island Furniture Member Password Reset',
                                text: 'Greetings from Island Furniture... \n\n'
                                + 'Here is your activation code to be keyed in in order to reset your member account password :\n\n'
                                + 'Activation Code: ' + member.PASSWORDRESET + '\n\n'
                                + 'Link to reset your password: http://' + url + '/memberResetPassword.html?email=' + email
                            };
                            emailer.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    console.log(error);
                                }
                            });
                            conn.end();
                            return resolve({success: true});
                        }
                    });
                }
            });
        });
    },
    getPasswordResetCode: function (email) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM memberentity m WHERE m.EMAIL=?';
                    conn.query(sql, [email], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var member = new Member();
                            member.passwordReset = result[0].PASSWORDRESET;
                            conn.end();
                            return resolve(member);
                        }
                    });
                }
            });
        });
    },
    updateMemPasswordAndResetCode: function (email, password) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    bcrypt.hash(password, 5, function(err, hash) {
                        var sql = 'UPDATE memberentity SET PASSWORDHASH=?,PASSWORDRESET=? WHERE EMAIL=?';
                        var sqlArgs = [hash,generateRandomNumber(40),email];
                        conn.query(sql, sqlArgs, function (err, result) {
                            if (err) {
                                conn.end();
                                return reject(err);
                            } else {
                                if(result.affectedRows > 0) {
                                    conn.end();
                                    return resolve({success:true});
                                }
                            }
                        });
                    });
                }
            });
        });
    },
    sendFeedback: function (name, email, subject, message) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'INSERT INTO feedbackentity(EMAIL,MESSAGE,NAME,SUBJECT) values(?,?,?,?)';
                    conn.query(sql, [email, message, name, subject], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.affectedRows > 0) {
                                var mailOptions = {
                                    from: 'islandfurnituresep@gmail.com',
                                    to: 'islandfurnituresep@gmail.com',
                                    subject: 'Island Furniture Member Feedback',
                                    text: 'Feedback from Island Furniture member'
                                        + '\nName: ' + name
                                        + '\nEmail: ' + email
                                        + '\nSubject: ' + subject
                                        + '\nMessage:\n\n' + message
                                };
                                emailer.sendMail(mailOptions, function(error, info){
                                    if (error) {
                                        console.log(error);
                                    }
                                });
                                conn.end();
                                return resolve({success:true});
                            }
                        }
                    });
                }
            });
        });
    },

    // bug?
    verifyPassword: function (id, password) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM memberentity m WHERE m.ID=?';
                    conn.query( sql, [id], (err, result) => {
                        if (err){
                            conn.end();
                            return reject(err);
                        }
                        else {
                            if(result == null || result == undefined || result == '') {
                                conn.end();
                                return resolve({success:false});
                            }
                            var member = new Member();
                            member.email = result[0].EMAIL;
                            member.passwordHash = result[0].PASSWORDHASH;

                            bcrypt.compare(password, member.passwordHash, function(err, res) {
                                if(res) {
                                    conn.end();
                                    return resolve({success:true});
                                } else {
                                    conn.end();
                                    return resolve({success:false});
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    updateMemberStripeCustomerId: function (email, customerId) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'UPDATE memberentity SET STRIPECUSTOMERID=? WHERE EMAIL=?';
                    conn.query(sql, [customerId,email], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.affectedRows > 0) {
                                conn.end();
                                return resolve({success:true});
                            }
                        }
                    });
                }
            });
        });
    },
    updateMemberDeliveryDetails: function (email,name,contactNum,address,postalCode) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'UPDATE memberentity SET NAME=?, PHONE=?, ADDRESS=?, ZIPCODE=? WHERE EMAIL=?';
                    conn.query(sql, [name,contactNum,address,postalCode,email], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.affectedRows > 0) {
                                conn.end();
                                return resolve({success:true});
                            }
                        }
                    });
                }
            });
        });
    }
};
module.exports = memberDB

var generateRandomNumber = function(digits){
    return crypto.randomBytes(Math.ceil(digits/2)).toString('hex');
};

var emailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dummy.gemail.acc@gmail.com',
        pass: 'ongq zgdt aygz onvk'
    }
});
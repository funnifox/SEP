var express = require('express');
var app = express();
var path = require("path");

app.use(express.static('view'));
app.use(express.static("node_modules"));
app.use(require('./memberentityDB.js'));
app.use(require('./furnitureentityDB.js'));
app.use(require('./retailproductentityDB.js'));
app.use(require('./countryentityDB.js'));
app.use(require('./storeentityDB.js'));
app.use(require('./payment.js'));
app.use(require('./staffentityDB.js'));
app.use(require('./rawmaterialentityDB.js'));
app.use(require('./purchaseorderentityDB.js'));
app.use(require('./shippingorderentityDB.js'));
app.use(require('./supplierentityDB.js'));
app.use(require('./warehouseentityDB.js'));
app.use(require('./lineitementityDB.js'));
app.use(require('./storagebinentityDB.js'));

// Showroom
app.use(require('./showroomCategoryDB.js'));
app.use(require('./showroomPublicDB.js'))

// Promotion
app.use(require('./promotionDB.js'));

// for image upload url handling
app.use(express.static(path.join(__dirname, "view")));
app.use(express.static(path.join(__dirname, "node_modules")));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));


// img url testing (help me remove if i forget)
app.get("/test", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "uploads", "showrooms", "1766480145417.png"));
});

let middleware = require('./middleware');
app.get('/api/checkToken', middleware.checkToken, function (req, res) {
    res.send({success: true});
});

module.exports = app
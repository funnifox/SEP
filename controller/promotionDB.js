var express = require('express');
var app = express();
let middleware = require('./middleware');

var promotion = require('../model/promotionModel.js');

app.get('/api/getPromotionProducts', /*middleware.checkToken,*/ function (req, res) {
    // Extract filters from query parameters
    const filters = {
        countryId: req.query.countryId ? parseInt(req.query.countryId) : 25, // default country
        category: req.query.category || null,
        minDiscount: req.query.minDiscount ? parseFloat(req.query.minDiscount) : null,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
        sort: req.query.sort || 'discount' // default sort by discount
    };

    promotion.getPromotionProducts(filters)
        .then(result => {
            res.json(result); // send JSON response
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Failed to get promotion products");
        });
});


// Create promotion
app.post('/api/admin/promotions', (req, res) => {
    promotion.createPromotion(req.body)
        .then(id => res.json({ success: true, id }))
        .catch(err => res.status(500).send(err));
});

// Update promotion
app.put('/api/admin/promotions/:id', (req, res) => {
    promotion.updatePromotion(req.params.id, req.body)
        .then(success => res.json({ success }))
        .catch(err => res.status(500).send(err));
});

// Delete promotion
app.delete('/api/admin/promotions/:id', (req, res) => {
    promotion.deletePromotion(req.params.id)
        .then(success => res.json({ success }))
        .catch(err => res.status(500).send(err));
});




module.exports = app;
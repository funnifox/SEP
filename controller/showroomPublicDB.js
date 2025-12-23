var express = require('express');
var app = express();
let middleware = require('./middleware.js');

var showroomPublic = require('../model/showroomPublicModel.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });

app.get('/api/showRandomCarousel', function (req, res) {
    showroomPublic.showRandomCarousel()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Failed to retrieve showroom categories"
            });
        })
})

module.exports = app;
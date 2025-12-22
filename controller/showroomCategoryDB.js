var express = require('express');
var app = express();
let middleware = require('./middleware.js');

var showroom = require('../model/showroomCategoryModel.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });

// ADD SHOWROOM CATEGORY
app.post('/api/addShowroomCategory',
    jsonParser,
    function (req, res) {

        // missing field
        if (!req.body || !req.body.name || req.body.name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        showroom.addShowroomCategory(req.body)
            .then((result) => {
                res.status(201).send(result);
            })
            .catch((err) => {

                if (err.type === 'DUPLICATE') {
                    return res.status(409).json({
                        success: false,
                        message: "Category already exists"
                    });
                }

                console.log(err);
                res.status(500).json({
                    success: false,
                    message: "Failed to add showroom category"
                })
            });
    }
);

// GET SHOWROOM CATEGORY 
app.get('/api/getShowroomCategory',
    function (req, res) {

        showroom.getShowroomCategory()
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: "Failed to retrieve showroom categories"
                });
            });
    }
);

// ADD SHOWROOM LAYOUT DESIGN


module.exports = app;
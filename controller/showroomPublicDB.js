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

app.get('/api/showShowroomByCategory', function (req, res) {
    const category = req.query.category || 'all';
    showroomPublic.showShowroomByCategory(category)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Failed to retrieve showrooms"
            });
        });
})

app.get('/api/showShowroomBySearch', function (req, res) {
    const searchTerm = req.query.q || ''; // get ?q=searchTerm 

    showroomPublic.searchShowroomByName(searchTerm)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Failed to search showrooms"
            });
        });
});

app.get('/api/getFurnitureCategory', function (req, res) {
    showroomPublic.showFurnitureCategory()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Failed to retrieve furniture categories"
            });
        })
})

app.get('/api/getShowroomDetails', function (req, res) {
    const showroomId = req.query.id; // ?id=SHOWROOM_ID

    if (!showroomId) {
        return res.status(400).json({
            success: false,
            message: "Showroom ID is required"
        });
    }

    showroomPublic.showShowroomDetailsById(showroomId)
        .then((result) => {
            // Showroom info + furnitures array
            let showroomData = {};
            if (result.length > 0) {
                showroomData.id = result[0].showroom_id;
                showroomData.name = result[0].showroom_name;
                showroomData.coverImage = result[0].cover_image_url;
                showroomData.description = result[0].description;
                showroomData.furnitures = result.map(item => ({
                    id: item.furniture_id,
                    name: item.furniture_name,
                    image: item.IMAGEURL,
                    position: JSON.parse(item.position_json)
                }));
            }

            res.status(200).json({
                success: true,
                data: showroomData
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Failed to retrieve showroom details"
            });
        });
});

app.get('/api/getFurnitureDetailById', function(req, res) {
    const furnitureId = req.query.id; // ?=furniture_id

    if (!furnitureId) {
        return res.status(400).json({
            success: false,
            message: "Furniture ID is required"
        });
    }

    showroomPublic.showFurnitureDetailById(furnitureId)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Failed to get furniture info"
            });
        });
})

app.post('/api/filterShowroom', express.json(), (req, res) => {

        console.log('REQ BODY:', req.body);

        const filters = {
            categories: req.body.categories || [],
            length: req.body.length || null,
            width: req.body.width || null,
            height: req.body.height || null
        };

        showroomPublic.filter(filters)
            .then(results => {
                res.json(results);
            })
            .catch(err => {
                console.error('Filter showroom error:', err);
                res.status(500).json({ error: 'Failed to filter showrooms' });
            });
    }
);

module.exports = app;
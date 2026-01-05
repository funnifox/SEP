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

app.get('/api/getOtherFurniture', function(req, res) {
    const showroomId = req.query.id;

    if (!showroomId) {
        return res.status(400).json({
            success: false,
            message: 'Showroom ID is required',
        });
    }

    showroomPublic.showOtherFurnitureByCategory(showroomId) 
        .then(results => {
            if (!results || results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No other furniture found for this showroom',
                    data: []
                });
            }

            res.json({
                success: true,
                count: results.length,
                data: results
            })
        })
        .catch(err => {
            console.error('Error fetching other furniture:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch other furniture',
            });
        });
})

app.post('/api/filterShowroom', express.json(), (req, res) => {

        console.log('REQ BODY:', req.body);

        /* SAMPLE INPUT
`        {
            "name": "BRUSALI" ,
            "categories": ["Beds & Mattresses"],
            
            "widthMin": 10,
            "widthMax": 300,
            "lengthMin": 10,
            "lengthMax": 300,
            "heightMin": 10,
            "heightMax": 300
        }`
        */

        const filters = {
            name: req.body.name || null,
            categories: req.body.categories || [],

            lengthMin: req.body.lengthMin !== undefined ? req.body.lengthMin : null,
            lengthMax: req.body.lengthMax !== undefined ? req.body.lengthMax : null,

            widthMin: req.body.widthMin !== undefined ? req.body.widthMin : null,
            widthMax: req.body.widthMax !== undefined ? req.body.widthMax : null,

            heightMin: req.body.heightMin !== undefined ? req.body.heightMin : null,
            heightMax: req.body.heightMax !== undefined ? req.body.heightMax : null
        };

        showroomPublic.filter(filters)
            .then(results => {

                // No results found
                if (!results || results.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'No showrooms found matching the filters',
                        data: []
                    })
                }

                // Result found
                res.json({
                    success: true,
                    count: results.length,
                    data: results
                });
            })
            .catch(err => {
                console.error('Filter showroom error:', err);
                res.status(500).json({ error: 'Failed to filter showrooms' });
            });
    }
);

module.exports = app;
var express = require('express');
var app = express();
let middleware = require('./middleware.js');
const uploadImg = require("../view/file-upload.js");


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
// integrated multer here
app.post('/api/addShowroom', uploadImg.single("coverImage"), function(req, res) {

    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
                                                 //has to b req.file, req.coverImage will always b undefined
    if (!req.body.name || !req.body.categoryId || !req.file) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    // save image to uploads/showrooms folder, to be displayed as src="/uploads/showrooms/filename"
    const imagePath = `/uploads/showrooms/${req.file.filename}`;


    showroom.addShowroom({
        name: req.body.name,
        description: req.body.description,
        categoryId: req.body.categoryId,
        coverImage: imagePath 
    })

    .then(result => res.status(201).json(result))
    .catch(err => {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to add showroom"
        });
    });
});

// GET SHOWROOM
app.get('/api/getShowroom', function(req, res) {
    showroom.getShowroom()
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
 
// GET SHOWROOM BY ID
app.get('/api/getShowroomById/:id', function(req, res) {
    showroom.getShowroomById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: `Failed to retrieve showroom ${req.params.id}`
            });
        });
})

// DELETE SHOWROOM
app.delete('/api/delShowroom', jsonParser,function (req, res) {

     
        // missing field
        if (!req.body||!req.body.showroomId||!req.body.staffId) {
            return res.status(400).json({
                success: false,
                message: "missing parameters"
            });
        }

        showroom.delShowroom(req.body)
            .then((result) => {
                res.status(201).send(result);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: "Failed to delete showroom"
                })
            });
    }
);

// DELETE FURNITURE FROM SHOWROOM
app.delete('/api/delShowroomFurniture/:showroomId', jsonParser,function (req, res) {

     
        // missing field
        if (!req.body||!req.params.showroomId||!req.body.staffId) {
            return res.status(400).json({
                success: false,
                message: "missing parameters"
            });
        }

        showroom.delShowroomFurniture(req.body, req.params.showroomId)
            .then((result) => {
                res.status(201).send(result);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: "Failed to delete showroom"
                })
            });
    }
);

// ADD SHOWROOM FURNITURE
app.post('/api/addShowroomFurniture/:showroomId', jsonParser,function (req, res) {

     
        // missing field
        if (!req.body||!req.params.showroomId) {
            return res.status(400).json({
                success: false,
                message: "missing parameters"
            });
        }

    showroom.addShowroomFurniture(req.body, req.params.showroomId)
            .then((result) => {
                res.status(201).send(result);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: "Failed to add furniture to showroom"
                })
            });
    }
);
module.exports = app;
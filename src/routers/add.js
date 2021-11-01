const express = require('express')
const router = new express.Router();
const Year = require('../models/Year')
const Faculty = require('../models/Faculty')
const Model = require('../models/Model')
const Course = require('../models/Course')
const { nanoid } = require('nanoid');
var multer = require('multer')
const fs = require('fs')
const upload = multer({ dest: 'images', storage: multer.memoryStorage() });



router.post('/add-faculty', async (req, res) => {
    const faculty = new Faculty({ pubId: nanoid(), name: req.body.facultyName });
    await faculty.save();
    res.send({
        status: 'Success'
    })
})

router.post('/add-year', async (req, res) => {
    const year = new Year({ pubId: nanoid(), name: req.body.yearName });
    await year.save();

    const faculty = await Faculty.findOne({ pubId: req.body.facultyPubId });
    faculty.years = faculty.years.concat(year._id);
    await faculty.save();
    res.send({
        status: "Success"
    })
})

router.post('/add-years-model', upload.array("files", 5), async (req, res) => {
    let smallImg = req.files[0].buffer;
    let bigImg = req.files[1].buffer
    bigImg = new Buffer(bigImg, 'base64');
    smallImg = new Buffer(smallImg, 'base64');
    const pubId = nanoid();
    fs.writeFile(`./src/images/models/big/${pubId}.jpg`, bigImg, function (err) {
        console.log(err);
    });
    fs.writeFile(`./src/images/models/small/${pubId}.jpg`, smallImg, function (err) {
        console.log(err);
    });
    
    const model = new Model({ pubId, name: req.body.modelName, description: req.body.description });
    await model.save();

    const year = await Year.findOne({ pubId: req.body.yearPubId})
    year.models = year.models.concat(model._id);
    await year.save();
    res.send({
        status: "Success"
    })
})

router.post('/add-course', async (req, res) => {
    const course = new Course({ pubId: nanoid(), name: req.body.courseName });
    await course.save();

    const model = await Model.findOne({pubId: req.body.modelPubId})
    model.courses = model.courses.concat(course._id);
    await model.save();
    res.send({
        status: "Success"
    })
})

module.exports = router
const express = require('express')
const router = new express.Router();
const Year = require('../models/Year')
const Faculty = require('../models/Faculty')
const Model = require('../models/Model')
const Course = require('../models/Course')
const { nanoid } = require('nanoid');

router.post('/remove-course', async (req, res) => {
    console.log(req.body);

    const course = await Course.findOneAndDelete({ pubId: req.body.coursePubId })
    const model = await Model.findOne({ pubId: req.body.modelPubId });
    console.log(course);
    console.log(model);
    model.courses.splice(model.courses.indexOf(course._id), 1);
    await model.save();
    res.send({
        status: 'Success'
    })
})

router.post('/remove-model', async (req, res) => {
    console.log(req.body);

    const model = await Model.findOneAndDelete({pubId: req.body.modelPubId})
    const year = await Year.findOne({pubId: req.body.yearPubId});
    console.log(year);
    console.log(model);
    year.models.splice(year.models.indexOf(model._id), 1);
    await year.save();
    res.send({
        status: 'Success'
    })
})
router.post('/remove-year', async (req, res) => {
    const year = await Year.findOneAndDelete({ pubId: req.body.yearPubId })
    const faculty = await Faculty.findOne({pubId: req.body.facultyPubId});
    faculty.years.splice(faculty.years.indexOf(year._id), 1);
    await faculty.save();
    res.send({
        status: 'Success'
    })
})
router.post('/remove-faculty', async (req, res) => {
    await Faculty.findOneAndDelete({ pubId: req.body.facultyPubId })
    res.send({
        status: 'Success'
    })
})
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

router.post('/add-years-model', async (req, res) => {
    console.log(req.body);
    const model = new Model({ pubId: nanoid(), name: req.body.modelName, description: req.body.description });
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
const express = require('express');
const router = new express.Router();
const Faculty = require('../models/Faculty');
const Year = require('../models/Year');
const Model = require('../models/Model');
const { nanoid } = require('nanoid');
const Course = require('../models/Course');
const Account = require('../models/Account');
const Tutorat = require('../models/Tutorat');


router.post('/faculties', async (req, res) => {
    const faculties = await Faculty.find({});
    const data = []
    for (let i = 0; i < faculties.length; i++) {
        data.push({
            pubId: faculties[i].pubId,
            name: faculties[i].name,
        })
    }
    res.send({
        faculties: data,
        status: 'Success'
    })

})

router.post('/years', async (req, res) => {
    const faculty = await Faculty.findOne({ pubId: req.body.facultyPubId })
    const years_ids = faculty.years;
    const years = []
    for (let i = 0; i < years_ids.length; i++) {
        const year = await Year.findById(years_ids[i])
        years.push({
            pubId: year.pubId,
            name: year.name,
        })
    }
    res.send({
        
        years,
        status: 'Success'
    })


})

router.post('/models', async (req, res) => {
    const year = await Year.findOne({ pubId: req.body.yearPubId })
    const models_ids = await year.models;
    const models = []
    for (let i = 0; i < models_ids.length; i++) {
        const model = await Model.findById(models_ids[i])
        models.push({
            pubId: model.pubId,
            name: model.name,
        })
    }
    res.send({
        models,
        status: 'Success'
    })

})


router.post('/courses', async (req, res) => {
    const model = await Model.findOne({pubId: req.body.modelPubId})
    const courses_ids = await model.courses;
    const courses = []
    for (let i = 0; i < courses_ids.length; i++) {
        const course = await Course.findById(courses_ids[i])
        courses.push({
            pubId: course.pubId,
            name: course.name,
        })
    }
    res.send({
        courses,
        status: 'Success'
    })
})

router.post('/teachers', async (req, res) => {
    const course = await Course.findOne({ pubId: req.body.course })
    const teachers_ids = course.teachers;
    const teachers = []
    for (let i = 0; i < teachers_ids.length; i++) {
        const teacher = await Account.findById(teachers_ids[i])
        teachers.push({
            name: teacher.username,
        })
    }
    res.send({
        teachers,
        status: 'Success'
    })
})

router.post('/learning', async (req, res) => {
    const course = await Course.findOne({pubId: req.body.course})
    const teacher = await Account.findOne({username: req.body.teacher});
    const tutorat = await Tutorat.findById(teacher.tutorat);
    const videos = []
    const links = []
    const files = []
    for (let i = 0; i < tutorat.videos.length; i++) {
        videos.push(tutorat.videos[i]);
    }
    for (let i = 0; i < tutorat.links.length; i++) {
        links.push(tutorat.links[i]);

    }
    for (let i = 0; i < tutorat.files.length; i++) {
        files.push(tutorat.files[i]);

    }
    res.send({
        videos,
        links,
        files,
        status: 'Success'
    })
})


module.exports = router
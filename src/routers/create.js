const express = require('express');
const router = new express.Router();
const Faculty = require('../models/Faculty');
const Year = require('../models/Year');
const Model = require('../models/Model');
const { nanoid } = require('nanoid');
const Course = require('../models/Course');
const Account = require('../models/Account');
const Tutorat = require('../models/Tutorat');

router.post('/remove-course', async (req, res) => {
    const course = await Course.findOneAndDelete({ pubId: req.body.coursePubId })
    const model = await Model.findOne({ pubId: req.body.modelPubId });
    model.courses.splice(model.courses.indexOf(course._id), 1);
    await model.save();
    res.send({
        status: 'Success'
    })
})

router.post('/remove-model', async (req, res) => {
    const model = await Model.findOneAndDelete({ pubId: req.body.modelPubId })
    const year = await Year.findOne({ pubId: req.body.yearPubId });
    year.models.splice(year.models.indexOf(model._id), 1);
    await year.save();
    res.send({
        status: 'Success'
    })
})
router.post('/remove-year', async (req, res) => {
    const year = await Year.findOneAndDelete({ pubId: req.body.yearPubId })
    const faculty = await Faculty.findOne({ pubId: req.body.facultyPubId });
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
const fs = require('fs')

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

const path = require("path");
const fsPromises = fs.promises;
router.get('/models/small/:pubId', async (req, res) => {
    const pubId = req.params.pubId.split('[')[0];
    res.set('Content-Type', 'image/png');
    res.sendFile(path.join(__dirname, `../../src/images/models/small/${pubId}.jpg`))
})

router.get('/models/big/:pubId', async (req, res) => {
    const pubId = req.params.pubId.split('[')[0];
    res.set('Content-Type', 'image/png');
    res.sendFile(path.join(__dirname, `../../src/images/models/big/${pubId}.jpg`))
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
    console.log(req.body);
    const course = await Course.findOne({ pubId: req.body.course })
    const teachers_ids = course.teachers;
    const teachers = []
    for (let i = 0; i < teachers_ids.length; i++) {
        const teacher = await Account.findById(teachers_ids[i])
        console.log(teacher.username);
        const tutorats = teacher.tutorat;
        for (let i = 0; i < tutorats.length; i++) {
            const tutorat = await Tutorat.findById(tutorats[i])
            if (tutorat.coursePubId == req.body.course) {
                if (tutorat.status != 'Pending') {
                    teachers.push({
                        name: teacher.username,
                    })
                }
            }
        } 
    }
    res.send({
        teachers,
        status: 'Success'
    })
})

router.post('/learning', async (req, res) => {
    const course = await Course.findOne({pubId: req.body.course})
    const teacher = await Account.findOne({username: req.body.teacher});
    console.log(teacher.tutorat);
    const tutorat = await Tutorat.findById(teacher.tutorat[0]);
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
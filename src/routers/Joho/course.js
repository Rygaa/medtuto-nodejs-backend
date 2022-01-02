const express = require('express');
const router = new express.Router();
const Course = require('../../models/Course');
const Model = require('../../models/Model');
const Faculty = require('../../models/Faculty');
const Year = require('../../models/Year');


router.post('/courses', async (req, res) => {
    const model = await Model.findOne({ pubId: req.body.modelPubId })
    const courses_ids = await model.courses;
    const courses = []
    for (let i = 0; i < courses_ids.length; i++) {
        const course = await Course.findById(courses_ids[i])
        courses.push({
            pubId: course.pubId,
            name: course.name,
            index: course.index,
        })
    }
    res.send({
        courses,
        status: 'Success'
    })
})

router.post('/recently-added-courses', async (req, res) => {
    const courses = await Course.find({});
    const coursess = [];
    for (let i = 0; i < courses.length, i < 5; i++) {
        const course = await Course.findById(courses[i]._id)
        const faculty = await Faculty.findOne({ pubId: course.faculty });
        const year = await Year.findOne({ pubId: course.year });
        const model = await Model.findOne({ pubId: course.model });
        coursess.push({
            pubId: courses[i].pubId,
            name: courses[i].name,
            index: courses[i].index,
            faculty: faculty.name,
            year: year.name,
            model: model.name,
        })
    }
    res.send({
        coursess,
        status: 'Success'
    })
})



module.exports = router

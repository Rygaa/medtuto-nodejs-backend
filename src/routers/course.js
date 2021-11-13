const express = require('express')
const router = new express.Router();
const Faculty = require('../models/Faculty')
const Model = require('../models/Model')
const { nanoid } = require('nanoid');
const fs = require('fs');
const Year = require('../models/Year');
const Course = require('../models/Course');

router.post('/update-course', async (req, res) => {
    try {
        console.log(req.body);
        const course = await Course.findOne({ pubId: req.body.coursePubId })
        course.name = req.body.newCourseName;
        course.index = req.body.newCourseIndex;
        console.log(course);
        await course.save();
        res.send({
            status: 'Faculty Updated with success'
        })
        await scriptIt({ file: 'studies', requestName: 'add-faculty', requestBody: req.body })
    } catch (error) {
        console.log(error);
        res.send({
            error: 'Error occured during the update of this new faculty'
        })
    }
})


router.post('/add-course', async (req, res) => {
    const course = new Course({ pubId: nanoid(), name: req.body.newCourseName, index: req.body.newCourseIndex });
    await course.save();

    const model = await Model.findOne({ pubId: req.body.modelPubId })
    model.courses = model.courses.concat(course._id);
    await model.save();
    res.send({
        status: "Success"
    })
})

router.post('/remove-course', async (req, res) => {
    const course = await Course.findOneAndDelete({ pubId: req.body.coursePubId })
    const model = await Model.findOne({ pubId: req.body.modelPubId });
    model.courses.splice(model.courses.indexOf(course._id), 1);
    await model.save();
    res.send({
        status: 'Success'
    })
})



router.post('/courses', async (req, res) => {
    const model = await Model.findOne({ pubId: req.body.modelPubId })
    const courses_ids = await model.courses;
    const courses = []
    for (let i = 0; i < courses_ids.length; i++) {
        const course = await Course.findById(courses_ids[i])
        courses.push({
            pubId: course.pubId,
            name: course.name,
            index: course.index
        })
    }
    res.send({
        courses,
        status: 'Success'
    })
})



const scriptIt = async ({ file, requestName, requestBody }) => {
    const __files = __dirname + '/../' + 'scripts/' + `${file}`
    const request = {
        name: requestName,
        body: requestBody
    }
    fs.appendFile(__files, JSON.stringify(request), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

module.exports = router

const express = require('express')
const router = new express.Router();
const Year = require('../models/Year')
const Faculty = require('../models/Faculty')
const Model = require('../models/Model')
const Course = require('../models/Course')
const { nanoid } = require('nanoid');
const { model } = require('mongoose');
const Account = require('../models/Account');
const Tutorat = require('../models/Tutorat');


router.post('/add-teacher-to-course', async (req, res) => {
    try {
        const course = await Course.findById(req.body.course);
        course.teachers = course.teachers.concat(req.body.teacher)
        await course.save();
        res.send({
            status: "Success"
        })
    } catch (error) {
        console.log(error);
        res.send({
            status: 'error'
        })
    }

})


router.post('/add-tutorat', async (req, res) => {
    try {
        const pubId = nanoid();

        const tutorat = new Tutorat({ pubId, coursePubId: req.body.course })
        await tutorat.save();
        const teacher = await Account.findById(req.body.teacher)
        teacher.tutorat = teacher.tutorat.concat(tutorat._id);
        await teacher.save();
        res.send({
            status: "Success"
        })
    } catch (error) {
        console.log(error);
        res.send({
            status: 'error'
        })
    }

})


router.post('/modify-tutorat', async (req, res) => {
    try {
        const tutorat = await Tutorat.findById(req.body.tutorat);
        if (req.body.videos != null) 
            tutorat.videos = tutorat.videos.concat(req.body.videos);
        if (req.body.links != null)
            tutorat.links = tutorat.links.concat(req.body.links);
        if (req.body.files != null)
            tutorat.files = tutorat.files.concat(req.body.files);
        await tutorat.save();
        res.send({
            status: "Success"
        })
    } catch (error) {
        console.log(error);
        res.send({
            status: 'error'
        })
    }

})



module.exports = router
const express = require('express');
const router = new express.Router();
const Faculty = require('../../models/Faculty');
const Year = require('../../models/Year');
const Model = require('../../models/Model');
const { nanoid } = require('nanoid');
const Course = require('../../models/Course');
const Account = require('../../models/Account');
const Tutorat = require('../../models/Tutorat');






const fs = require('fs')


const path = require("path");
const fsPromises = fs.promises;
router.get('/models/:pubId', async (req, res) => {
    console.log('received');
    const pubId = req.params.pubId.split('[')[0];
    res.set('Content-Type', 'image/png');
    res.sendFile(path.join(__dirname, `../../images/models/${pubId}.jpg`))
})

router.get('/courses/:pubId', async (req, res) => {
    console.log('received');
    const pubId = req.params.pubId.split('[')[0];
    res.set('Content-Type', 'image/png');
    res.sendFile(path.join(__dirname, `../../images/courses/${pubId}.jpg`))
})

router.get('/models/big/:pubId', async (req, res) => {
    const pubId = req.params.pubId.split('[')[0];
    res.set('Content-Type', 'image/png');
    res.sendFile(path.join(__dirname, `../../images/models/big/${pubId}.jpg`))
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
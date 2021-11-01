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
        const course = await Course.findOne({ pubId: req.body.coursePubId});
        const account = await Account.findOne({username: req.body.username})
        console.log(req.body);
        for (let i = 0; i < course.teachers.length; i++) {
            if (course.teachers[i] == account._id) {
                console.log('already sub');
                res.send({
                    error: 'already sub'
                })
                return;
            }
        }
        course.teachers = course.teachers.concat(account._id)
        await course.save();
        const pubId = nanoid();
        const tutorat = new Tutorat({ pubId, coursePubId: req.body.coursePubId, status:"Pendieng" })
        await tutorat.save();
        account.tutorat = account.tutorat.concat(tutorat._id);
        await account.save();
        console.log(course);
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



router.post('/add-link', async (req, res) => {
    try {
        console.log(req.body);
        const account = await Account.findOne({username: req.body.username})
        const tutorats = account.tutorat;
        let x = null;
        console.log(tutorats);
        for (let i = 0; i < tutorats.length; i++) {
            const tutorat = await Tutorat.findById(tutorats[i]);
            if (tutorat.coursePubId == req.body.coursePubId) {
                x = tutorat;
            }
        }
        if (req.body.videos != null && req.body.videos != ''){
            x.videos = x.videos.concat(req.body.videos);

        }
        if (req.body.links != null)
            x.links = x.links.concat(req.body.links);
        if (req.body.files != null)
            x.files = x.files.concat(req.body.files);
            
        await x.save();
        console.log(x);
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
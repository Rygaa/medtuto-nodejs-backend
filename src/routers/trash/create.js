const express = require('express');
const router = new express.Router();
const Course = require('../../models/Course');
const Account = require('../../models/Account');
const Tutorat = require('../../models/Tutorat');


const fs = require('fs')


const path = require("path");
const auth = require('../../middleware/auth');
const fsPromises = fs.promises;
router.get('/models/:pubId', async (req, res) => {
    try {
        const pubId = req.params.pubId.split('[')[0];
        res.set('Content-Type', 'image/png');
        res.sendFile(path.join(__dirname, `../../images/models/${pubId}.jpg`))
    } catch (error) {

    }

})

router.get('/courses/:pubId', async (req, res) => {
    try {
        const pubId = req.params.pubId.split('[')[0];
        res.set('Content-Type', 'image/png');
        res.sendFile(path.join(__dirname, `../../images/courses/${pubId}.jpg`))
    } catch (error) {
        
    }

})

router.get('/models/big/:pubId', async (req, res) => {
    try {
        const pubId = req.params.pubId.split('[')[0];
        res.set('Content-Type', 'image/png');
        res.sendFile(path.join(__dirname, `../../images/models/big/${pubId}.jpg`))
    } catch (error) {
        
    }

})



router.post('/teachers', async (req, res) => {
    try {
        const course = await Course.findOne({ pubId: req.body.course })
        if (!course) {
            res.send({
                error: 'Success'
            })
            return;
        }
        const teachers_ids = course.teachers;
        const teachers = []
        for (let i = 0; i < teachers_ids.length; i++) {
            const teacher = await Account.findById(teachers_ids[i])
            if (teacher) {
                const tutorats = teacher.tutorat;
                for (let i = 0; i < tutorats.length; i++) {
                    const tutorat = await Tutorat.findById(tutorats[i])
                    if (tutorat.coursePubId == req.body.course) {
                        if (tutorat.status != 'Pending') {
                            teachers.push({
                                name: teacher.username,
                                pubId: teacher.pubId,
                                numberOfVideos: teacher.tutorat.length,
                                reviews: teacher.reviews,
                            })
                        }
                    }
                } 
            }
        }
        res.send({
            teachers,
            status: 'Success'
        })
    } catch (error) {
        
    }

})

router.post('/learning', async (req, res) => {
    try {
        const course = await Course.findOne({pubId: req.body.course})
        const teacher = await Account.findOne({pubId: req.body.teacher});
        let tutorat = null;
        for (let i = 0; i < teacher.tutorat.length; i++) {
            const temp = await Tutorat.findById(teacher.tutorat[i]);
            if (temp.coursePubId == course.pubId) {
                tutorat = temp;
            }
        }
        const videos = []
        const links = []
        const files = []
    
        if (!tutorat) return;
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
    } catch (error) {
        
    }
   
})

router.post('/add-review', auth, async (req, res) => {
    try {
        console.log(req.body);
        if (req.body.review == '') {
            return;
        }
        const account = await Account.findOne({pubId: req.body.teacherPubId});
        account.reviews = account.reviews.concat(req.body.review);
        await account.save();
    } catch (error) {
        
    }
})



module.exports = router
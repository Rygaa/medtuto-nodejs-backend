const express = require('express')
const router = new express.Router();
const Faculty = require('../../models/Faculty')
const Model = require('../../models/Model')
const { nanoid } = require('nanoid');
const fs = require('fs');
const Year = require('../../models/Year');
const Course = require('../../models/Course');
var multer = require('multer')
const upload = multer({ dest: 'images', storage: multer.memoryStorage() });


router.post('/update-course-picture', upload.array("files", 5), async (req, res) => {
    const picture = new Buffer(req.files[0].buffer, 'base64');
    const coursePubId = req.body.coursePubId;

    fs.writeFile(`./src/images/courses/${coursePubId}.jpg`, picture, function (err) {
    });

    res.send({
        status: "Success"
    })
})

router.post('/add-course', upload.array("files", 5), async (req, res) => {
    let courseImage = req.files[0].buffer;
    courseImage = new Buffer(courseImage, 'base64');
    const pubId = nanoid();

    fs.writeFile(`./src/images/courses/${pubId}.jpg`, courseImage, function (err) {
    });
    const course = new Course({
        pubId,
        name: req.body.newCourseName,
        index: req.body.newCourseIndex,
        description: req.body.newCourseDescription,
        model: req.body.modelPubId,
        faculty: req.body.faculty,
        year: req.body.year,
    });

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




router.post('/update-course', async (req, res) => {
    try {
        const course = await Course.findOne({ pubId: req.body.coursePubId })
        course.name = req.body.newCourseName;
        course.index = req.body.newCourseIndex;

        await course.save();
        res.send({
            status: 'Faculty Updated with success'
        })
    } catch (error) {
        res.send({
            error: 'Error occured during the update of this new faculty'
        })
    }
})





module.exports = router

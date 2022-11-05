
const express = require('express')
const router = new express.Router();
const Model = require('../../models/Model')
const Faculty = require('../../models/Faculty')
const { nanoid } = require('nanoid');
const fs = require('fs');
const Year = require('../../models/Year');
var multer = require('multer')
const upload = multer({ dest: 'images', storage: multer.memoryStorage() });


router.post('/add-years-model', upload.array("files", 5), async (req, res) => {
    let smallImg = req.files[0].buffer;
    smallImg = new Buffer(smallImg, 'base64');
    const pubId = nanoid();

    if (req.body.newModelName == null) {
        res.send({ error: `Please provide name for year` })
        return;
    }
    if (req.body.description == null) {
        res.send({ error: `Please provide description for year` })
        return;
    }
    if (req.body.newModelIndex == null) {
        res.send({ error: `Please provide index for year` })
        return;
    }

    const faculty = await Faculty.findOne({ pubId: req.body.faculty });
    if (!faculty) {
        res.send({ error: `Please select a faculty for this model` })
        return;
    }
    const year = await Year.findOne({ pubId: req.body.year });
    if (!year) {
        res.send({ error: `Please select a year for this model` })
        return;
    }

    const model = new Model({
        pubId, name: req.body.newModelName,
        description: req.body.description,
        index: req.body.newModelIndex,
        coefficient: req.body.newModelCoefficient,
        faculty: req.body.faculty,
        year: req.body.year,
    });
    fs.writeFile(`./src/images/models/${pubId}.jpg`, smallImg, function (err) {
    });
    await model.save();
    year.models = year.models.concat(model._id);
    await year.save();
    res.send({
        status: "Success"
    })
})


router.post('/remove-model', async (req, res) => {
    if (req.body.modelPubId == null) {
        res.send({ error: `Please provide model` })
        return;
    }
    if (req.body.yearPubId == null) {
        res.send({ error: `Please provide the model year` })
        return;
    }
    const model = await Model.findOne({ pubId: req.body.modelPubId })
    if (!model) {
        res.send({ error: `No model found ${req.body.modelPubId}` })
        return;
    }
    const year = await Year.findOne({ pubId: req.body.yearPubId });
    if (!model) {
        res.send({ error: `No year found ${req.body.yearPubId}` })
        return;
    }

    const index = year.models.indexOf(model._id)
    if (index == -1) {
        res.send({ error: `This model does not belong to this year` })
        return;
    }
    year.models.splice(index, 1);
    await Model.findOneAndDelete({ pubId: req.body.modelPubId })
    await year.save();
    res.send({
        status: 'Success'
    })
})

router.post('/update-model', async (req, res) => {
    if (req.body.modelPubId == null) {
        res.send({ error: `Please provide model` })
        return;
    }
    if (req.body.newModelName == null) {
        res.send({ error: `Please provide a name for the model` })
        return;
    }
    if (req.body.newModelIndex == null) {
        res.send({ error: `Please provide a index for the model` })
        return;
    }
    if (req.body.coefficient == null) {
        res.send({ error: `Please provide a coefficient for the model` })
        return;
    }
    const model = await Model.findOne({ pubId: req.body.modelPubId })
    model.name = req.body.newModelName;
    model.index = req.body.newModelIndex;
    model.coefficient = req.body.coefficient;
    await model.save();

    res.send({
        status: 'Faculty Updated with success'
    })

})


router.post('/update-model-picture', upload.array("files", 5), async (req, res) => {
    const picture = new Buffer.from(req.files[0].buffer, 'base64');
    const modelPubId = req.body.modelPubId;
    if (req.body.modelPubId == null) {
        res.send({ error: `Please provide model` })
        return;
    }

    fs.writeFile(`./src/images/models/${modelPubId}.jpg`, picture, function (err) {
    });

    res.send({
        status: "Success"
    })
})







module.exports = router

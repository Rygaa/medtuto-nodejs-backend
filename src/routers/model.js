const express = require('express')
const router = new express.Router();
const Faculty = require('../models/Faculty')
const Model = require('../models/Model')
const { nanoid } = require('nanoid');
const fs = require('fs');
const Year = require('../models/Year');
const Course = require('../models/Course');

var multer = require('multer')
const upload = multer({ dest: 'images', storage: multer.memoryStorage() });

router.post('/models', async (req, res) => {
    console.log(req.body);
    const year = await Year.findOne({ pubId: req.body.yearPubId })
    const models_ids = await year.models;
    const models = []
    for (let i = 0; i < models_ids.length; i++) {
        const model = await Model.findById(models_ids[i])
        models.push({
            pubId: model.pubId,
            name: model.name,
            index: model.index,
            description: model.description,
        })
    }
    res.send({
        models,
        status: 'Success'
    })

})

router.post('/add-years-model', upload.array("files", 5), async (req, res) => {
    let smallImg = req.files[0].buffer;
    smallImg = new Buffer(smallImg, 'base64');
    const pubId = nanoid();
    // fs.writeFile(`./src/images/models/big/${pubId}.jpg`, bigImg, function (err) {
    //     console.log(err);
    // });
    fs.writeFile(`./src/images/models/${pubId}.jpg`, smallImg, function (err) {
        console.log(err);
    });

    const model = new Model({ pubId, name: req.body.newModelName, description: req.body.description, index: req.body.newModelIndex });
    await model.save();
    await scriptIt({ file: 'studies', requestName: 'add-years-model', requestBody: req.body })

    const year = await Year.findOne({ pubId: req.body.yearPubId })
    year.models = year.models.concat(model._id);
    
    await year.save();
    res.send({
        status: "Success"
    })
})


router.post('/remove-model', async (req, res) => {
    const model = await Model.findOneAndDelete({ pubId: req.body.modelPubId })
    const year = await Year.findOne({ pubId: req.body.yearPubId });
    year.models.splice(year.models.indexOf(model._id), 1);
    await scriptIt({ file: 'studies', requestName: 'remove-model', requestBody: req.body })

    await year.save();
    res.send({
        status: 'Success'
    })
})

router.post('/update-model', async (req, res) => {
    try {
        const model = await Model.findOne({ pubId: req.body.modelPubId })
        model.name = req.body.newModelName;
        model.index = req.body.newModelIndex;
        console.log(model);
        await scriptIt({ file: 'studies', requestName: 'update-model', requestBody: req.body })

        await model.save();
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




const scriptIt = async ({ file, requestName, requestBody }) => {
    const __files = __dirname + '/../' + 'scripts/' + `${file}.json`
    const request = {
        name: requestName,
        body: requestBody
    }
    fs.appendFile(__files, JSON.stringify(request) + ',' + "\n", function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

module.exports = router

const express = require('express');
const router = express.Router();
const Conferences = require('../../models/Conference');
const Token = require('../../models/Token');


// @route GET api/answers/:id
// @desc  Get conference by ID
// @access Public

router.get('/:id', async (req,
                                res) => {
    try{
        //const question = await Question.findById(req.params.id);
        const token = await Token.findOne({number: req.params.id});
        res.json(token.used);
    }catch(err){
        if(err.kind === "ObjectId"){
            return res.status(400).json({msg: 'Conference not found'});
        }
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/answers/:id
// @desc  Updates the conference with new answers to the questions
// @access Public
router.post("/:id", async(req,
                          res) => {

    const token = await Token.findOne({number: req.params.id});
    token.used = true;
    await token.save();
    const conference = await Conferences.findById(req.params.id.substring(0,24));

    // req.body i parse ederek konferansın içine cevapları ekle.
    let realQuestions = req.body.data.questions;

    req.body.data.questions.map((question,index) => {
        let answers = [];
        question.answers.map(answer => {
            let partial = answer.split(",");
            if(partial.length >= 2){
                answers = [...answers, ...partial];
            }
        })
        realQuestions[index].answers = [];
        answers.map(answer => {
            realQuestions[index].answers.push(answer);
        })
    })

    realQuestions.map((question,index) => {
        console.log("Question " + index);
        console.log(question.answers);
    })

    conference.questions.map((question, index) => {
        question.answers = [...question.answers, ...realQuestions[index].answers];
    })

    await conference.save();
    res.json({msg: realQuestions, msg2: conference.questions});

})

module.exports = router;
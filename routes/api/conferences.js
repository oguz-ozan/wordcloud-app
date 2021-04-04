const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Conferences = require('../../models/Conference');
const User = require('../../models/User');
const Token = require('../../models/Token');

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// @route GET api/conference/
// @desc  Get current users conferences
// @access Private
router.get('/',auth, async (req,
                             res) => {
    try{
        const conferences = await Conferences.find();
        res.json(conferences);
        if(!conferences){
            return res.status(400).json({msg: 'There is no conference with this user'});
        }

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/conference/send/:id
// @desc Send email to all Users with token
// @access Private
router.get('/send/:id', auth, async (req,
                                  res) => {
    const conference = await Conferences.findById(req.params.id);

    // Konferansın içinde mail gönderilmemiş userları bulur.
    const empToSend = [];
    conference.employees.map((employee) => {
        if(!employee.isSent){
            empToSend.push(employee);
        }
    })

    // Mail gönderilmemiş userlar için Token ayarlayıp, mail servisi ile gönderir.
    empToSend.map((emp) => {
        const tokenNumber = `${conference._id}${emp.name.replace(/ /g,'')}`
        Token.findOne({number: tokenNumber}).then(res=>{
            if(!res) {
                const addToken = new Token({number: tokenNumber});
                addToken.save(function(err) {
                    if (err) throw err;
                });
                console.log("Token bulunamadı. Mail gönderiliyor.")
                console.log(`token for ${emp.name} is`+ tokenNumber);
                let msg = {
                    from: 'wordcloudconf@yandex.com',
                    to: `${emp.email}`,
                    subject: `Konferans İsmi: ${conference.name}`,
                    text: `Sizin adınız: ${emp.name}. Hoşgeldiniz.
                            http://localhost:3000/answers/${tokenNumber}`
                };
                sgMail
                    .send(msg)
                    .then(() => {
                        console.log('Email sent')
                    })
                    .catch((error) => {
                        console.error(error)
                    })

            }else{
                console.log("token var. mail gönderilmeyecek.")
            }

        }).catch((err)=> {
            console.log("err is" + err);
        });
    })

    // Konferansı bulup içindeki employee'ların isSent durumunu TRUE yapar.
    Conferences.findById(conference._id, function(err,conference){
        let employees = conference.employees;
        for( let i=0; i< employees.length; i++){
            if(!employees[i].isSent){
                employees[i].isSent = true;
            }
        }
        conference.save(function(err){
            if(err) throw err;
            res.json({"message": "Emails are updated as SENT"})
        });
    })
})

// @route DELETE api/conference/:id
// @desc  Delete a conference by ID
// @access Private

router.delete('/:id', auth, async (req,
                             res) => {
    try{
        const conference = await Conferences.findById(req.params.id);

        if(conference.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'User not authorized'});
        }

        await conference.remove();

        res.json({msg: 'Conference removed'});

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/conference/:id
// @desc  Get conference by ID
// @access Private

router.get('/:id',async (req,
                             res) => {
    try{
        const conference = await Conferences.findById(req.params.id);
        //console.log(req.user);

        if(!conference){
            return res.status(400).json({msg: 'Conference not found'});
        }
        res.json(conference);
    }catch(err){
        if(err.kind === "ObjectId"){
            return res.status(400).json({msg: 'Conference not found'});
        }
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// POST api/conference/update
// @desc  Update Conferences with new answers
router.post('/:id/update',async (req,
                         res) => {
    try{
        const conference = await Conferences.findById(req.params.id.substring(0,24));
        const empName = req.params.id.substring(24);
        console.log(empName);

        if(!conference){
            return res.status(400).json({msg: 'Conference not found'});
        }
        res.json(conference);
    }catch(err){
        if(err.kind === "ObjectId"){
            return res.status(400).json({msg: 'Conference not found'});
        }
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/conference
// @desc  Create a conference
// @access Private

router.post('/', [auth,[
    check('name','Name is required').not().isEmpty()
] ], async (req,
                res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try{
        const user = await User.findById(req.user.id);

        console.log(req.body);

        const newConference = {
            name : req.body.name,
            questions : req.body.questions,
            user: req.user.id,
            employees: req.body.employees

        };
        const conference = await Conferences.findOneAndUpdate(
            { name: req.body.name },
            {$set: newConference},
            {new:true, upsert: true, setDefaultsOnInsert:true}
        );
        res.json(conference);

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
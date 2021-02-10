const express = require("express");
const router = new express.Router();

const multer = require("multer");
const Exam = require('../models/exam');

const upload = multer({
    limits: {
      fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|PNG|JPG|JPEG)$/)) {
        return cb(new Error("Please provide an image or a pdf!"));
      }
      cb(undefined, true);
    }
});

router.post('/uploadQuestionPaper', upload.single('upload_question_paper')  , async (req,res)=>{
    
  const response = await Exam.findOne({ name : req.body.name });

  if(response!==null){
    return res.json({ error:'Please Enter Unique Name to your exam'});
  }
  
  const timeL = req.body.hour + ':' + req.body.minute;

    const exam = new Exam({
       name : req.body.name,
        timeLength:timeL,
        date:new Date().toISOString(),
        questionPaperType:req.file.mimetype,
        questionPaper:req.file.buffer
   });
    
    await exam.save();
        
    res.status(201).json({exam:exam});
 
    },( error,req,res,next )=>{
      return  res.json({ error: error.message});
    }
)

router.get('/getExamByRoom/:room', async (req,res)=>{
  
  try {
    
    const response = await Exam.findOne({ name : req.params.room });

    console.log(response); 

    if(response===null){
      return res.json({error: 'No exam exists with that room-name'});
    }
    res.status(200).json({_id:response._id});
 
  } catch (error) {

    console.log(error);
    
    res.json({error:'Internal Server Error'});

  }
})

router.get('/getQuestionPaper/:_id', async (req,res)=>{
  
  try {
    
    const response = await Exam.findById(req.params._id);

    if(response===null){
      throw new Error('Unable to fetch request');
    }

    res.set('Content-Type','multipart/form-data');

    res.status(200).send({exam:response});
 
  } catch (error) {

    console.log(error);
    
    res.json({error:'Internal Server Error'});

  }
})

module.exports = router;
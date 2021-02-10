const express = require("express");
const router = new express.Router();

const multer = require("multer");
const Student = require('../models/student');

const upload = multer({
    limits: {
      fileSize: 10000000,
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|PNG|JPG|JPEG)$/)) {
        return cb(new Error("Please provide an image or a pdf!"));
      }
      cb(undefined, true);
    }
});

router.post('/uploadAnswerScript', upload.single('upload_answer_script')  , async (req,res)=>{
  
    const student = new Student({
        name : req.body.name,
        scholarId:req.body.scholarId,
        date:new Date().toISOString(),
        answerPaperType:req.file.mimetype,
        answerPaper:req.file.buffer,
        owner:req.body._id
   });
    
    await student.save();
        
    res.status(201).json({student:student});
 
    },( error,req,res,next )=>{
      return  res.json({ error: error.message});
    }
)

module.exports = router;
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({  
     name:{
         type:String,
         required:true
     },
     scholarId:{
         type:Number,
         required:true
     },
     date:{
      type:String,
      required:true
     },
     answerPaperType:{
      type:String,
      required:true
    },
    answerPaper:{
      type:Buffer,
      required:true
    },
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'Exam'
    }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Student', studentSchema);
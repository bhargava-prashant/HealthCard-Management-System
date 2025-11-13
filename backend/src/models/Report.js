const mongoose=require('mongoose');

const ReportSchema=new mongoose.Schema({

    patientId:{type:mongoose.Schema.Types.ObjectId, ref:'Patient',required: true},
    doctorId:{type:mongoose.Schema.Types.ObjectId, ref:'Doctor'},
    url:{type:String, required: true},
    publicId:String,
    date:  Date,
    status:{type:String, enum:['Pending',"Approved", 'Rejected'], default:"Pending"},
    notes: String
},{timestamps:true});

module.exports=mongoose.model('Report',ReportSchema)
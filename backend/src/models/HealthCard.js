const mongoose=require('mongoose');

const HealthCardSchema=new mongoose.Schema({
    patientId:{type:mongoose.Schema.Types.ObjectId, ref:"Patient", required: true, unique:true},
    aadhaar:{type:String, required:true},
    qrId:{type:String, required: true, unique:true},
    generatedAt:Date
},{timeStamps:true});

module.exports=mongoose.model('HealthCard', HealthCardSchema);
const mongoose= require('mongoose');
const MedicineSchema = new mongoose.Schema({
    name:String,
    dosage:String,
    timing: String,
    durationInDays: Number,
    startDate: Date

},{_id: false});

const ParescriptionSchema= new mongoose.Schema({
    prescriptionId:{type: String, unique: true, sparse: true },
    doctorId:{type: mongoose.Schema.Types.ObjectId, ref:'Doctor'},
    diseaseDescription: String,
    dateOfPrescription: Date,
    reportAssociated: [String],
    medicines: [MedicineSchema]
},{timestamps:true});

const PatientSchema= new mongoose.Schema({
    aadhaar:{type:String, required: true, unique:true},
    name:{type:String, required:true},
    age: Number,
    email:{type:String, required: true, unique:true},
    address:String,
    phone:String,
    sex:String,
    medicalHistoryNo:String,
    reportHistory:[String],
    profilePhoto: String,
    isApproved: {type:Boolean, default:false},
    password:{type:String,required:true},
    prescriptions:[ParescriptionSchema]

},{timestamps:true});

module.exports= mongoose.model('Patient',PatientSchema);
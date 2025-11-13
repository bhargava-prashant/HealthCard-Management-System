const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const AdminSchema=new mongoose.Schema({
    email:{type:String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true}},
    {timestamps: true});

AdminSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    const salt= await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password, salt);
    next();
});

AdminSchema.methods.matchPassword = async function(entered){
    return bcrypt.compare(entered, this.password);
}
module.exports = mongoose.model('Admin', AdminSchema);





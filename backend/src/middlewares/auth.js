const jwt =require('jsonwebtoken');
const asyncHandler=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);

const auth=asyncHandler(async(req,res,next)=>{
    const header=req.header("Authorization");
    if(!header || ! header.startsWith('Bearer ')){
        return res.status(401).json({message:"No token provided"});
    }
    const token=header.split(' ')[1];
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    } catch (error) {
        res.status(401).json({message:"Token invalid or expired"});
    }
});

const permit=(...allowedRoles)=>(req, res,next)=>{
    if(!req.user){
        return res.status(401).json({message:'Not authenticated'});
    }
    if(!allowedRoles.includes(req.user.role)){
        return res.status(403).json({message:'Forbidden: insufficient permissions'});
    }
    next();
}

module.exports={auth, permit, asyncHandler};

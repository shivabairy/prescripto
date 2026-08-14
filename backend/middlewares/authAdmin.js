import jwt from 'jsonwebtoken'

//Admin Authentication middleware

const authAdmin = async (req,res,next) => {
    try{
        // 1. Get token from request headers
        const {atoken} = req.headers;

        // 2. If no token → reject
        if(!atoken){
            return res.json({success:false,message:'Not Authorized, Login Again'});
        }

        //3.Verify the token
        const token_decode = jwt.verify(atoken,process.env.JWT_SECRET)

        // 4. Check if it belongs to admin
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ 
                success: false, 
                message: 'Not Authorized, Login Again' 
            })
        }

        // 5. All good → move to controller
        next()
    }
    catch(error){
        res.json({success:false,message:error.message});
    }
}

export default authAdmin;
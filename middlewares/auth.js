import CustomErrorHandler from "../services/CustomErrorHandler"
import { JwtService } from "../services/JWTService"

const  auth = async (req,res,next) => {
    let authHeader = req.headers.authorization
    console.log('Auth Header--->',authHeader)

    if(!authHeader){
        return next(CustomErrorHandler.unAuthorized())
    }
    const token = authHeader.split(' ')[1]

    console.log('Token--->>',token)
    try {
        const {_id,role} = await JwtService.verify(token)
        const user = {
            _id,
            role
        }
         req.user = user
        // req.user._id = _id
        next()

    } catch (error) {
        return next(CustomErrorHandler.unAuthorized())
    }
}

export default auth
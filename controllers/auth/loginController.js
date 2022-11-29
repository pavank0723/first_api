import Joi from "joi"
import { User } from "../../models"
import { CustomErrorHandler } from "../../services/CustomErrorHandler"
import bcrypt from 'bcrypt'
import {JwtService} from '../../services/JwtService'

const loginController = {
    async login(req,res,next){
        
        //==--->> 1. Validation  => Validate the Request
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        })

        //==--->> 2. Joi Validate if error
        const {error} = loginSchema.validate(req.body)

        if(error){
            return next(error)
        }

        //==--->> 3.  Check if user in database
        try{
            const user = await User.findOne({email:req.body.email})
            if(!user){
                return next(CustomErrorHandler.wrongCredentials())
            }

            //==--->> Compare Password
            const match = await bcrypt.compare(req.body.password,user.password)
            if(!match){
                return next(CustomErrorHandler.wrongCredentials())
            }

            //==--->> Token 
            const access_token = JwtService.sign({
                _id:user._id,
                role: user.role
            })

            res.json({access_token})
        }catch(err){
            return next(err)
        }
    }
}

export default loginController
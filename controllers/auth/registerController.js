import Joi from 'joi'
import { CustomErrorHandler } from '../../services/CustomErrorHandler'
import { RefreshToken, User } from '../../models'
import bcrypt from 'bcrypt'
import { JwtService } from '../../services/JwtService'
import { REFRESH_SECRET } from '../../config'

const registerController = {
    async register(req, res, next) {
        // [+] {--== Validate ==--} the req
        // [+] {--== Authorise ==--} the req 
        // [+] {--== Check ==--} if user is in the database already
        // [+] {--== Prepare ==--} a model
        // [+] {--== Store ==--} in database
        // [+] {--== Generate ==--} the JWT token
        // [+] {--== Send ==--} res

        //#region ==--->> 1. Validation
        const registerScheme = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            confirm_password: Joi.ref('password')
        })
        //#endregion
        console.log(req.body)

        //#region ==--->> 2. Joi Validate if error
        const { error } = registerScheme.validate(req.body)

        if (error) {
            return next(error)
        }
        //#endregion

        //#region ==--->> 3.  Check if user in already in database
        try {
            const exist = await User.exists({ email: req.body.email })
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This email already exist'))
            }

        } catch (err) {
            return next(err)
        }
        //#endregion

        const { name, email, password } = req.body

        //#region ==--->> Hash Password
        const hashedPassword = await bcrypt.hash(password, 10)
        //#endregion

        //#region ==--->> 4. Prepare Model

        const user = new User({
            name,
            email,
            password: hashedPassword
        })
        //#endregion

        //#region ==--->> 5. Save in DB
        let access_token
        let refresh_token
        try {
            const result = await user.save()
            //#endregion 

            //#region ==--->> 6. Token 
            access_token = JwtService.sign(
                {
                    _id: result._id,
                    role: result.role
                }
            )
            refresh_token = JwtService.sign(
                {
                    _id:result._id,
                    role:result.role
                },
                '1y',
                REFRESH_SECRET
            )

            //DB whitelist
            await RefreshToken.create(
                {
                    token:refresh_token
                }
            )
        }
        catch (err) {
            return next(err)
        }
        //#endregion

        res.json(
            {
                access_token,
                refresh_token 
            }
        )

    }
}

export default registerController
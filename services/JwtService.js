import { JWT_SECRET } from '../config'
import jwt from 'jsonwebtoken'

class JwtService {
    static sign(payload, expiry = '10m',secret = JWT_SECRET){
        return jwt.sign(payload,secret, {expiresIn:expiry})
    }

    //Verify the token
    static verify(token,secret = JWT_SECRET){
        return jwt.verify(token,secret)
    }
}

export {JwtService}
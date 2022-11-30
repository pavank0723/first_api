import mongoose from "mongoose";

const Scheme = mongoose.Schema

const refreshTokenSchema = new Scheme({
    token: { 
        type: String, 
        unique: true 
    },
}, { timestamps: false })

export default mongoose.model('RefreshToken',refreshTokenSchema,'refreshTokens')
import mongoose from "mongoose";
import { APP_URL } from "../../config";

const Schema = mongoose.Schema

const portfolioSchema = new Schema(
    {
        title:{
            type:String,
            required:true
        },
        // category:{
        //     type:'ObjectId',
        //     ref:'PortfolioCateg'
        // },
        demo:{
            type:String,
            required:false
        },
        image:{
            type:String,
            required:true,
            get: (image) => {
                //https://localhost:5100/uploads/portfolio/1669882893223-409215745.png
                //----Domain name-------/-----------Already have---------------------
                return `${APP_URL}/${image}`
            }
        }
    },{ timestamps: true, toJSON: { getters: true }, id:false }
)

export default mongoose.model('Portfolio',portfolioSchema)
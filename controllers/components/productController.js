import multer from "multer"
import path from 'path'
import { Product } from "../../models"
import CustomErrorHandler from "../../services/CustomErrorHandler"
import fs from 'fs'
import Joi from "joi"

const storage = multer.diskStorage(
    {
        destination: (req,file,cb) => cb(null,'uploads/products'),
        filename:(req,file,cb)=>{
            const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
            cb(null,uniqueName)
        }
    }
)

const handleMultipartData = multer(
    {
        storage,
        limits:{
            fileSize:1000000 * 5 //5MB
        }
    }
).single('image')

const productController = {
    //Create
    async store(req,res,next) {
        //Multipart form data --==> install multer to handling multi data
         handleMultipartData(req,res, async(err) => {
                if(err){
                    return next(CustomErrorHandler.serverError(err.message))
                }
                console.log(req.file)
                const filePath = req.file.path

                //Validation
                const productSchema = Joi.object({
                    name: Joi.string().required(),
                    price: Joi.number().required(),
                    size: Joi.string().required()
                })
        
                //==--->> 2. Joi Validate if error
                const { error } = productSchema.validate(req.body)
                if(error){
                    //Delete the uploaded file when validation failed
                    fs.unlink(`${appRoot}/${filePath}`,(err) => { //root_folder/upload/products.extenstion(png/jpg)
                            if(err){
                                return next(CustomErrorHandler.serverError(err.message))
                            }
                        }
                    )
                    return next(error)
                }
                const {name,price ,size} = req.body
                let document

                try {
                    document = await Product.create(
                        {
                            name,
                            price,
                            size,
                            image:filePath
                        }
                    )
                } catch (error) {
                    return next(error)
                }

                res.status(201).json(document)
            }
        )

    }

    //Update
}

export default productController
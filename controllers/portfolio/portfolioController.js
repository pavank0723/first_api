import CustomErrorHandler from "../../services/CustomErrorHandler"
import fs from "fs"
import path from "path"
import multer from "multer"
import { Portfolio } from "../../models"
import portfolioSchema from "../../validators/portfolioValidator"

const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => cb(null, "uploads/portfolio/"),
        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
            cb(null, uniqueName)
        }
    }
)

const handleMultipartData = multer(
    {
        storage,
        limits: {
            fileSize: 1000000 * 5 //5MB
        },
    }
).single('image')


const workController = {
    //Create
    async store(req, res, next) {

        //Multipart form data --==> install multer to handling multi data
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }
            // console.log(req.body)
            
            const filePath = req.file.path.replace(/\\/g, "/")

            // var newFilePath = filePath.split('\\').join('/')
            console.log('==>>>>>>>', filePath)

            //Validation from productValidator

            //==--->> 2. Joi Validate if error
            const { error } = portfolioSchema.validate(req.body)
            if (error) {
                //Delete the uploaded file when validation failed
                fs.unlink(`${appRoot}/${filePath}`, (err) => { //root_folder/upload/products.extenstion(png/jpg)
                    if (err) {
                        return next(CustomErrorHandler.serverError(err.message))
                    }
                }
                )
                return next(error)
            }
            const { title,demo } = req.body
            let document

            try {
                document = await Portfolio.create(
                    {
                        title,
                        demo,
                        image: filePath
                    }
                )
            } catch (error) {
                return next(error)
            }
            res.status(201).json(document)
        }
        )
    },

    async edit(req, res, next) {

        //Multipart form data --==> install multer to handling multi data
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }
            // console.log(req.body)
            let filePath
            if(req.file){
                filePath = req.file.path.replace(/\\/g, "/")
            }
            

            // var newFilePath = filePath.split('\\').join('/')
            console.log('==>>>>>>>', filePath)

            //Validation from productValidator
            
            //==--->> 2. Joi Validate if error
            const { error } = portfolioSchema.validate(req.body)
            if (error) {
                //Delete the uploaded file when validation failed
                if(req.file){
                    fs.unlink(`${appRoot}/${filePath}`, (err) => { //root_folder/upload/products.extenstion(png/jpg)
                        if (err) {
                            return next(CustomErrorHandler.serverError(err.message))
                        }
                    }
                    )
                }
                return next(error)
            }
            const { title,demo } = req.body
            let document

            try {
                document = await Portfolio.findOneAndUpdate(
                    {
                        _id: req.params.id // id => comes from route
                    },
                    {
                        title,
                        demo,
                        ...(req.file && { image: filePath })
                    },
            
                    {
                        new:true
                    }
                )
            } catch (error) {
                return next(error)
            }
            
            res.status(201).json(document)
        }
        )
    },
}

export default workController
import multer from "multer"
import path from "path"
import { Product } from "../../models"
import CustomErrorHandler from "../../services/CustomErrorHandler"
import fs from 'fs'
import Joi from "joi"
import productSchema from "../../validators/productValidator"
var http = require('http');

const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => cb(null, "uploads/products/"),
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

const productController = {
    //Create
    async store(req, res, next) {

        //Multipart form data --==> install multer to handling multi data
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }
            // console.log(req.body)

            const filePath = req.file.path
            var newFilePath = filePath.split('\\').join('/')
            console.log('==>>>>>>>', newFilePath)


            //Validation from productValidator

            //==--->> 2. Joi Validate if error
            const { error } = productSchema.validate(req.body)
            if (error) {
                //Delete the uploaded file when validation failed
                fs.unlink(`${appRoot}/${newFilePath}`, (err) => { //root_folder/upload/products.extenstion(png/jpg)
                    if (err) {
                        return next(CustomErrorHandler.serverError(err.message))
                    }
                }
                )
                return next(error)
            }
            const { name, price, size } = req.body
            let document

            try {
                document = await Product.create(
                    {
                        name,
                        price,
                        size,
                        image: newFilePath
                    }
                )
            } catch (error) {
                return next(error)
            }
            res.status(201).json(document)
        }
        )
    },

    //Update
    update(req, res, next) {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }
            // console.log(req.body)
            let filePath
            if (req.file) {
                req.file.path
            }
            var newFilePath = filePath.split('\\').join('/')
            //==--->> 2. Joi Validate if error
            const { error } = productSchema.validate(req.body)
            if (error) {
                //Delete the uploaded file when validation failed
                if (req.file) {
                    fs.unlink(`${appRoot}/${newFilePath}`, (err) => { //root_folder/upload/products.extenstion(png/jpg)
                        if (err) {
                            return next(CustomErrorHandler.serverError(err.message))
                        }
                    }
                    )
                }

                return next(error)
            }
            const { name, price, size } = req.body
            let document

            try {
                document = await Product.findOneAndUpdate(
                    {
                        _id: req.params.id // id => comes from route
                    },
                    {
                        name,
                        price,
                        size,
                        ...(req.file && { image: newFilePath })

                    },
                    { new: true }
                )
                console.log(document)
            } catch (error) {
                return next(error)
            }
            res.status(201).json(document)
        }
        )
    },

    //delete 
    async destroy(req, res, next) {
        const document = await Product.findOneAndRemove(
            {
                _id: req.params.id
            }
        )
        if (!document) {
            return next(new Error('Nothing to delete'))
        }

        //image delete
        const imagePath = document._doc.image 
        //Note: =>>>> _doc i.e. it return original document without any getter 
        //                      because in product model I create getter() on image 
        //http://localhost:5000/uploads/products/1669910953262-946280708.svg
        //rootFolder/uploads/products/1669910953262-946280708.svg

        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError())
            }
            return res.json(document)
        })
        

    },

    //all products
    async index(req, res, next) {
        let documents
        //pagination mongoose-pagination
        try {
            documents = await Product.find().select('-updatedAt -__v').sort(
                {
                    _id: -1
                }
            )
            //select() use for which field not show in res
        } catch (error) {
            return next(CustomErrorHandler.serverError())
        }
        return res.json(documents)
    },

    async show(req, res, next) {
        let document
        try {
            document = await Product.findOne(
                {
                    _id: req.params.id
                }
            ).select('-updatedAt -__v')
        } catch (error) {
            return next(CustomErrorHandler.serverError())
        }
        return res.json(document)
    }

}

export default productController
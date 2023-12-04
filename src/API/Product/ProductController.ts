import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { ICreateProduct } from '@src/models/Product'
import { uploadFile, uploadMiddleware } from '@src/services/Common/uploadService'
import ProductService from '@src/services/Product/ProductService'
import express, { Request, Response } from 'express'
import multer from 'multer'
const router = express.Router()
const upload = multer()

router.post('/',uploadFile,async(req:Request,res:Response)=>{
    try {
        console.log(req.body.image_link)
        if (!req.body.image_link) {
            return res.status(400).json({ status: false, message: 'File upload failed' });
          }
        const reqDto:ICreateProduct = {
            name:req.body.name as string,
            description:req.body.description as string,
            max_ammo:Number(req.body.max_ammo),
            price:Number(req.body.price),
            type_ammo:req.body.type_ammo as string,
            type_gun:req.body.type_gun as string,
            image_link: req.body.image_link
        }

        console.log(req.body.image_link)
        const create = await ProductService.Create(reqDto)
        res.status(HttpStatusCodes.OK).send(create)
    } catch (error) {
        if(error.status){
            res.status(error.status).send({
                status:false,
                message:error.message,
                data:null
            })
        }else{
            res.status(500).send({
                status:false,
                message:error.message,
                data:null
            })
        }  
    }
    
})

export default router
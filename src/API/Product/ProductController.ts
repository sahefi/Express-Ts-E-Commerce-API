import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { ICreateProduct, IListProduct, IUpdateProduct } from '@src/models/Product'
import { NotFoundException } from '@src/other/classes'
import { prisma } from '@src/server'
import { DeleteFile, uploadFile, uploadMiddleware } from '@src/services/Common/uploadService'
import ProductService from '@src/services/Product/ProductService'
import express, { Request, Response } from 'express'
import multer from 'multer'
const router = express.Router()
const upload = multer()

router.post('/',uploadFile,async(req:Request,res:Response)=>{
    try {
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

router.get('/',async(req:Request,res:Response)=>{
    
    try {
        const reqDto:IListProduct = {page:Number(req.query.page),per_page:Number(req.query.per_page)}
        const listProduct = await ProductService.ListProduct(reqDto)
        res.status(HttpStatusCodes.OK).send(listProduct)
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

router.patch('/',uploadFile,async(req:Request,res:Response)=>{
    try {
            if (!req.body.image_link) {
                return res.status(400).json({ status: false, message: 'File upload failed' });
              }
            const reqDto:IUpdateProduct = {
                id_product:req.body.id_product as string,
                name:req.body.name as string,
                description:req.body.description as string,
                max_ammo:Number(req.body.max_ammo),
                price:Number(req.body.price),
                type_ammo:req.body.type_ammo as string,
                type_gun:req.body.type_gun as string,
                image_link: req.body.image_link
            }
            const updateProduct = await ProductService.UpdateProduct(reqDto)
            res.status(HttpStatusCodes.OK).send(updateProduct)
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

router.delete('/',async(req:Request,res:Response)=>{
    try {
        const find = await prisma.product.findUnique({
            where:{
                id:req.body.id_product
            }
        })
        if(!find){
            throw new NotFoundException('Id Not Found')
        }
        const filePathToDelete = find.image_link||''; // Make sure this is the correct file path
        await DeleteFile(filePathToDelete);
        const deleteProduct = await ProductService.DeleteProduct(find.id)
        console.log('hali')
        res.status(HttpStatusCodes.OK).send(deleteProduct)
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
import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { ICreateCompany, IListCompany, IUpdateCompany } from '@src/models/Company'
import { NotFoundException } from '@src/other/classes'
import { prisma } from '@src/server'
import { DeleteFile, uploadFile } from '@src/services/Common/uploadService'
import CompanyService from '@src/services/Company/CompanyService'
import express, { Request, Response } from 'express'
import multer from 'multer'

const router = express.Router()
const upload = multer()

router.post('/',uploadFile,async(req:Request,res:Response)=>{
    try {
        if (!req.body.image_link) {
            return res.status(400).json({ status: false, message: 'File upload failed' });
          }
          const reqDto:ICreateCompany = {
            company_name:req.body.company_name as string,
            desctiprion:req.body.description as string,
            logo_link:req.body.image_link 
          }

          const create = await CompanyService.CreateCompany(reqDto)
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
        const reqDto:IListCompany = {
            page:Number(req.body.page),
            per_page:Number(req.body.per_page)
        }
        const list = await CompanyService.ListCompany(reqDto)
        res.status(HttpStatusCodes.OK).send(list)
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
          
        const reqDto:IUpdateCompany = {
            id_company:req.body.id_company as string,
            company_name:req.body.company_name as string,
            desctiprion:req.body.description as string,
            logo_link:req.body.image_link
        }

        const update = await CompanyService.UpdateCompany(reqDto)
        res.status(HttpStatusCodes.OK).send(update)
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
        const find = await prisma.company.findUnique({
            where:{
                id:req.body.id_company
            }
        })
        if(!find){
            throw new NotFoundException('Id Not Found')
        }
        const filePathToDelete = find.logo_link || ''
        await DeleteFile(filePathToDelete);
        const deleteCompany = await CompanyService.DeleteCompany(find.id)
        res.status(HttpStatusCodes.OK).send(deleteCompany)
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
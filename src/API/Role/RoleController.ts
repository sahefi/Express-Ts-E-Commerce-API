import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { ICreateRole, IDeleteRole, IListRole, IUpdateRole } from '@src/models/Role';
import RoleService from '@src/services/Role/RoleService';
import express, { Request, Response } from 'express';

const router = express.Router()

router.post('/',async(req:Request,res:Response)=>{
    try {
        const reqDto = req.body as ICreateRole
        const create = await RoleService.CreateRole(reqDto)
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
        const reqDto:IListRole = {page:Number(req.query.page),per_page:Number(req.query.per_page)}
        const list = await RoleService.listRole(reqDto)
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

router.patch('/',async(req:Request,res:Response)=>{
    try {
        const reqDto = req.body as IUpdateRole
        const update = await RoleService.UpdateRole(reqDto)
        console.log(update)
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
        const reqDto = req.body as IDeleteRole
        const deleteRole = await RoleService.DeleteRole(reqDto)
        res.status(HttpStatusCodes.OK).send(deleteRole)
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
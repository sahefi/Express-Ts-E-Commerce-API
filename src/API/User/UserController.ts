import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { ICreated, IDelete, IList, IUpdated } from '@src/models/User';
import UserService from '@src/services/User/UserService';
import { registerValidator, updateCustomerValidator } from '@src/services/Validation/Validation';
import express, { Request, Response } from 'express';
import { requestValidator } from '../BaseController';


const router = express.Router()

router.post('/',registerValidator,requestValidator,async(req:Request,res:Response)=>{
    
    try {
        const reqDto = req.body as ICreated
        const register = await UserService.Register(reqDto)
        return res.status(HttpStatusCodes.OK).send(register) 
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

router.patch('/',updateCustomerValidator,requestValidator,async(req:Request,res:Response)=>{
    try {
        const reqDto = req.body as IUpdated
        const update = await UserService.UpdateCustomer(reqDto)
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

router.get('/',async(req:Request,res:Response)=>{
    try {
        const reqDto:IList = {page:Number(req.query.page),per_page:Number(req.query.per_page)}
        const list = await UserService.listCustomer(reqDto)
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

router.delete('/',async(req:Request,res:Response)=>{
    try {
        const reqDto = req.body as IDelete
        const deleteCustomer = await UserService.deletedCustomer(reqDto)
        res.status(HttpStatusCodes.OK).send(deleteCustomer)
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
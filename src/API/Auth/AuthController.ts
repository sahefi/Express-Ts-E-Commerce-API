import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { ILogin } from '@src/models/Auth';
import LoginService from '@src/services/Auth/LoginService';
import express, { Request, Response } from 'express';

const router = express.Router()

router.post('/',async(req:Request,res:Response)=>{
    try {
        const reqDto = req.body as ILogin
        const login = await LoginService.LoginUser(reqDto)
        res.status(HttpStatusCodes.OK).send(login)
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
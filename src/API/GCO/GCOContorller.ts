import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { ICreateGCO } from '@src/models/Gco'
import GcoService from '@src/services/GCO/GcoService'
import express, { Request, Response } from 'express'

const router = express.Router()

router.post('/',async(req:Request,res:Response)=>{
    try {
        const reqDto = req.body as ICreateGCO
        const create = await GcoService.Create(reqDto)
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
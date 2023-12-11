import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IPayTransaction } from '@src/models/Transaction';
import { verifyJwt } from '@src/services/Auth/LoginService';
import TransactionService from '@src/services/Transaction/TransactionService';
import express, { Request, Response, Router } from 'express';

const router = express.Router()

router.post('/',verifyJwt,async (req:Request,res:Response) => {
    try {
    const reqDto = req.body as IPayTransaction
    const pay = await TransactionService.payTransaction(reqDto,req.query.user as string)
    res.status(HttpStatusCodes.OK).send(pay)
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
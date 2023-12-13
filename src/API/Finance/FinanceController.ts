
import { IFinance } from '@src/models/Finance';
import FInanceService from '@src/services/Finance/FinanceService';
import { HttpStatusCode } from 'axios';
import express, { Request, Response, Router } from 'express';

const router = express.Router()

router.get('/',async (req:Request,res:Response)=>{

    const reqDto:IFinance = {periode:req.query.periode as string}
    const financeReport = await FInanceService.List(reqDto)
    res.status(HttpStatusCode.Ok).send(financeReport)
})

export default router
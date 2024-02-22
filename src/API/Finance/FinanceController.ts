
import { IFinance } from '@src/models/Finance';
import FinanceService from '@src/services/Finance/FinanceService';
import FInanceService from '@src/services/Finance/FinanceService';
import { HttpStatusCode } from 'axios';
import express, { Request, Response, Router } from 'express';

const router = express.Router()

router.get('/',async (req:Request,res:Response)=>{

    const reqDto:IFinance = {periode:req.query.periode as string}
    const financeReport = await FInanceService.List(reqDto)
    res.status(HttpStatusCode.Ok).send(financeReport)
})

router.get('/venturo',async(req:Request,res:Response)=>{
    try{
        const reqDto:IFinance = {periode:req.query.periode as string}
        const pivoTable = await FinanceService.pivotTable(reqDto)
        res.status(HttpStatusCode.Ok).send(pivoTable)
    }
    catch (error) {
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
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { ICreateCart } from '@src/models/Cart';
import { verifyJwt } from '@src/services/Auth/LoginService';
import CartService from '@src/services/Cart/CartService';
import express, { Request, Response } from 'express';

const router = express.Router()

router.post('/',verifyJwt,async(req:Request,res:Response)=>{
    try {
        console.log('id_user',);
        
        const reqDto:ICreateCart = {
            id_customer:req.query.user as string,
            id_product:req.body.id_product as string,
            quantity:Number(req.body.quantity)
        }
        console.log(req.query.user);
        
        const create = await CartService.CreateCart(req.query.user as string,reqDto)
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
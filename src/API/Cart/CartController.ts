import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { ICreateCart, IDeleteCart, IListCart } from '@src/models/Cart';
import { NotFoundException } from '@src/other/classes';
import { prisma } from '@src/server';
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

router.get('/',verifyJwt,async(req:Request,res:Response)=>{
    try {
        const reqDto:IListCart = {page:Number(req.query.page),per_page:Number(req.query.per_page)}
        const listCart = await CartService.ListCart(req.query.user as string,reqDto)
        res.status(HttpStatusCodes.OK).send(listCart)
    } catch (error) {
        
    }
})

router.delete('/delete',verifyJwt,async(req:Request,res:Response)=>{
    try {
        const reqDto = req.body as IDeleteCart
        const deleteCart = await CartService.DeleteCart(reqDto)
        res.status(HttpStatusCodes.OK).send(deleteCart)

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

router.delete('/deletemany',verifyJwt,async(req:Request,res:Response)=>{
    try {
        const deleteManyCart = await CartService.DeletemanyCart(req.query.user as string)
        res.status(HttpStatusCodes.OK).send(deleteManyCart)
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
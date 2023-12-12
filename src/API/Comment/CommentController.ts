import { ICommentReq } from '@src/models/Comment';
import { ISubCommentReq } from '@src/models/SubComment';
import { verifyJwt } from '@src/services/Auth/LoginService';
import CommentService from '@src/services/Comment/CommentService';
import { HttpStatusCode } from 'axios';
import express, { Request, Response } from 'express';

const router = express.Router()

router.post('/',verifyJwt,async(req:Request,res:Response)=>{
    try {
        const reqDto = req.body as ICommentReq
        const createComment = await CommentService.CreateComment(req.query.user as string,req.query.name as string,reqDto)
        res.status(HttpStatusCode.Ok).send(createComment)
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

router.post('/sub',verifyJwt,async(req:Request,res:Response)=>{
    try {
        const reqDto = req.body as ISubCommentReq
        const subComment = await CommentService.CreateSubComment(req.query.user as string,req.query.name as string,reqDto)
        res.status(HttpStatusCode.Ok).send(subComment)
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
        const lisComment = await CommentService.ListComment(req.body.id as string)
        res.status(HttpStatusCode.Ok).send(lisComment)
    } catch (error) {
        
    }
})

export default router
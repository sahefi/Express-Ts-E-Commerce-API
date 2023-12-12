import { Response } from "express"

export async function ErrorRespon(req:{status:number,message:string},res:Response) {
    if(req.status){
        res.status(req.status).send({
            status:false,
            message:req.message,
            data:null
        })
    }else{
        res.status(500).send({
            status:false,
            message:req.message,
            data:null
        })
    }
}
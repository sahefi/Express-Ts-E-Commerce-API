import mongoose, { Document, Schema } from "mongoose";

interface IComment extends Document{
    id_product:string,
    id_customer:string,
    username:string
    comment:string
    rating:number
    createdAt:Date,
}



const commentSchema = new Schema({
    id_product:{type:String,required:true},
    id_customer:{type:String,required:true},
    username:{type:String,required:true},
    comment:{type:String,required:true},
    rating:{type:Number,reqired:true},
    createdAt:{type:Date,default:Date.now}
})

const commentModel = mongoose.model<IComment>('comment',commentSchema)

export interface ICommentReq{
    id_product:string,
    username:string
    id_customer:string
    comment:string
    rating:number
}


export default commentModel
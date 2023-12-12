import mongoose, { Document, Schema } from "mongoose";

interface ISubComment extends Document{
    id_comment:mongoose.Types.ObjectId,
    id_customer_reply:string,
    username_reply:string,
    comment:string
    createdAt:Date,
}



const subcommentSchema = new Schema({
    id_comment:{type:String,required:true},
    id_customer_reply:{type:String,required:true},
    username_reply:{type:String,required:true},
    comment:{type:String,required:true},
    createdAt:{type:Date,default:Date.now}
})

const subCommentModel = mongoose.model<ISubComment>('subcomment',subcommentSchema)

export interface ISubCommentReq{
    id_comment:mongoose.Types.ObjectId,
    id_customer_reply:string,
    username_reply:string
    comment:string
}


export default subCommentModel
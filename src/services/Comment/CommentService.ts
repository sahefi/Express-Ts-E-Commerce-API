import commentModel, { ICommentReq } from "@src/models/Comment";
import subCommentModel, { ISubCommentReq } from "@src/models/SubComment";
import { log } from "util";

async function CreateComment(id:string,name:string,req:ICommentReq) {
    const createComment = await commentModel.create({
        id_customer:id,
        username:name,
        id_product:req.id_product,
        comment:req.comment,
        rating:req.rating,
    })

    await createComment.save()

    return{
        status:true,
        message:'Success',
        data:{
            id:createComment.id,
            id_product:createComment.id_product,
            id_customer:createComment.id_customer,
            username:createComment.username,
            comment:createComment.comment,
            rating:createComment.rating
        }
    }
}

async function CreateSubComment(id:string,name:string,req:ISubCommentReq) {
    const createSubComment = await subCommentModel.create({
        id_comment:req.id_comment,
        id_customer_reply:id,
        username_reply:name,
        comment:req.comment,
    })

    await createSubComment.save()

    return{
        status:true,
        message:'Success',
        data:{
            id_comment:createSubComment.id_comment,
            id_customer_reply:createSubComment.id_customer_reply,
            username_reply:createSubComment.username_reply,
            comment:createSubComment.comment
        }
    }
}

 async function ListComment(id:string) {
    const litsComment = await commentModel.find({
            id_product:id

    })

    const data = litsComment.map(async(item)=>{
        const subcomment = await subCommentModel.find({
            id_comment:item._id
        })
        return{
            id_comment:item.id,
            username:item.username,
            comment:item.comment,
            rating:item.rating,
            replies:subcomment.map((rep)=>{
                return{
                    username:rep.username_reply,
                    comment:rep.comment
                }
            })
        }
    })
    const result = await Promise.all(data)
    console.log(result);
    

    return{
        status:true,
        message:"Success",
        data:result
    }
}

export default{
    CreateComment,
    CreateSubComment,
    ListComment
}
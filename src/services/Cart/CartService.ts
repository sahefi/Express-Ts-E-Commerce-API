import { ICreateCart } from "@src/models/Cart";
import { prisma } from "@src/server";

async function CreateCart(id:string,req:ICreateCart) {
    console.log('halo',id);
    const create = await prisma.cart.create({
        data:{
         id_customer:id,
         id_product:req.id_product,
         quantity:req.quantity   
        }
    })
    
    return{
        status:true,
        message:'Success',
        data:create
    }
}

export default{
    CreateCart
}
import { ICreateCart, IDeleteCart, IListCart } from "@src/models/Cart";
import { NotFoundException } from "@src/other/classes";
import { prisma } from "@src/server";

async function CreateCart(id:string,req:ICreateCart) {
    const find = await prisma.cart.findFirst({
        where:{
            id_customer:id,
            id_product:req.id_product
        }
    })
    if(find){       
        const update = await prisma.cart.update({
            where:{
               id:find.id
            },
            data:{
                quantity:Number(find.quantity) + Number(req.quantity)
            }
        })
        return{
            status:true,
            message:'Success',
            data:update
        }
    }
    else{
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
}

async function ListCart(id:string,req:IListCart) {
    const page = +req.page || 1
    const take = +req.per_page || 10
    const skip = (page-1) * take
    const nextPage = page + 1
    const prevPage = page - 1

    const count = await prisma.cart.count({
        where:{
            id_customer:id
        }
    })

    const list = await prisma.cart.findMany({
        where:{
            id_customer:id
        },
        include:{
            product:true
        },
        orderBy:{
            product:{
                name:'asc'
            }
        }
    })
    
    
    // if (list.length === 0) {
    //     return{
    //     status:true,
    //     message:'Succes',
    //     page:page,
    //     per_page:take,
    //     total:count,
    //     next_page:nextPage,
    //     prev_page:prevPage,
    //     data:[]
    //     }
    // }


    const result = await list.map((item)=>{
        return{
            id_cart:item.id,
            id_product:item.id_product,
            product_name:item.product?.name,
            quantity:item.quantity,
            price:Math.ceil(Number(item.product?.price)),
            sub_total:Math.ceil(Number(item.quantity)*Number(item.product?.price))
        }
    })
    let total_price = 0
    if(result.length > 1){
        total_price = await result.map((item)=>item.sub_total).reduce((acc,sub_total)=>Number(acc)+Number(sub_total))
    }
    return{
        status:true,
        message:'Succes',
        page:page,
        per_page:take,
        total:count,
        next_page:nextPage,
        prev_page:prevPage,
        data:{
            result,
            total_price:total_price
        }
    }

    
}

async function DeleteCart(req:IDeleteCart) {

    const find = await prisma.cart.findUnique({
        where:{
            id:req.id_cart
        }
    })
    if(!find){
        throw new NotFoundException('Id Cart Not Found')
    }
    const deleted = await prisma.cart.delete({
        where:{
            id:req.id_cart
        }
    })
    return{
        status:true,
        message:'Success',
        data:null
    }
}

async function DeletemanyCart(id:string) {
    const deleted = await prisma.cart.deleteMany({
        where:{
            id_customer:id
        }
    })
    return{
        status:true,
        message:'Success',
        data:null
    }
}
export default{
    CreateCart,
    ListCart,
    DeleteCart,
    DeletemanyCart
}
import { ICreateProduct, IListProduct, IUpdateProduct } from "@src/models/Product";
import { NotFoundException } from "@src/other/classes";
import { prisma } from "@src/server";



async function Create(req:ICreateProduct) {
    const result = await prisma.$transaction(async(tx:any)=>{
        const find = await tx.gco.findMany({
            where:{
                OR: [
                    { id: req.type_ammo },
                    { id: req.type_gun }
                  ]
            }
        })
        if(!find){
            throw new NotFoundException('Type Ammo And Gun Not Valid')
        }
        await tx.gco.findMany({
            where:{
                type:'GUN'
            }
        })
        const create = await tx.product.create({
            data:{
                name:req.name,
                description:req.description,
                type_ammo:req.type_ammo || null,
                type_gun:req.type_gun,
                price:req.price,
                max_ammo:req.max_ammo || 0,
            },
            include:{
                typeAmmo:true,
                typeGun:true
            }
        })


        return {
            id:create.id,
            name:create.name,
            description:create.description,
            type_ammo:create.typeAmmo?.name || null ,
            type_gun:create.typeGun?.name || null,
            price:Math.ceil(Number(create.price)),
            max_ammo:create.max_ammo || 0,
        }
    })
    return{
        status:true,
        message:'Success',
        data:result
    }

}

async function ListProduct(req:IListProduct) {
    const page = +req.page || 1
    const take = +req.per_page || 10
    const skip = (page-1)*take
    const nextPage = page + 1
    const prevPage = page - 1

    const count = await prisma.product.count()
    const list = await prisma.product.findMany({
        include:{
            typeAmmo:true,
            typeGun:true
        },
        orderBy:{
            name:'asc'
        },
        skip:skip,take:take
    })

    const result = list.map((item:any)=>{
        return{
            id:item.id,
            name:item.name,
            description:item.description,
            price:Math.ceil(Number(item.price)),
            image_link:item.image_link,
            type_ammo:item.typeAmmo?.name || null,
            type_gun:item.typeGun?.name,
            max_ammo:item.max_ammo || 0

        }
    })

    return{
        status:true,
        message:'Success',
        page:page,
        per_page:take,
        nextPage:nextPage,
        prevPage:prevPage,
        total:count,
        data:result
    }
}

async function UpdateProduct(req:IUpdateProduct) {
    const find = await prisma.product.findUnique({
        where:{
            id:req.id_product
        }
    })

    if(!find){
        throw new NotFoundException('ID Not Found')
    }

    const update = await prisma.product.update({
        where:{
            id:req.id_product
        },
        data:{
            name:req.name,
            description:req.description,
            price:req.price,
            image_link:req.image_link,
            type_ammo:req.type_ammo || null,
            type_gun:req.type_gun,
            max_ammo:req.max_ammo || 0 
        },
        include:{
            typeAmmo:true,
            typeGun:true
        }
    })
    return{
        status:true,
        message:'Success',
        data:{
            data:{
                name:update.name,
                description:update.description,
                price:update.price,
                image_link:update.image_link,
                type_gun:update.typeGun?.name,
                type_ammo:update.typeAmmo?.name || null ,
                max_ammo:update.max_ammo || 0
            }
        }
    }
}

async function DeleteProduct(id:string) {
    

    const deleteProduct = await prisma.product.delete({
        where:{
            id:id
        }
    })

    return{
        status:true,
        message:'Success',
        data:null
    }
}


export default{
    Create,
    ListProduct,
    UpdateProduct,
    DeleteProduct
}
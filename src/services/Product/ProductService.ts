import { ICreateProduct } from "@src/models/Product";
import { NotFoundException } from "@src/other/classes";
import { prisma } from "@src/server";



async function Create(req:ICreateProduct) {
    const result = await prisma.$transaction(async(tx)=>{
        const findGun = await tx.gco.findMany({
            where:{
                OR: [
                    { id: req.type_ammo },
                    { id: req.type_gun }
                  ]
            }
        })
        if(!findGun){
            throw new NotFoundException('Type Ammo And Gun Not Valid')
        }


        const create = await tx.product.create({
            data:{
                name:req.name,
                description:req.description,
                type_ammo:req.type_ammo || null,
                type_gun:req.type_gun,
                price:req.price,
                max_ammo:req.max_ammo || 0,
                image_link:req.image_link
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
            price:create.price,
            max_ammo:create.max_ammo || 0,
            image_link:create.image_link || null
        }
    })
    return{
        status:true,
        message:'Success',
        data:result
    }

}

export default{
    Create
}
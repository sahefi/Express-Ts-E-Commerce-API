import { ICreateGCO } from "@src/models/Gco";
import { prisma } from "@src/server";

async function name(req:ICreateGCO) {
    const create = await prisma.gco.create({
        data:req
    })

    return{
        status:true,
        message:'Success',
        data:create
    }
}
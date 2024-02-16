import { ICreateRole, IDeleteRole, IListRole, IUpdateRole } from "@src/models/Role";
import { NotFoundException } from "@src/other/classes";
import { prisma } from "@src/server";

async function CreateRole(req:ICreateRole) {
    const create = await prisma.role.create({
        data:req
    })
    return{
        status:true,
        message:'Success',
        data:create
    }
}

async function listRole(req:IListRole) {
    const page = +req.page || 1
    const take = +req.per_page || 10
    const skip =(page-1)*10
    const nextPage = page+1
    const prevPage = page-1

    const count = await prisma.role.count()
    const list = await prisma.role.findMany({
        orderBy:{
            name:'asc'
        },
        take:take,skip:skip
    })

    const result = list.map((item:any)=>{
        return{
            id_role:item.id,
            name:item.name
        }
    })

    return{
        status:true,
        message:'Success',
        page:page,
        per_page:take,
        total:count,
        data:result
    }
    
    
}

async function UpdateRole(req:IUpdateRole) {
    const result = await prisma.$transaction(async(tx:any)=>{
        const find = await prisma.role.findUnique({
            where:{
                id:req.id
            }
        })
        if(!find){
            throw new NotFoundException('Id Not Found')
        }
    
        const update = await prisma.role.update({
            where:{
                id:req.id
            },
            data:{
                name:req.name
            }
        })

        return{
            id_role:update.id,
            name:update.name
        }
    })
    
    return{
        status:true,
        message:'Success',
        data:result
        
    }
}

async function DeleteRole(req:IDeleteRole) {
    const find = await prisma.role.findUnique({
        where:{
            id:req.id
        }
    })
    if(!find){
        throw new NotFoundException('ID Not Found')
    }
    const deleteRole = await prisma.role.delete({
        where:{
            id:req.id
        }
    })
    return{
        status:true,
        message:'Success',
        data:null
    }
}

export default{
    CreateRole,
    listRole,
    UpdateRole,
    DeleteRole
}
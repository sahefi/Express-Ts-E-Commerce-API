import { ICreatedStaff, IDeleteStaff, IListStaff, IUpdatedStaff } from "@src/models/Staff";
import { BadRequestException, NotFoundException } from "@src/other/classes";
import { prisma } from "@src/server";
import bcrypt from "bcrypt"

async function createStaff(req:ICreatedStaff) {
    const result = await prisma.$transaction(async(tx)=>{
        const find = await tx.user.findUnique({
            where:{
                username:req.username
            }
        })

        if(find){
            throw new BadRequestException('Username Already Exits')
        }
        const hashed = await bcrypt.hash(req.password,10)
        const createUSer = await tx.user.create({
            include:{
                role:true
            },
            data:{
                username:req.username,
                password:hashed,
                id_role:req.id_role
            }
        })
        const createStaff = await tx.staff.create({
            data:{
                email:req.email,
                name:req.name,
                no_phone:req.no_phone,
                id_user:createUSer.id
            }
        })
        return{
            data:{
                id_staff:createStaff.id,
                username:createUSer.username,
                email:createStaff.email,
                name:createStaff.name,
                no_phone:createStaff.no_phone,
            }
        }
    })
    return{
        status:true,
        message:"Success",
        data:result
    }
}

async function updateStaff(req:IUpdatedStaff) {

    const result = await prisma.$transaction(async(tx)=>{
        const findRole = await tx.role.findUnique({
            where:{
                id:req.id_role
            }
        })
        const find = await tx.staff.findUnique({
            where:{
                id:req.id_staff
            }
        })
        if(!find && !findRole){
            throw new NotFoundException('ID Not Found')
        }

        const updateStaff = await tx.staff.update({
            where:{
                id:req.id_staff
            },
            data:{
                name:req.name,
                email:req.email,
                no_phone:req.no_phone
            }
        })

        const updateUser = await tx.user.update({
            where:{
                id:updateStaff.id_user || undefined
            },
            data:{
                username:req.username,
                id:req.id_role
            }
        })
        return{
            data:{
                id_staff:updateStaff.id,
                username:updateUser.username,
                name:updateStaff.name,
                email:updateStaff.email,
                no_phone:updateStaff.no_phone,
                id_role:updateUser.id_role
            }
        }
    })
    return{
        status:true,
        message:'Success',
        data:result
    }
}

async function listStaff(req:IListStaff) {
    
    const page = +req.page ||1 
    const take = +req.per_page || 10
    const skip = (page-1)*10
    const nextPage = page + 1
    const prevPage = page - 1

    const count = await prisma.staff.count()
    const list = await prisma.staff.findMany({
        include:{
            user:true
        },
        orderBy:{
            name:'asc'
        },

        skip:skip,take:take
    })

    const result = list.map((item)=>{
        return{
            id_staff:item.id,
            username:item.user?.username,
            name:item.name,
            email:item.email,
            no_phone:item.no_phone,
            id_role:item.user?.id_role
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

async function DeleteStaff(req:IDeleteStaff) {
    const result = await prisma.$transaction(async(tx)=>{
        const find = await tx.staff.findUnique({
            where:{
                id:req.id_staff
            }
        })
        if(!find){
            throw new NotFoundException('ID Not Found')
        }

        const deletStaff = await tx.staff.delete({
            where:{
                id:req.id_staff
            }
        })

        const deleteUser = await tx.user.delete({
            where:{
                id:deletStaff.id_user ||undefined
            }
        })
       
    })
    return{
        status:true,
        message:'Success',
        data:null
    }
}

export default{
    createStaff,
    updateStaff,
    listStaff,
    DeleteStaff
}
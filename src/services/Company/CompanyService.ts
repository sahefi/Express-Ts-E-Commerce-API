import { ICreateCompany, IListCompany, IUpdateCompany } from "@src/models/Company";
import { NotFoundException } from "@src/other/classes";
import { prisma } from "@src/server";

async function CreateCompany(req:ICreateCompany) {
    const create = await prisma.company.create({
        data:{
            company_name:req.company_name,
            description:req.desctiprion,
            logo_link:req.logo_link
        }
    })
    return{
        status:true,
        message:'Success',
        data:create
    }

}

async function ListCompany(req:IListCompany) {
    const page = +req.page || 1
    const take = +req.per_page || 10
    const skip =(page-1) * take
    const nextPage = page + 1
    const prevPage = page - 1
    
    const total = await prisma.company.count()
    const list = await prisma.company.findMany({
        orderBy:{
            company_name:'asc'
        },
        select:{
            id:true,
            company_name:true,
            description:true,
            logo_link:true
        }
    }) 

    return{
        page:page,
        per_page:take,
        total:total,
        status:true,
        message:'Success',
        data:list
    }
}

async function UpdateCompany(req:IUpdateCompany) {
    const find = await prisma.company.findUnique({
        where:{
            id:req.id_company
        }
    })
    if(!find){
        throw new NotFoundException ('Id Not Found')
    }

    const update = await prisma.company.update({
        where:{
            id:req.id_company
        },
        data:{
            company_name:req.company_name,
            description:req.desctiprion,
            logo_link:req.logo_link
        },
        select:{
            id:true,
            company_name:true,
            description:true,
            logo_link:true
        }
    })
    return{
        status:true,
        message:'Success',
        data:update
    }

}

async function DeleteCompany(id:string) {
    const deleteCompany = await prisma.company.delete({
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
    CreateCompany,
    ListCompany,
    UpdateCompany,
    DeleteCompany
}
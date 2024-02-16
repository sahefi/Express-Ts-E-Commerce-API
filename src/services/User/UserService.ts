import UserRepo from '@src/repos/UserRepo';
import { ICreated, IDelete, IList, IUpdated, IUser } from '@src/models/User';
import { BadRequestException, NotFoundException, RouteError } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import  {prisma}  from "@src/server";
import bcrypt from 'bcrypt'
import moment from 'moment';

// **** Variables **** //

export const USER_NOT_FOUND_ERR = 'User not found';


// **** Functions **** //

/**
 * Get all users.
 */


/**
 * Add one user.
 */
function addOne(user: IUser): Promise<void> {
  return UserRepo.add(user);
}

/**
 * Update one user.
 */
async function updateOne(user: IUser): Promise<void> {
  const persists = await UserRepo.persists(user.id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  // Return user
  return UserRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: number){
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  // Delete user
  return UserRepo.delete(id);
}

async function Register(req:ICreated){


  const result = await prisma.$transaction(async(tx:any)=>{
    const findRole = await tx.role.findFirst({
      where:{
        name:'Customer'
      }
    })
    console.log(findRole)
    const find = await tx.user.findUnique({
      
      where:{
        username:req.username
      }
    }) 
  
    if(find){
      throw new BadRequestException ('Username already exist')
    }

    const hashed = await bcrypt.hash(req.password,10)
    const createUser = await tx.user.create({
      data:{
        username:req.username,
        password:hashed,
        id_role:findRole?.id
      }
    })

    const birth_date = moment(req.birth,'DD-MM_YYYY').toDate()
    const createCustomer = await tx.customer.create({
      data:{
        name:req.name,
        email:req.email,
        birth:birth_date,
        no_phone:req.no_phone,
        id_user:createUser.id
      }
    })
    return{
      data:{
        id:createUser.id,
        username:createUser.username,
        name:createCustomer.name,
        email:createCustomer.email,
        birth:moment(createCustomer.birth).format('DD-MM-YYYY'),
        no_phone:createCustomer.no_phone
      }

    }
  })
  


  return{
    status:true,
    message:"Success",
    data:result
  }

  
}


async function UpdateCustomer(req:IUpdated) {
  
  const result = await prisma.$transaction(async(tx:any)=>{
    const findRole = await tx.role.findFirst({
      where:{
        name:'Customer'
      }
    })
    const find = await tx.customer.findUnique({
      where:{
        id:req.id_customer
      }
    })
    if(!find){
      throw new NotFoundException('Id Not FOund')
    }
    const updateCustomer = await tx.customer.update({
      where:{
        id:req.id_customer
      },
      data:{
        name:req.name,
        email:req.email,
        no_phone:req.no_phone,
        birth:moment(req.birth,'DD-MM-YYYY').toDate()
      }
    })
    console.log('hi2',find.id_user)
    const updateUser = await tx.user.update({
      where:{
        id:find.id_user || undefined
      },
      data:{
        username:req.username,
      }
    })
    console.log('hello')
    return{
      id:updateCustomer.id,
      username:updateUser.username,
      name:updateCustomer.name,
      email:updateCustomer.email,
      no_phone:updateCustomer.no_phone,
      birth:moment(updateCustomer.birth).format('DD-MM-YYYY')
    }
  })
  return{
    status:true,
    message:"Sucess",
    data:result
  }
}

async function listCustomer(req:IList) {
  const page = req.page || 1
  const take = req.per_page || 10
  const skip = (page-1)*take
  const nextPage = page + 1
  const prevPage = page - 1

  const count = await prisma.customer.count()
  const list = await prisma.customer.findMany({
    include:{
      user:true
    },
    orderBy:{
      name:"asc"
    },
    take:take,skip:skip
  })
  const result = list.map((item:any)=>{
    return{
      id_customer:item.id,
      username:item.user?.username,
      name:item.name,
      email:item.email,
      no_phone:item.no_phone,
      birth:moment(item.birth).format('DD-MM-YYYY'),
      id_role:item.user?.id_role
    }
  })

  return{
    status:true,
    message:"Success",
    page:page,
    per_page:take,
    total:count,
    data:result
  }
}


async function deletedCustomer(req:IDelete) {
  const result = await prisma.$transaction(async(tx:any)=>{
    const deleteCustomer = await tx.customer.delete({
      where:{
        id:req.id_customer
      }
    })

    const deleteUser = await tx.user.delete({
      where:{
        id:deleteCustomer.id_user || undefined
      }
    })
  })
  return({
    status:true,
    message:"Success",
    data:null
  })
}

// **** Export default **** //

export default {
  Register,
  UpdateCustomer,
  listCustomer,
  deletedCustomer,
  addOne,
  updateOne,
  delete: _delete,
} as const;

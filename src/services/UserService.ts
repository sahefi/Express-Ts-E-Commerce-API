import UserRepo from '@src/repos/UserRepo';
import { ICreated, IUser } from '@src/models/User';
import { BadRequestException, RouteError } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import  {prisma}  from "@src/server";

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
async function _delete(id: number): Promise<void> {
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

async function Register(req:ICreated): Promise<void> {
  const find = await prisma.user.findUnique({
    where:{
      username:req.username
    }
  }) 

  if(!find){
    throw new BadRequestException ('Username already exist')
  }

  const result = await prisma.$transaction(async(tx)=>{
    const hash = 
  })

  
}


// **** Export default **** //

export default {
  addOne,
  updateOne,
  delete: _delete,
} as const;

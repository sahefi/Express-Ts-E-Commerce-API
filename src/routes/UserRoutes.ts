import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import UserService from '@src/services/User/UserService';
import { IUser } from '@src/models/User';
import { IReq, IRes } from './types/express/misc';


// **** Functions **** //

/**
 * Get all users.
 */


/**
 * Add one user.
 */
async function add(req: IReq<{user: IUser}>, res: IRes) {
  const { user } = req.body;
  await UserService.addOne(user);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one user.
 */
async function update(req: IReq<{user: IUser}>, res: IRes) {
  const { user } = req.body;
  await UserService.updateOne(user);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one user.
 */
async function delete_(req: IReq, res: IRes) {
  const id = +req.params.id;
  await UserService.delete(id);
  return res.status(HttpStatusCodes.OK).end();
}


// **** Export default **** //

export default {
  add,
  update,
  delete: delete_,
} as const;

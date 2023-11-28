/**
 * Miscellaneous shared classes go here.
 */

import HttpStatusCodes from '@src/constants/HttpStatusCodes';


/**
 * Error with status code and message
 */
export class RouteError extends Error {

  public status: HttpStatusCodes;

  public constructor(status: HttpStatusCodes, message: string) {
    super(message);
    this.status = status;
  }
}

export class BadRequestException extends Error {
  public status: HttpStatusCodes

  public constructor(message: string){
    super(message);
    this.status = HttpStatusCodes.BAD_REQUEST
  }
}




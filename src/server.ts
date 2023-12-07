/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import 'express-async-errors';

import BaseRouter from '@src/routes/api';
import Paths from '@src/constants/Paths';

import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { NodeEnvs } from '@src/constants/misc';
import { BadRequestException, NotFoundException, RouteError, UnauthorizedException } from '@src/other/classes';
import { PrismaClient } from '@prisma/client';
import  userController from '@src/API/User/UserController'
import staffController from '@src/API/Staff/StaffController'
import roleController from '@src/API/Role/RoleController'
import gcoController from '@src/API/GCO/GCOContorller'
import productController from '@src/API/Product/ProductController'
import commonController from '@src/API/Common/UploadController'
import companyController from '@src/API/Company/CompanyControllert'
import authController from '@src/API/Auth/AuthController'
import cartConroller from '@src/API/Cart/CartController'
// **** Variables **** //

const app = express();
const router = express.Router()
const prisma = new PrismaClient()


// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(EnvVars.CookieProps.Secret));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use((
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  else if ( err instanceof BadRequestException){
    status = HttpStatusCodes.BAD_REQUEST
  }
  else if ( err instanceof NotFoundException){
    status = HttpStatusCodes.NOT_FOUND
  }
  else if ( err instanceof UnauthorizedException){
    status = HttpStatusCodes.UNAUTHORIZED
  }
  return res.status(status).json({ error: err.message });
});


// ** Front-End Content ** //

// Set views directory (html)
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Nav to login pg by default
app.get('/', (_: Request, res: Response) => {
  res.sendFile('login.html', { root: viewsDir });
});

// Redirect to login if not logged in.
app.get('/users', (req: Request, res: Response) => {
  const jwt = req.signedCookies[EnvVars.CookieProps.Key];
  if (!jwt) {
    res.redirect('/');
  } else {
    res.sendFile('users.html', {root: viewsDir});
  }
});

app.use('/user',userController)
app.use('/staff',staffController)
app.use('/role',roleController)
app.use('/gco',gcoController)
app.use('/product',productController)
app.use('/common',commonController)
app.use('/company',companyController)
app.use('/auth',authController)
app.use('/cart',cartConroller)
// **** Export default **** //

export {app,prisma};

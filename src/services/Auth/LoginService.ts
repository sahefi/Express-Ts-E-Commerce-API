import { ILogin } from "@src/models/Auth";
import { BadRequestException, NotFoundException, UnauthorizedException } from "@src/other/classes";
import { prisma } from "@src/server";
import bcrypt from 'bcrypt'
import { NextFunction } from "express";
import express, { Request, Response } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken'

async function LoginUser(req:ILogin) {
    const findRole = await prisma.role.findFirst({
        where:{
            name:'Customer'
        }
    })
    if(findRole){
        const findUsernameCustomer = await prisma.customer.findFirst({
            where:{
                user:{
                    username:{
                        mode:'insensitive',
                        contains:req.username
                    }
                }
            },include:{
                user:true,
            }
        })

        const findRoleCustomer = await prisma.user.findUnique({
            where:{
                username:req.username
            },
            include:{
                role:true
            }
        })
        if(!findUsernameCustomer){
            throw new NotFoundException('Username Not Found')
        }
        if(findUsernameCustomer.user?.password){
            const match = await bcrypt.compare(req.password,findUsernameCustomer.user.password)
            if(match){
                const token = jwt.sign({id:findUsernameCustomer.id,username:findUsernameCustomer.user.username,id_customer:findUsernameCustomer.id,role:findRoleCustomer?.role?.name},'secret-key',{expiresIn:'1h'})
                return{
                    status:true,
                    message:'Success',
                    data:token
                }
            }
            else{
                throw new BadRequestException('Username or Password Invalid')
            }
    }
    }
    else{
        const findUsernameStaff = await prisma.staff.findFirst({
            where:{
                user:{
                    username:{
                        mode:'insensitive',
                        contains:req.username
                    }
                }
            },include:{
                user:true,
            }
        })

        const findRoleStaff = await prisma.user.findUnique({
            where:{
                username:req.username
            },
            include:{
                role:true
            }
        })
        if(!findUsernameStaff){
            throw new NotFoundException('Username Not Found')
        }
        if(findUsernameStaff.user?.password){
            const match = await bcrypt.compare(req.password,findUsernameStaff.user.password)
            if(match){
                const token = jwt.sign({id:findUsernameStaff.id,username:findUsernameStaff.user.username,id_customer:findUsernameStaff.id,role:findRoleStaff?.role?.name},'secret-key',{expiresIn:'1h'})
                return{
                    status:true,
                    message:'Success',
                    data:token
                }
            }
            else{
                throw new BadRequestException('Username or Password Invalid')
            }
    }
    }
}


export function verifyJwt(req:Request,res:Response,next: NextFunction) {
    const token = req.header('Authorization') as string
    const secertKey = "secret-key"
    
    try {
        if(!token){
            throw new UnauthorizedException("Token Tidak Valid")
        }
        const decode:JwtPayload = jwt.verify(token,secertKey,) as JwtPayload
        req.query.user=decode.id_customer
       
        next()
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new BadRequestException('Token Has Expired')
        }else {
            throw new BadRequestException('Token Error')
        }
        
        
    }
}

export default{
    LoginUser
}
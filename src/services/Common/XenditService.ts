import { ICallbackXendit, IXendit } from "@src/models/Xendit";
import { BadRequestException } from "@src/other/classes";
import { prisma } from "@src/server";
import axios, { AxiosResponse } from "axios";


export async function Invoice(req:IXendit) {
   const body = {
    external_id:req.external_id,
    amount:req.amount,
    payer_email:req.payer_email,
    description:req.description,
    customer:{
        given_names:req.given_name,
        email:req.email,
        mobile_number:req.mobile_number,
    },
    invoice_duration:req.duration,
    should_send_email:true
   }

   const params = JSON.stringify(body)
   const config = {
    headers :{
        Authorization: `Basic ${process.env.API_XENDIT_ENCODE}`
    }
   }

   const response:AxiosResponse = await axios
   .post(`${process.env.BASE_URL}/v2/invoices`,body,config)
   .catch((err)=>{
    console.log(err)
    throw new BadRequestException('Failed Generate Invoice Xendit')
   })

   return response.data



}

export async function CallbackXendit(req:ICallbackXendit) {
    if(req.status === 'PAID'){
        await prisma.bill_Header.findUniqueOrThrow({
            where:{
                id:req.external_id
            }
        })

        await prisma.$transaction (async(tx:any)=>{
            const paid = await tx.bill_Header.update({
                where:{
                    id:req.external_id
                },
                data:{
                    status_payment:'PAID',
                    payment_date:req.updated
                },
                include:{
                    bill_detail:true
                }
            })

            const auditBillHeader = await tx.audit_Bill_Header.create({
                data:{
                    id_bill_header:paid.id,
                    id_customer:paid.id_customer,
                    status_payment:paid.status_payment,
                    total:paid.total,
                }
            })

            await paid.bill_detail.map((item:any)=>{
                const sub_total = Math.ceil(Number(item.sub_total))
                return{
                    id_audit_bill_header:auditBillHeader.id,
                    id_product:item.id_product || '',
                    price:Number(item.price),
                    qty:item.qty,
                    sub_total:sub_total
                }
            })
            
        })
        return req
    }else{
        await prisma.bill_Header.findUniqueOrThrow({
            where:{
                id:req.external_id
            }
        })

        const paid = await prisma.bill_Header.update({
            where:{
                id:req.external_id
            },
            data:{
                status_payment:'CANCEL',
            }
        })
        return req
        
    }
}
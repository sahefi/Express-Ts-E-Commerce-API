import { IPayTransaction } from "@src/models/Transaction";
import { NotFoundException } from "@src/other/classes";
import { prisma } from "@src/server";
import { Invoice } from "../Common/XenditService";

async function payTransaction(req:IPayTransaction,id:string
    ) {
    const find = await prisma.cart.findMany({
        where:{
            id:{
                in:req.id_cart
            }
        },
        include:{
            product:true,
            customer: true
        }
    })
    
    if(find.length < 1){
        throw new NotFoundException('Cart Not Found')
    }
    // console.log(find);
    

    
    let total = 0
   const transaction = await prisma.$transaction(async(tx)=>{
        find.map((item)=>{
            total += Math.ceil(Number(item.product?.price)) * Number(item.quantity)
        })
        const createBillHeader = await tx.bill_Header.create({
            data:{
                id_customer:id,
                total:total,
                status_payment:'PENDING',
            }
        })
        const productBillDetail = find.map((item)=>{
            const sub_total = Math.ceil(Number(item.product?.price)) * Number(item.quantity)
            return{
                id_bill_header:createBillHeader.id,
                id_product:item.id_product || '',
                price:Number(item.product?.price),
                qty:item.quantity,
                sub_total:sub_total
            }
        })
        console.log('halop',productBillDetail)
        await tx.bill_Detail.createMany({
            data:productBillDetail
        })
        const auditBillHeader= await tx.audit_Bill_Header.create({
            data:{
                id_bill_header: createBillHeader.id,
                id_customer:id,
                status_payment:createBillHeader.status_payment,
                total:createBillHeader.total,
            }
        })
        
        const productAuditBillDetail = find.map((item)=>{
            const sub_total = Math.ceil(Number(item.product?.price)) * Number(item.quantity)
            return{
                id_audit_bill_header:auditBillHeader.id,
                id_product:item.id_product || '',
                price:Number(item.product?.price),
                qty:item.quantity,
                sub_total:sub_total
            }
        })
        
        await tx.audit_Bill_Detail.createMany({
            data:productAuditBillDetail
        })

        const invoice=await Invoice({
            external_id: createBillHeader.id,
            amount: total,
            payer_email: find[0].customer?.email||'',
            description: 'Checkout Weapon',
            given_name: find[0].customer?.name||'',
            mobile_number: String(find[0].customer?.no_phone)||'',
            duration: 86400,
            email:find[0].customer?.email||''
        })
        
        await tx.bill_Header.update({
            where:{
                id:createBillHeader.id
            },
            data:{
                payment_link:invoice.invoice_url
            }
        })

        console.log(invoice)
        await DeleteCart(req.id_cart)
        return{
            invoice_url: invoice.invoice_url ,
        }
    })
    
    return{
        status:true,
        message:'Success',
        link:transaction.invoice_url
    }
    
}
async function DeleteCart(req:string[]) {
    const deleteCart = await prisma.cart.deleteMany({
        where:{
            id:{
               in:req
        }
    }
    })
    return deleteCart
}


export default{
    payTransaction
}
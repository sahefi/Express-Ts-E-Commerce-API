import { IFinance } from "@src/models/Finance";
import { prisma } from "@src/server";
import { DateTime } from "luxon";
import moment from "moment";

async function List(req:IFinance) {

    const startCurrentDate = DateTime.now().startOf('month').setZone('Asia/Jakarta').toJSDate().toISOString();
    const endCurrentDate = DateTime.now().endOf('month').setZone('Asia/Jakarta').toJSDate().toISOString();
    let startReqDate = null
    let endReqDate = null
    if(req.periode){
         endReqDate = moment(req.periode,'MM-YYYY').endOf('month').toDate().toISOString()
         startReqDate = moment(req.periode,'MM-YYYY').startOf('month').toDate().toISOString() 
    }
    const findBillheader = await prisma.bill_Header.findMany({
        include:{
            customer:true,
            bill_detail:{
                include:{
                    product:true
                }
            }
            
        },
        orderBy:{
            customer:{
                name:'asc'
            }
        },
        where:{
            AND:{
                status_payment:'PAID',
                payment_date:{
                   gte:startReqDate||startCurrentDate,
                   lte:endReqDate||endCurrentDate
                }
            }

        }
    })
    
    const data = findBillheader.map((item)=>{
        const bill_detail = item.bill_detail.map((item)=>{
            if(item.product.type_gun === 'GUN'){
                return{
                    name:item.product.name,
                    sub_total:item.sub_total
                }
            }else{
                return{
                    name:item.product.name,
                    sub_total:item.sub_total
                }
            }
        })

        return{
            id_bill_header:item.id,
            name:item.customer.name,
            bill_detail:bill_detail
        }
    })




    console.log(data);

    return{
        data:data
    }
    
}


export default {
    List
}
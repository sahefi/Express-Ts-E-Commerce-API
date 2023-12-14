import { IFinance } from "@src/models/Finance";
import { prisma } from "@src/server";
import { DateTime } from "luxon";
import moment from "moment";

async function List(req:IFinance) {

    const startCurrentDate = DateTime.now().startOf('month').setZone('Asia/Jakarta').toJSDate().toISOString();
    const endCurrentDate = DateTime.now().endOf('month').setZone('Asia/Jakarta').toJSDate().toISOString();
    let startReqDate = null
    let endReqDate = null
    let total = 0
    let totalGun = 0
    let totalStuff = 0
    let totalLastMonth = 0
    let statusProfit = ""
    let plus = 0
    let minus = 0 
    if(req.periode){
         endReqDate = moment(req.periode,'MM-YYYY').endOf('month').toDate().toISOString()
         startReqDate = moment(req.periode,'MM-YYYY').startOf('month').toDate().toISOString() 
    }
    const findBillheader = await prisma.bill_Header.findMany({
        include:{
            customer:true,
            bill_detail:{
                include:{
                    product:{
                        include:{
                            typeGun:true
                        }
                    }
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
        total += Math.ceil(Number(item.total))
        const bill_detail = item.bill_detail.map((item)=>{ 
            if(item.product.type_gun === 'GUN'){
                return{
                    name:item.product.name,
                    type:item.product.typeGun?.name,
                    sub_total:item.sub_total
                    
                }
            }else{
                totalGun = Number(item.price) * Number(item.qty)
                return{
                    name:item.product.name,
                    type:item.product.typeGun?.type,
                    sub_total:item.sub_total
                }
                
            }
        })
        const gun = bill_detail.filter((billDetail)=>billDetail.type === 'GUN')
        totalGun += gun.reduce((currentValue, currentItem)=>{
            return Math.ceil(Number(currentValue)) + Math.ceil(Number(currentItem.sub_total))
        },0)

        totalStuff = Math.ceil(total) - Math.ceil(totalGun)
        return{
            id_bill_header:item.id,
            name:item.customer.name,
            bill_detail:bill_detail,
            
        }
    })

    const lastMonthTotal = await prisma.bill_Header.findMany({
        where:{
            status_payment:'PAID',
            payment_date:{
                lte:startReqDate||startCurrentDate
            }
        }
    })

    lastMonthTotal.map((item)=>{
        totalLastMonth += Math.ceil(Number(item.total))
    })

    if(totalLastMonth < total){
        statusProfit = "Profit"
        plus = Math.ceil(Number(total)) - Math.ceil(Number(totalLastMonth))
        
    }else{
        statusProfit = "Bangkrut"
        minus = Math.ceil(Number(total)) - Math.ceil(Number(totalLastMonth))
    }


    return{
        data:data,
        total_gun:Math.ceil(totalGun),
        total_stuff:totalStuff,
        total:Number(total),
        status_profit:statusProfit,
        plus:plus,
        minus:minus
    }


    
}



export default {
    List
}
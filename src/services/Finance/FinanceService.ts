import { IFinance } from "@src/models/Finance";
import { prisma } from "@src/server";
import { DateTime } from "luxon";
import moment from "moment";

async function List(req:IFinance) {

    const startCurrentYear = DateTime.now().startOf('year').setZone('Asia/Jakarta').toJSDate().toISOString();
    const endCurrentYear = DateTime.now().endOf('year').setZone('Asia/Jakarta').toJSDate().toISOString();
    let startReqYear = null
    let endReqYear = null
    let total = 0
    let totalGun = 0
    let totalStuff = 0
    let totalLastMonth = 0
    let statusProfit = ""
    let plus = 0
    let minus = 0 
    if(req.periode){
         endReqYear = moment(req.periode,'YYYY').endOf('year').toDate().toISOString()
         startReqYear = moment(req.periode,'YYYY').startOf('year').toDate().toISOString() 
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
                   gte:startReqYear||startCurrentYear,
                   lte:endReqYear||endCurrentYear
                }
            }

        }
    })
    
    const data = findBillheader.map((item:any)=>{
        total += Math.ceil(Number(item.total))
        const bill_detail = item.bill_detail.map((item:any)=>{ 
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
        const gun = bill_detail.filter((billDetail:any)=>billDetail.type === 'GUN')
        totalGun += gun.reduce((currentValue:any, currentItem:any)=>{
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
                lte:startReqYear||startCurrentYear
            }
        }
    })

    lastMonthTotal.map((item:any)=>{
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
        // total_gun:Math.ceil(totalGun),
        // total_stuff:totalStuff,
        // total:Number(total),
        // status_profit:statusProfit,
        // plus:plus,
        // minus:minus
    }


    
}

async function pivotTable(req: IFinance) {
    const startCurrentYear = DateTime.now().startOf('year').setZone('Asia/Jakarta').toJSDate().toISOString();
    const endCurrentYear = DateTime.now().endOf('year').setZone('Asia/Jakarta').toJSDate().toISOString();
    let startReqYear = null
    let endReqYear = null
    let totalPerBulan: Record<string, Record<string, number>> = {};
    let totalPerBulanSemuaMenu: Record<string, number>= {};
    let totalPerTahunMenu: Record<string, number> = {};
    let totalPerTahun = 0;

    if (req.periode) {
        endReqYear = moment(req.periode, 'YYYY').endOf('year').toDate().toISOString()
        startReqYear = moment(req.periode, 'YYYY').startOf('year').toDate().toISOString()
    }

    const findBillheader = await prisma.bill_Header.findMany({
        include: {
            customer: true,
            bill_detail: {
                include: {
                    product: {
                        include: {
                            typeGun: true
                        }
                    }
                }
            }

        },
        orderBy: {
            customer: {
                name: 'asc'
            }
        },
        where: {
            AND: {
                status_payment: 'PAID',
                payment_date: {
                    gte: startReqYear || startCurrentYear,
                    lte: endReqYear || endCurrentYear
                }
            }

        }
    })

    findBillheader.map(item => {
        item.bill_detail.map(detail => {
            const { product, qty, price } = detail;
            const { name } = product;
            const month = item.payment_date && DateTime.fromJSDate(item.payment_date).toFormat('MMMM');

            if (month) {
                //total per bulan per menu
                if (!totalPerBulan[name]) {
                    totalPerBulan[name] = {};
                }
                totalPerBulan[name][month] = (totalPerBulan[name][month] || 0) + Math.ceil(Number(qty)) * Math.ceil(Number(price));

                //total perbulan semua menu
                if (!totalPerBulanSemuaMenu[month]) {
                    totalPerBulanSemuaMenu[month] = 0;
                }
                totalPerBulanSemuaMenu[month] += Math.ceil(Number(qty)) * Math.ceil(Number(price));

                //total pertahun setiap menu
                if (!totalPerTahunMenu[name]){
                    totalPerTahunMenu[name] = 0;
                }

                totalPerTahunMenu[name] += Math.ceil(Number(qty)) * Math.ceil(Number(price));
            } else {
                console.error('Nilai bulan null!');
            }
            totalPerTahun += Math.ceil(Number(qty)) * Math.ceil(Number(price));
        });
    });

    // Format hasil sesuai dengan struktur JSON yang diinginkan
    const result = {
        tahun: req.periode || DateTime.now().toFormat('yyyy'),
        data_per_tahun: Object.entries(totalPerTahunMenu).reduce((acc : Record<string, any>, [menu, total]) => {
            acc[menu] = {
                total_pertahun: total,
                total_per_bulan: { ...totalPerBulan[menu] }
            };
            return acc;
        }, {}),
        total_per_bulan_dari_semua_menu: { ...totalPerBulanSemuaMenu },
        total_per_tahun: totalPerTahun
    };

    
    
    return {
        status:true,
        message:"Success",
        data:result
    }
}




export default {
    List,
    pivotTable
}
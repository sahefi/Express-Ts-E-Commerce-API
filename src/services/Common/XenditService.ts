import { IXendit } from "@src/models/Xendit";
import { BadRequestException } from "@src/other/classes";
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
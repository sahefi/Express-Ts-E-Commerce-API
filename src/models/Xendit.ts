export interface IXendit{
    external_id:string,
    amount:number,
    payer_email:string,
    description:string,
    given_name:string,
    mobile_number:string,
    email:string,
    duration:number,
    
}

export interface IAddresses{
    city:string,
    country:string,
    postal_code:string,
    state:string
}
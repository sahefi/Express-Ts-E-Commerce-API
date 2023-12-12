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

export interface ICallbackXendit{
        id: string;
        external_id: string;
        user_id: string;
        is_high: boolean;
        payment_method: string;
        status: string;
        merchant_name: string;
        amount: number;
        paid_amount: number;
        paid_at: string;
        payer_email: string;
        description: string;
        created: string;
        updated: string;
        currency: string;
        payment_channel: string;
        payment_destination: string;
}
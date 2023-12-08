export interface ICreateCart{
    id_customer:string,
    id_product:string,
    quantity:number
}

export interface IListCart{
    page:number
    per_page:number
}

export interface IDeleteCart{
    id_cart:string
}
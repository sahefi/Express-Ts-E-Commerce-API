export interface ICreateProduct{
    name:string
    description:string
    price:number
    // image_link:string
    type_ammo:string
    type_gun:string
    max_ammo:number
}

export interface IListProduct{
    page:Number
    per_page:Number
}

export interface IUpdateProduct{
    id_product:string
    name:string
    description:string
    price:number
    image_link:string
    type_ammo:string
    type_gun:string
    max_ammo:number
}


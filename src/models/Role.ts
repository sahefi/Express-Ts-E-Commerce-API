export interface ICreateRole{
    name:string
}

export interface IListRole{
    page:number,
    per_page:number
}

export interface IUpdateRole{
    id:string,
    name:string
}

export interface IDeleteRole{
    id:string
}
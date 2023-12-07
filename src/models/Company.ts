export interface ICreateCompany{
company_name:string
desctiprion:string
logo_link:string
}

export interface IListCompany{
    page:number
    per_page:number
}

export interface IUpdateCompany{
id_company:string
company_name:string
desctiprion:string
logo_link:string
}
export interface ICreatedStaff{
    username :string
    password :string
    name:string
    email:string
    no_phone:string
    id_role:string
}

export interface IUpdatedStaff{
    id_staff:string
    username:string
    name:string
    email:string
    no_phone:string
    id_role:string
}

export interface IListStaff{
    page:number,
    per_page:number
  }

export interface IDeleteStaff{
    id_staff:string
}
export interface UserTypeMongo extends UserType {
    _id: string
}

export interface UserType {
    username: string,
    password: string
}

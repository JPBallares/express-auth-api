export interface IUserCreateRequest {
    email: string
    password: string
}

export interface ITokenRequest {
    email: string
    password: string
}

export interface ITokenRefreshRequest {
    token: string
}

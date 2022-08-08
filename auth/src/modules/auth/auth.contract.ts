export interface AuthRepository {
    createUser(): Promise<any>
}
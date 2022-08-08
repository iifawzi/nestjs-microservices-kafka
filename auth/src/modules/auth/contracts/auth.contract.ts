import { UserDocument } from "../types"

export default interface AuthRepository {
    findByEmail(email: string): Promise<any>
    createUser(userData: UserDocument): Promise<any>
}
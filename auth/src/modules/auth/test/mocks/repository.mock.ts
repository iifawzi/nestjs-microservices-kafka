import { Injectable } from '@nestjs/common';
import { AuthRepository } from 'src/modules/auth/contracts';

@Injectable()
export default class AuthMockRepository implements AuthRepository {
    async findByEmail(): Promise<any> {
        const user = { email: 'iifawzie@gmail.com', 'password': '$2a$06$fEYCOWGG7UP7hr0nnlu.wORCiPzi5rO3BwzElORKifSLEmk4RqFHm', isVerified: false, activationCode: 'c7cfb115-731b-4c88-a55a-a8d398b874e7' };
        return user;
    }

    async createUser(): Promise<any> {
        return true
    }
}
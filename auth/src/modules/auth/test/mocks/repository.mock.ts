import { Injectable } from '@nestjs/common';
import { AuthRepository } from 'src/modules/auth/contracts';
import { UserDocument } from '../../types';

@Injectable()
export default class AuthMockRepository implements AuthRepository {

    private users = [
        {
            "_id": 'id',
            "fullName": "fawzi",
            "email": "iifawzie@gmail.com",
            "password": "$2a$06$t2H.ItzMtHqtOmxlRbiYGOIHfjtx4X.0XvlDpZ0F6.EryLzWsg5.u",
            "isVerified": false,
            "verificationCode": "ac2dbb84-c469-471e-ae39-d5a5ff280866"
        },
        {
            "_id": 'id',
            "fullName": "fawzi",
            "email": "iifawzie@gmail.com",
            "password": "$2a$06$t2H.ItzMtHqtOmxlRbiYGOIHfjtx4X.0XvlDpZ0F6.EryLzWsg5.u",
            "isVerified": true,
            "verificationCode": "Fc2dbb84-c469-471e-ae39-d5a5ff280866"
        }
    ];

    async findByEmail(email: string): Promise<any> {
        const user = this.users.filter(user => user.email === email)[0];
        return user;
    }

    async createUser(userData: UserDocument): Promise<any> {
        return true
    }

    async findByToken(token: string): Promise<any> {
        const user = this.users.filter(user => user.verificationCode === token)[0];
        return user;
    }

    async verifyEmail(token: string): Promise<any> {
        const user = this.users.filter(user => user.verificationCode === token && user.isVerified === false)[0];
        return {
            modifiedCount: user
        };
    }

}
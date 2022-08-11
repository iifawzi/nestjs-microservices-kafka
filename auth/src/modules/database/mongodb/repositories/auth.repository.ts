import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { AuthRepository } from 'src/modules/auth/contracts';
import { UserDocument } from 'src/modules/auth/types';

@Injectable()
export default class AuthMongoDBRepository implements AuthRepository {
    constructor(@Inject('DatabaseClient') private readonly mongoClient: Db) { }
    private readonly authCollection = this.mongoClient.collection('users');

    async findByEmail(email: string): Promise<any> {
        const user = await this.authCollection.findOne({ email: email });
        return user;
    }

    async findByToken(token: string): Promise<any> {
        const user = await this.authCollection.findOne({ token: token });
        return user;
    }

    async createUser(userData: UserDocument): Promise<any> {
        const user = await this.authCollection.insertOne(userData);
        return user;
    }

    async verifyEmail(token: string): Promise<any> {
        const user = await this.authCollection.updateOne({ isVerified: false, verificationCode: token }, { $set: { "isVerified": true } });
        return user;
    }
}
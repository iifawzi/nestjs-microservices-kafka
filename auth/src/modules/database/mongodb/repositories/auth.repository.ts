import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { AuthRepository } from 'src/modules/auth/contracts';
import { userInfoSerializer } from 'src/modules/auth/serializers';
import { UserDocument, UserInfoI } from 'src/modules/auth/types';

@Injectable()
export default class AuthMongoDBRepository implements AuthRepository {
    constructor(@Inject('DatabaseClient') private readonly mongoClient: Db) { }
    private readonly authCollection = this.mongoClient.collection('users');
 
    async findByEmail(email: string): Promise<UserInfoI> {
        const user = await this.authCollection.findOne({ email: email });
        return userInfoSerializer(user.email, user.isVerified, user.password);
    }

    async createUser(userData: UserDocument): Promise<any> {
        const user = await this.authCollection.insertOne(userData);
        return user;
    }
}
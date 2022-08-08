import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { AuthRepository } from 'src/modules/auth/auth.contract';

@Injectable()
export default class AuthMongoDBRepository implements AuthRepository {
    constructor(@Inject('DatabaseClient') private readonly mongoClient: Db) { }

    async createUser(): Promise<any> {
        console.log(this.mongoClient);
    } 
}
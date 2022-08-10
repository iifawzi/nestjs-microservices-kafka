import { Injectable } from '@nestjs/common';

@Injectable()
export default class MailServiceMock {
   public emit(eventName: string, data: any) {
    return true;
   }
}
import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import MailService from "./mail.service";

@Controller()
export default class MailController {
    constructor(private readonly mailService: MailService) { }

    @EventPattern('user_created')
    handleOrderCreated(data: any) {
        this.mailService.handleEmail(data);
    }
}
import { Controller, Get } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { KAFKA_EVENTS } from "./events";
import { UserCreatedEvent } from "./events/types/userCreated.event";
import MailService from "./mail.service";

@Controller()
export default class MailController {
    constructor(private readonly mailService: MailService) { }

    @EventPattern(KAFKA_EVENTS.user_created)
    handleOrderCreated(data: UserCreatedEvent) {
        this.mailService.sendConfirmation(data);
    }
}
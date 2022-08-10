export default class UserCreatedEvent {
    constructor(
        private readonly fullName: string,
        private readonly email: string,
        private readonly verificationCode: string,
    ) { }

    toString() {
        return JSON.stringify({
            fullName: this.fullName,
            email: this.email,
            verificationCode: this.verificationCode
        })
    }
}
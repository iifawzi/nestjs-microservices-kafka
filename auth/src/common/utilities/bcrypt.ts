import * as bcrypt from 'bcryptjs';

export abstract class BcryptHeleprsI {
    abstract hash(stringToBeHashed: string): Promise<string>
    abstract verify(plain: string, hashed: string): Promise<boolean>
}

export default class BcryptHelpers extends BcryptHeleprsI {
    public async hash(stringToBeHashed: string): Promise<string> {
        const salt = await bcrypt.genSalt(6);
        const hashed = await bcrypt.hash(stringToBeHashed, salt);
        return hashed;
    }

    public async verify(plain: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(plain, hashed);
    }
}
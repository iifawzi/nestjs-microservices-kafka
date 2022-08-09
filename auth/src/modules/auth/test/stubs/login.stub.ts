import * as DTOs from '../../dto';

export const AccountLoginStub = (email: string, password: string): DTOs.SigninBody => {
    return {
        email,
        password
    }
}
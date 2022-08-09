import { Strategy as PassportLocalStrategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import AuthService from '../../auth.service';
import { UserInfoWithoutPassword } from '../../types';

@Injectable()
export default class LocalStrategy extends PassportStrategy(PassportLocalStrategy) {
  private readonly logger = new Logger(LocalStrategy.name)
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserInfoWithoutPassword | boolean> {
    this.logger.verbose(`LocalStrategy started: ${email}`);
    const user = await this.authService.validateUser(email.toLowerCase(), password);
    if (!user) {
      this.logger.log(`user is invalid: ${user}`);
      throw new UnauthorizedException('Email or password are incorrect');
    }
    return user as UserInfoWithoutPassword;
  }
}

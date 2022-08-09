import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

const useLocalAuth = () => {
  return UseGuards(LocalAuthGuard);
};

export default useLocalAuth;

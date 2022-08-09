import { Request } from 'express';
import { UserInfoWithoutPassword } from 'src/modules/auth/types';

export default interface RequestWithUser extends Request {
  user: UserInfoWithoutPassword
}

import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerMock } from 'src/common/mocks';
import { BcryptHelpers } from 'src/common/utilities';
import AuthService from '../auth.service';
import { userCreatedEvent } from '../events';
import { AuthMockRepository } from "./mocks"
import MailServiceMock from './mocks/mailService.mock';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: 'AuthLogger',
          useFactory: (): LoggerMock => new LoggerMock()
        },
        {
          provide: 'AuthRepository',
          useClass: AuthMockRepository
        },
        {
          provide: 'bcryptHelpers',
          useClass: BcryptHelpers
        },
        {
          provide: 'MAIL_SERVICE',
          useClass: MailServiceMock
        },
        JwtService
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('Signup Service', () => {
    it('Should throw 409 if email is already registered', async () => {
      const signupService = service.signup({ fullName: 'fawzi', email: 'iifawzie@gmail.com', 'password': '123Weaszx' })
      await expect(signupService).rejects.toThrow('Email is already registered')
    })

    it('Should succeeds with 201 if the email is not already registered and notify the email service', async () => {
      jest.spyOn(AuthMockRepository.prototype, 'findByEmail').mockReturnValue(false as any);
      const hashSpy = jest.spyOn(BcryptHelpers.prototype, 'hash');
      const mailServiceEmitSpy = jest.spyOn(MailServiceMock.prototype, 'emit');
      const createUserSpy = jest.spyOn(AuthMockRepository.prototype, 'createUser')
      const signupService = await service.signup({ fullName: 'fawzi', email: 'iifawzie@gmail.com', 'password': '123Weaszx' })
      expect(hashSpy).toBeCalledWith('123Weaszx');
      expect(mailServiceEmitSpy).toBeCalledWith("user_created", new userCreatedEvent('fawzi', 'iifawzie@gmail.com', expect.any(String)));
      expect(createUserSpy).toBeCalledWith({ fullName: 'fawzi', email: 'iifawzie@gmail.com', password: expect.any(String), isVerified: false, verificationCode: expect.any(String) });
      expect(signupService.statusCode).toEqual(201);
    })
  })

  describe('ValidateUser Service', () => {
    it('Should return false if email is not registered', async () => {
      const validateUser = await service.validateUser('notRegistered@gmail.com', '123Weaszx');
      expect(validateUser).toEqual(false);
    })

    it('Should return false if password is not correct', async () => {
      const validateUser = await service.validateUser('iifawzie@gmail.com', '123Weaszx');
      expect(validateUser).toEqual(false);
    })

    it('Should return the user data if found and password is correct', async () => {
      jest.spyOn(AuthMockRepository.prototype, 'findByEmail').mockRestore()
      const validateUser = await service.validateUser('iifawzie@gmail.com', '12Qwaszxerdfcv');
      expect(validateUser).toEqual({ fullName: "fawzi", "email": "iifawzie@gmail.com", "isVerified": false });
    })
  })

  describe('Signin Service', () => {
    it('Should return the accessToken with user info ', async () => {
      jest.spyOn(AuthService.prototype, 'createAccessToken').mockReturnValue('token');
      const signin = await service.signin({ fullName: 'fawzi', email: 'iifawzie@gmail.com', isVerified: true });
      expect(signin.data).toEqual({ fullName: "fawzi", email: 'iifawzie@gmail.com', isVerified: true, accessToken: 'token' });
    })
  })
});

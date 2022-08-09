import { Test, TestingModule } from '@nestjs/testing';
import { LoggerMock } from 'src/common/mocks';
import { BcryptHelpers } from 'src/common/utilities';
import AuthService from '../auth.service';
import { AuthMockRepository } from "./mocks"

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
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('Signup Service', () => {
    it('Should throw 409 if email is already registered', async () => {
      const signupService = service.signup({ email: 'iifawzie@gmail.com', 'password': '123Weaszx' })
      await expect(signupService).rejects.toThrow('Email is already registered')
    })

    it('Should succeeds with 201 if the email is not already registered', async () => {
      jest.spyOn(AuthMockRepository.prototype, 'findByEmail').mockReturnValue(false as any);
      const hashSpy = jest.spyOn(BcryptHelpers.prototype, 'hash');
      const createUserSpy = jest.spyOn(AuthMockRepository.prototype, 'createUser')
      const signupService = await service.signup({ email: 'iifawzie@gmail.com', 'password': '123Weaszx' })
      expect(hashSpy).toBeCalledWith('123Weaszx');
      expect(createUserSpy).toBeCalledWith({ email: 'iifawzie@gmail.com', password: expect.any(String), isVerified: false, activationCode: expect.any(String) });
      expect(signupService.statusCode).toEqual(201);
    })
  })

});

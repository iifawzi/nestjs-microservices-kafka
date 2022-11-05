# tl;dr - Installation

All of the system componenets are set in the `docker-compose.yaml` that you don't need anything other than
- Clone the project and `cd` into it
- Docker compose up
- Enjoy!

The Auth APIS are documented using `swagger`, can be accessed from 
`http://localhost:5002/api-docs` with 
- username: `linkdocs`
- password: `linkdocspass`

# Technicalities  

## Structure 

The project is divided into `three` main services, `Auth` which's responsible for all things related to authentication, `Mailer` which's responsible for sending emails, and lastly the `socket` service for the chat communication use. 

Each service of the projects, is mainly structured as shown below

<img width="299" alt="Screen Shot 2022-08-11 at 9 02 41 PM" src="https://user-images.githubusercontent.com/46695441/184219497-f41d78a0-d50c-456b-a28e-0b14e7d9d0f7.png">


modules are used for the separation of concerns, each service that do a specific task can only communicate with other services through the modules (services).
The common folder contains a bunch of methods, interceptors, helpers, starters utilities that could be used at any `nestjs` project out of the box to make the development easier, it contains some interceptors for logging and dynamic responses in order to be able to send different response codes from the same api (if needed), as well as some modified swagger decorators to make the documintation process easier, and aside from the helpers and the general dtos, it contains the starter functions in order to have the main entry clean and organized as much as possible. 

## SOLID

I tried as much as possible to follow the SOLID Principles while working in this, sometimes and due to the time constraints, I might messed up with the `S` in some functions, but in the most of the cases I'd say that they were in mind. 

`Dependency Inversion`

The `D` in `SOLID` was one of the most principles that I was focusing on not to break, I've really experienced before the mess that occurs when we decide after months of working on a project that we need to change the database! what a mess that case is! i've fallen into it one day.

I've tried as much as possible, specially in critical services like the databases to `Prograam to an interface not implementation`, by using `Repositories` for the database. 

```ts
  providers: [
        AuthService,
        LocalStrategy,
        {
            provide: 'AuthLogger',
            useFactory: (): Logger => new Logger(AuthModule.name)
        },
        {
            provide: 'AuthRepository',
            useClass: AuthMongoDBRepository
        },
        {
            provide: 'bcryptHelpers',
            useClass: BcryptHelpers
        },
    ],

```
that way, I was able to simply inject different implementation at anytime, because the code is decoupled and the services are pointing to the repository interfaces 

```js
import { UserDocument, UserInfoI } from "../types"

export default interface AuthRepository {
    findByEmail(email: string): Promise<any>
    findByToken(token: string): Promise<any>
    createUser(userData: UserDocument): Promise<any>
    verifyEmail(token: string): Promise<any>
}

```

* I don't really love to use `any` but it would be a time consuming to set all the types correctly in that short time of period.

This also have helped while `testing`, making mocks repositories and inject them instead of communicating with a real database. 

```js

@Injectable()
export default class AuthMockRepository implements AuthRepository {

    private users = [
        {
            "_id": 'id',
            "fullName": "fawzi",
            "email": "iifawzie@gmail.com",
            "password": "$2a$06$t2H.ItzMtHqtOmxlRbiYGOIHfjtx4X.0XvlDpZ0F6.EryLzWsg5.u",
            "isVerified": false,
            "verificationCode": "ac2dbb84-c469-471e-ae39-d5a5ff280866"
        },
        {
            "_id": 'id',
            "fullName": "fawzi",
            "email": "iifawzie@gmail.com",
            "password": "$2a$06$t2H.ItzMtHqtOmxlRbiYGOIHfjtx4X.0XvlDpZ0F6.EryLzWsg5.u",
            "isVerified": true,
            "verificationCode": "Fc2dbb84-c469-471e-ae39-d5a5ff280866"
        }
    ];

    async findByEmail(email: string): Promise<any> {
        const user = this.users.filter(user => user.email === email)[0];
        return user;
    }

    async createUser(userData: UserDocument): Promise<any> {
        return true
    }

    async findByToken(token: string): Promise<any> {
        const user = this.users.filter(user => user.verificationCode === token)[0];
        return user;
    }

    async verifyEmail(token: string): Promise<any> {
        const user = this.users.filter(user => user.verificationCode === token && user.isVerified === false)[0];
        return {
            modifiedCount: user
        };
    }

}

```

## TESTING

I was planning to test all the services and even create some `e2e` tests against a test database, but due to the time constraints, I've only managed to write unit tests testing the `Auth` services, and as shown above, I've created a mock of the services that the `Auth` service depends on and then unit tested their functionalities in isolation.  

The code below showing a sample of the injected providers in the test module

```js
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
```

## Mailing

I've used `sandgrid` as smtp server, it offers 100 free email per day, I've already used `SES` from amazon, and I'd say that it's more production ready than any other services. Anyway, for the purpose of the project and the timeframe, `sendgrid` seemed enough. 

# Architecture  

## Kafka and Bull 

Actually, it's the first time me interacting with kafka, I've heard about it a lot, and after experminting it in this project, I'd say that in my opinion it's an overkill in most the cases I think. Btw, I've learned a lot, and willing to also learn more about it, and how can we get the most out of its benefits in real systems. 

I've used it as the main way of communication between the `Auth` Service and the `Mailing` service. Whenever any user is created, an event is emitted to the `mail` topic:

```js
 this.mailClient.emit(KAFKA_EVENTS.user_created, new UserCreatedEvent(data.fullName, data.email, data.verificationCode));
```

which's then consumed at the `mailer` service:

```js
    @EventPattern(KAFKA_EVENTS.user_created)
    handleOrderCreated(data: UserCreatedEvent) {
        this.mailService.sendConfirmation(data);
    }
```

That's it for kafka, I bet that it's not the most efficent way of doing this, but i'm still getting myself more familiar with it. 

For `KAFKA` and `zookeeper` I've configured a SASL_PLAINTEXT Authentication mechanism, it's the simplest mechanism, but was enough for the purpose of the the project. 

Let's now talk about how mailer is working Internally, I've chosen to use a `Queue` to manage the sending emails jobs, so, whenever an event is consumed from kafka, it will be added to a `FIFO` Queue, with 3 retiries at maximum. 

```js
@Processor(MAIL_QUEUE)
@Injectable()
export class MailProcessor {
  constructor(
    @Inject('MailLogger') private readonly logger: Logger,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) { }

  @OnQueueActive()
  public onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<UserCreatedEvent>, error: any) {
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  }

  @Process(CONFIRM_REGISTRATION)
  public async confirmRegistration(job: Job<UserCreatedEvent>) {
    this.logger.log(`Sending confirm registration email to '${job.data.email}'`);

    try {
      return this.mailerService.sendMail({
        to: job.data.email,
        from: this.configService.get('mailer.fromMail'),
        subject: this.configService.get('mailer.subject'),
        template: './confirmation',
        context: { verify_url: this.configService.get<string>('VERIFY_URL') + job.data.verificationCode },
      });
    } catch {
      this.logger.error(`Failed to send confirmation email to '${job.data.email}'`);
    }
  }
}
```

I've used `Bull` and https://docs.nestjs.com/techniques/queues#queues was my friend there. 

I do believe that there are more production ready solutions other than using redis, and Bull, for this, `SQS` as an alternative to `Bull` and `elasticache` as an alternative to `Redis` can be good solutions that scales very well out of the box. 

Here's also I want to share my thoughts regarding the failed jobs, if any job failed for three times it will be kept in the failed jobs queue and will not be re-run until we manage to get it back to the queue. for this I think we can implement some sort of Dead letter queues, so after we invesitgate more they can be added later to the queue. Anyway, those are just thoughts, I didn't had the time to impelement any solution for the failed jobs. 

## Socket

Socket is mainly used for chatting, I've supported the ability of joining multiple rooms and even the ability to see `Fawzi is typing...`.

When it comes to the security, I've added a bunch of security layers to make sure that the socket topics and events can't be misused, a `JOI` schema is validating every payload, and all the events are checked against a pre-determined only allowed `topics`, whenever anything is violated the client will be disconneced immediately. Aside from all of that, no one can communicate with the socket server without the authorization header that's identifying the user. 

```js
export class socketIoAdapter extends IoAdapter {
    constructor(
        app: INestApplication,
        private readonly logger: Logger,
        private configService: ConfigService,
    ) {
        super();
    }

    createIOServer(port: number, options?: any): any {
        port = this.configService.get<number>('socket.port');
        const secretKey = this.configService.get<string>('usersAuth.secret');
        const server = super.createIOServer(port, options);
        server.use((socket: Socket, next: (error?: Error) => void) => {
            this.logger.verbose(`[createIOServer] - Socket auth middleware started`);
            const authHeader: string = socket.handshake.query.authorization as string
            // To get the token without bearer
            if (!authHeader) {
                this.logger.debug(`[createIOServer] - Client is not authoirzed, authorization not found ${JSON.stringify(authHeader)}`);
                return next(new WsException('You\'re not authorized'));
            }
            const authorizationToken = authHeader.split('bearer ')[1];
            try {
                const isValidToken = jwt.verify(authorizationToken, secretKey, { ignoreExpiration: false });
                if (isValidToken) {
                    return next();
                }
                this.logger.debug(`[createIOServer] - Client is not authoirzed, token is invalid`);
                return next(new WsException('You\'re not authorized'));
            } catch (error) {
                this.logger.debug(`[createIOServer] - Client is not authoirzed, something wrong happened ${JSON.stringify(error)}`);
                return next(new WsException('You\'re not authorized'));
            }
        })
        return server;
    }
}

export default socketIoAdapter

```

and the events handlers: 

```js
        switch (eventName) {
            case AllowedEventsForEmit.join_room:
                this.handleJoinRoom(eventPayload, client);
                break;
            case AllowedEventsForEmit.message:
                await this.handleMessage(eventPayload, client);
                break
            case AllowedEventsForEmit.isTyping:
                this.handleIsTyping(eventPayload, client);
                break
            default:
                this.logger.debug(`Unallowed event [${eventName}]-[${JSON.stringify(eventPayload)}]`);
                break;

```

## MongoDB

I've used the `MongoDB` native validators with the `$jsonSchema` operator to ensure data schemas in production, MongoDB is used mainly for two purposes, the first one is for the `users` collection and the second use is for storing the messages, each service is responsible for its `database` but all are on the same `mongoDB` server, definitely each can manage its own server, but I felt like that this will an overkill here. 

## Redis

Redis is used by `Bull` to manage the jobs, and by the `Socket` layer to cache the last `10` messages in each room, the same here as well, each service manage it's own data but they're both in the same instance. 

The way we're handling the messages history is that whenever any person join a room, we will check if there's a history of the last `10` messages is already cached, if not, will get them from the database if there's already messages, and will be cached. 

This way, in the worst case there will be only one `miss` for the room because all subsequent users joining the room will hit the cache because the messages will be already cached. 

## Health APIs

I've used the `terminus` module at nest mainly for this purpose, and have created a custom indicators for MongoDB, and the SocketIO layers. 
for this to work as expected, I needed to do a manual timeout function, in order to be able to timeout the services calls if took too much time. 

```js
function delay(time: number) {
    return new Promise(function (fulfill) {
        setTimeout(fulfill, time);
    });
}

export default function RunWithTimeOut<T>(promise: Promise<T>, time: number) {
    return Promise.race([promise, delay(time).then(function () {
        throw new Error('Operation timed out');
    })]);
}
```

This function is then used to call the services, and for example if timeout of 5000ms is excceeded, the service is considered down. 

for the SocketIO indicator, I've crated a specific event for that purpose `healthCheck` so we can emit that topic to make sure that the Socket layer is up, thus I had to get a long-live token to be used
to pass the socket layer authentication mechanism.

```js
@Injectable()
export default class SocketIOHealthIndicator extends HealthIndicator {
    constructor(
        private configService: ConfigService
    ) {
        super()
    }

    async isHealthy(key: string, timeout: number): Promise<HealthIndicatorResult> {
        let isHealthy = false;
        let shouldWait = true;
        try {
            const SOCKET_PORT = +this.configService.get<number>('socket.port');
            const SOCKET_AUTH_HEADER = this.configService.get<string>('socket.auth');
            const header = `bearer ${SOCKET_AUTH_HEADER}`;
            console.log(header);
            const socket = io(`http://localhost:${SOCKET_PORT}`, {
                transports: ['websocket'],
                query: {
                    'authorization': header,
                },
            });
            socket.emit("healthCheck", {});
            socket.on("healthCheck", () => {
                shouldWait = false;
                isHealthy = true;
            });

        } catch (err) {
            shouldWait = false;
        }

        if (shouldWait) {
            await delay(timeout);
        }

        if (isHealthy) {
            const SuccessResult = this.getStatus(key, isHealthy);
            return SuccessResult;
        }
        throw new HealthCheckError('WebSocket failed', this.getStatus(key, isHealthy, { "message": `timeout of ${timeout}ms exceeded` }));

    }
}

```

# Conclusions 

This's not everything, I just wanted to highlight some points here, other details and some comments as well are in the code. 
I do beleive that there's a lot of aspects that can be improved, maybe when I have more time. 


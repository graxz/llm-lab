import { createHash, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { AppError, User } from '@llm-lab/domain';

const scrypt = promisify(scryptCallback);

export type UserSnapshotLike = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
};

export type WorkspaceInput = {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
};

export type UserRepository = {
  findByEmail(email: string): UserSnapshotLike | null;
  findById(id: string): UserSnapshotLike | null;
  insert(user: UserSnapshotLike): void;
};

export type WorkspaceRepository = {
  insert(workspace: WorkspaceInput): void;
};

export type SessionInput = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
};

export type SessionRepository = {
  insert(session: SessionInput): void;
  findByTokenHash(tokenHash: string): SessionInput | null;
  deleteByTokenHash(tokenHash: string): void;
};

export type RegistrationTransaction = (operation: () => void) => void;

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type RegisterUserOutput = {
  user: AuthenticatedUser;
  workspace: WorkspaceInput;
};

export type LoginUserInput = {
  email: string;
  password: string;
};

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
};

export class EmailAlreadyRegisteredError extends AppError {
  constructor() {
    super('EMAIL_ALREADY_REGISTERED', 409, 'Email is already registered');
    this.name = 'EmailAlreadyRegisteredError';
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('INVALID_CREDENTIALS', 401, 'Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}

export class SessionNotFoundError extends AppError {
  constructor() {
    super('UNAUTHENTICATED', 401, 'Authentication required');
    this.name = 'SessionNotFoundError';
  }
}

export class PasswordHasher {
  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    return `scrypt$${salt}$${derivedKey.toString('hex')}`;
  }

  async verify(password: string, encodedHash: string): Promise<boolean> {
    const [algorithm, salt, key] = encodedHash.split('$');
    if (algorithm !== 'scrypt' || !salt || !key) return false;

    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    const storedKey = Buffer.from(key, 'hex');
    return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey);
  }
}

export class RegisterUserUseCase {
  constructor(
    private readonly dependencies: {
      users: UserRepository;
      workspaces: WorkspaceRepository;
      transaction: RegistrationTransaction;
      passwordHasher: PasswordHasher;
      idGenerator?: () => string;
    },
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const { name, email, password } = input;
    if (this.dependencies.users.findByEmail(email)) throw new EmailAlreadyRegisteredError();

    const idGenerator = this.dependencies.idGenerator ?? randomUUID;
    const user = User.create({
      id: idGenerator(),
      name,
      email,
      passwordHash: await this.dependencies.passwordHasher.hash(password),
    });
    const workspace: WorkspaceInput = {
      id: idGenerator(),
      userId: user.id,
      name: `${user.name}'s Workspace`,
      createdAt: new Date(),
    };

    this.dependencies.transaction(() => {
      this.dependencies.users.insert(user.toSnapshot());
      this.dependencies.workspaces.insert(workspace);
    });

    return { user: toAuthenticatedUser(user.toSnapshot()), workspace };
  }
}

export class LoginUserUseCase {
  constructor(
    private readonly dependencies: {
      users: UserRepository;
      sessions: SessionRepository;
      passwordHasher: PasswordHasher;
      idGenerator?: () => string;
      tokenGenerator?: () => string;
      sessionDurationMs?: number;
    },
  ) {}

  async execute(input: LoginUserInput): Promise<{ user: AuthenticatedUser; sessionToken: string; expiresAt: Date }> {
    const { email } = input;
    const user = this.dependencies.users.findByEmail(email);
    const passwordMatches = user ? await this.dependencies.passwordHasher.verify(input.password, user.passwordHash) : false;

    if (!user || !passwordMatches || user.status !== 'active') throw new InvalidCredentialsError();

    const idGenerator = this.dependencies.idGenerator ?? randomUUID;
    const tokenGenerator = this.dependencies.tokenGenerator ?? (() => randomBytes(32).toString('base64url'));
    const sessionToken = tokenGenerator();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (this.dependencies.sessionDurationMs ?? 1000 * 60 * 60 * 24 * 7));

    this.dependencies.sessions.insert({
      id: idGenerator(),
      userId: user.id,
      tokenHash: hashSessionToken(sessionToken),
      expiresAt,
      createdAt: now,
    });

    return { user: toAuthenticatedUser(user), sessionToken, expiresAt };
  }
}

export class LogoutUserUseCase {
  constructor(private readonly sessions: SessionRepository) {}

  execute(sessionToken: string): void {
    this.sessions.deleteByTokenHash(hashSessionToken(sessionToken));
  }
}

export class GetAuthenticatedUserUseCase {
  constructor(private readonly dependencies: { sessions: SessionRepository; users: UserRepository }) {}

  execute(sessionToken: string): AuthenticatedUser {
    const session = this.dependencies.sessions.findByTokenHash(hashSessionToken(sessionToken));
    if (!session || session.expiresAt.getTime() <= Date.now()) throw new SessionNotFoundError();

    const user = this.dependencies.users.findById(session.userId);
    if (!user || user.status !== 'active') throw new SessionNotFoundError();

    return toAuthenticatedUser(user);
  }
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function toAuthenticatedUser(user: UserSnapshotLike): AuthenticatedUser {
  return { id: user.id, name: user.name, email: user.email, status: user.status };
}

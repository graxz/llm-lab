import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { User } from '@llm-lab/domain';

const scrypt = promisify(scryptCallback);

export type UserRepository = {
  findByEmail(email: string): UserSnapshotLike | null;
  insert(user: UserSnapshotLike): void;
};

export type WorkspaceRepository = {
  insert(workspace: WorkspaceInput): void;
};

export type RegistrationTransaction = (operation: () => void) => void;

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type RegisterUserOutput = {
  user: {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
  };
  workspace: WorkspaceInput;
};

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super('User email is already registered');
    this.name = 'EmailAlreadyRegisteredError';
  }
}

export class InvalidRegistrationInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRegistrationInputError';
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
    if (algorithm !== 'scrypt' || !salt || !key) {
      return false;
    }

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
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if (!name) throw new InvalidRegistrationInputError('Name is required');
    if (!email) throw new InvalidRegistrationInputError('Email is required');
    if (!input.password) throw new InvalidRegistrationInputError('Password is required');
    if (input.password.length < 8) throw new InvalidRegistrationInputError('Password must have at least 8 characters');
    if (input.password !== input.passwordConfirmation) {
      throw new InvalidRegistrationInputError('Password confirmation does not match');
    }

    if (this.dependencies.users.findByEmail(email)) {
      throw new EmailAlreadyRegisteredError();
    }

    const idGenerator = this.dependencies.idGenerator ?? randomUUID;
    const user = User.create({
      id: idGenerator(),
      name,
      email,
      passwordHash: await this.dependencies.passwordHasher.hash(input.password),
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

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      workspace,
    };
  }
}

type UserSnapshotLike = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
};

type WorkspaceInput = {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
};

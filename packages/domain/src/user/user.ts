export type UserId = string;

export type UserStatus = 'active' | 'inactive';

export type CreateUserInput = {
  id: UserId;
  name: string;
  email: string;
  passwordHash: string;
};

export type UserSnapshot = {
  id: UserId;
  name: string;
  email: string;
  passwordHash: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
};

export class User {
  private constructor(private props: UserSnapshot) {}

  static create(input: CreateUserInput): User {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if (!name) {
      throw new Error('User name is required');
    }

    if (!email) {
      throw new Error('User email is required');
    }

    if (!User.isValidEmail(email)) {
      throw new Error('User email is invalid');
    }

    if (!input.passwordHash) {
      throw new Error('User password hash is required');
    }

    const now = new Date();

    return new User({
      id: input.id,
      name,
      email,
      passwordHash: input.passwordHash,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
  }

  static rehydrate(snapshot: UserSnapshot): User {
    return new User(snapshot);
  }

  get id(): UserId {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  deactivate(): void {
    this.props.status = 'inactive';
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.status = 'active';
    this.props.updatedAt = new Date();
  }

  isActive(): boolean {
    return this.props.status === 'active';
  }

  toSnapshot(): UserSnapshot {
    return {
      ...this.props,
    };
  }

  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

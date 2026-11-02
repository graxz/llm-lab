import { describe, expect, it } from 'vitest';
import {
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
  LoginUserUseCase,
  LogoutUserUseCase,
  PasswordHasher,
  RegisterUserUseCase,
  type SessionInput,
  type UserSnapshotLike,
} from './index.js';

function setup() {
  const users = new Map<string, UserSnapshotLike>();
  const sessions = new Map<string, SessionInput>();
  const workspaces = new Map<string, any>();
  let id = 0;
  const userRepository = {
    findByEmail: (email: string) => users.get(email) ?? null,
    findById: (userId: string) => [...users.values()].find((user) => user.id === userId) ?? null,
    insert: (user: UserSnapshotLike) => users.set(user.email, user),
  };
  const sessionRepository = {
    insert: (session: SessionInput) => sessions.set(session.tokenHash, session),
    findByTokenHash: (tokenHash: string) => sessions.get(tokenHash) ?? null,
    deleteByTokenHash: (tokenHash: string) => sessions.delete(tokenHash),
  };
  const workspaceRepository = {
    insert: (workspace: any) => workspaces.set(workspace.id, workspace),
    findAllByUserId: (userId: string) => [...workspaces.values()].filter((workspace) => workspace.userId === userId),
    findByIdForUser: (workspaceId: string, userId: string) => [...workspaces.values()].find((workspace) => workspace.id === workspaceId && workspace.userId === userId) ?? null,
    findDefaultByUserId: (userId: string) => [...workspaces.values()].find((workspace) => workspace.userId === userId && workspace.isDefault) ?? null,
  };
  const dependencies = {
    users: userRepository,
    workspaces: workspaceRepository,
    transaction: (operation: () => void) => operation(),
    passwordHasher: new PasswordHasher(),
    idGenerator: () => `id-${++id}`,
  };
  return { users, sessions, workspaces, userRepository, sessionRepository, register: new RegisterUserUseCase(dependencies), login: new LoginUserUseCase({ users: userRepository, sessions: sessionRepository, passwordHasher: dependencies.passwordHasher, idGenerator: () => `session-${++id}`, tokenGenerator: () => 'session-token' }), logout: new LogoutUserUseCase(sessionRepository) };
}

describe('RegisterUserUseCase', () => {
  it('registers a user and creates the initial workspace without exposing the password', async () => {
    const { register, users, workspaces } = setup();
    const result = await register.execute({ name: 'Isaddora', email: 'isaddora@example.com', password: 'strong-password', passwordConfirmation: 'strong-password' });
    expect(result.user.email).toBe('isaddora@example.com');
    expect(result.user.name).toBe('Isaddora');
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(users.get('isaddora@example.com')?.passwordHash).not.toBe('strong-password');
    expect(workspaces.size).toBe(1);
  });

  it('rejects a duplicated email', async () => {
    const { register } = setup();
    await register.execute({ name: 'A', email: 'a@example.com', password: '12345678', passwordConfirmation: '12345678' });
    await expect(register.execute({ name: 'B', email: 'a@example.com', password: '12345678', passwordConfirmation: '12345678' })).rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
  });

});

describe('LoginUserUseCase', () => {
  it('creates a session for valid credentials and revokes it on logout', async () => {
    const { register, login, logout, sessions } = setup();
    await register.execute({ name: 'A', email: 'a@example.com', password: '12345678', passwordConfirmation: '12345678' });
    const result = await login.execute({ email: 'a@example.com', password: '12345678' });
    expect(result.user.email).toBe('a@example.com');
    expect(result.sessionToken).toBe('session-token');
    expect(sessions.size).toBe(1);
    logout.execute(result.sessionToken);
    expect(sessions.size).toBe(0);
  });

  it('rejects invalid credentials without revealing the reason', async () => {
    const { login } = setup();
    await expect(login.execute({ email: 'missing@example.com', password: 'wrong' })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});

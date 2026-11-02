import { describe, expect, it } from 'vitest';
import { User } from '@llm-lab/domain';
import { createDatabase, createUserRegistrationTransaction, createUserRepository, createWorkspaceRepository } from './index.js';

describe('SQLite registration persistence', () => {
  it('persists a user and its initial workspace in one transaction', () => {
    const database = createDatabase();
    const users = createUserRepository(database);
    const workspaces = createWorkspaceRepository(database);
    const user = User.create({
      id: 'user-1',
      name: 'Isaddora',
      email: 'isaddora@example.com',
      passwordHash: 'scrypt$salt$hash',
    });
    const workspace = {
      id: 'workspace-1',
      userId: user.id,
      name: 'Isaddora Workspace',
      isDefault: true,
      createdAt: new Date(),
    };

    createUserRegistrationTransaction(database)(() => {
      users.insert(user.toSnapshot());
      workspaces.insert(workspace);
    });

    expect(users.findByEmail('isaddora@example.com')).toMatchObject({
      id: 'user-1',
      email: 'isaddora@example.com',
    });
    expect(workspaces.findDefaultByUserId(user.id)).toMatchObject({
      id: 'workspace-1',
      userId: user.id,
      isDefault: true,
    });
    expect(workspaces.findDefaultByUserId('another-user')).toBeNull();
    expect(database.prepare('SELECT COUNT(*) as count FROM workspaces').get()).toEqual({ count: 1 });
    database.close();
  });
});

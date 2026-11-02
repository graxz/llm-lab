import Database from 'better-sqlite3';
import type { UserSnapshot } from '@llm-lab/domain';

export type DatabaseConnection = Database.Database;

export type UserRecord = UserSnapshot;

export type WorkspaceRecord = {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
};

export function createDatabase(filename = process.env.DATABASE_PATH ?? ':memory:'): DatabaseConnection {
  const database = new Database(filename);
  database.pragma('foreign_keys = ON');

  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  return database;
}

export function createUserRepository(database: DatabaseConnection) {
  const findByEmailStatement = database.prepare(`
    SELECT id, name, email, password_hash, status, created_at, updated_at
    FROM users
    WHERE email = ?
  `);

  const insertUserStatement = database.prepare(`
    INSERT INTO users (id, name, email, password_hash, status, created_at, updated_at)
    VALUES (@id, @name, @email, @passwordHash, @status, @createdAt, @updatedAt)
  `);

  return {
    findByEmail(email: string): UserRecord | null {
      const row = findByEmailStatement.get(email) as UserRow | undefined;
      return row ? mapUserRow(row) : null;
    },

    insert(user: UserRecord): void {
      insertUserStatement.run({
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        status: user.status,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });
    },
  };
}

export function createWorkspaceRepository(database: DatabaseConnection) {
  const insertWorkspaceStatement = database.prepare(`
    INSERT INTO workspaces (id, user_id, name, created_at)
    VALUES (@id, @userId, @name, @createdAt)
  `);

  return {
    insert(workspace: WorkspaceRecord): void {
      insertWorkspaceStatement.run({
        id: workspace.id,
        userId: workspace.userId,
        name: workspace.name,
        createdAt: workspace.createdAt.toISOString(),
      });
    },
  };
}

export function createUserRegistrationTransaction(database: DatabaseConnection): (operation: () => void) => void {
  return (operation) => {
    database.transaction(operation)();
  };
}

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

function mapUserRow(row: UserRow): UserRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    status: row.status,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

import Database from 'better-sqlite3';
import type { AssistantInput, AssistantRepository, SessionInput, UserRepository, UserSnapshotLike, WorkspaceInput, WorkspaceRepository } from '@llm-lab/auth';

export type DatabaseConnection = Database.Database;
export type UserRecord = UserSnapshotLike;
export type WorkspaceRecord = WorkspaceInput;
export type SessionRecord = SessionInput;

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
      is_default INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS assistants (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      system_instructions TEXT NOT NULL,
      model TEXT NOT NULL,
      temperature REAL NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'deleted')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
    );
  `);
  return database;
}

export function createUserRepository(database: DatabaseConnection): UserRepository {
  const findByEmailStatement = database.prepare('SELECT id, name, email, password_hash, status, created_at, updated_at FROM users WHERE email = ?');
  const findByIdStatement = database.prepare('SELECT id, name, email, password_hash, status, created_at, updated_at FROM users WHERE id = ?');
  const insertUserStatement = database.prepare('INSERT INTO users (id, name, email, password_hash, status, created_at, updated_at) VALUES (@id, @name, @email, @passwordHash, @status, @createdAt, @updatedAt)');

  return {
    findByEmail(email) {
      const row = findByEmailStatement.get(email) as UserRow | undefined;
      return row ? mapUserRow(row) : null;
    },
    findById(id) {
      const row = findByIdStatement.get(id) as UserRow | undefined;
      return row ? mapUserRow(row) : null;
    },
    insert(user) {
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

export function createAssistantRepository(database: DatabaseConnection): AssistantRepository {
  const insertStatement = database.prepare('INSERT INTO assistants (id, workspace_id, name, description, system_instructions, model, temperature, status, created_at, updated_at) VALUES (@id, @workspaceId, @name, @description, @systemInstructions, @model, @temperature, @status, @createdAt, @updatedAt)');
  const listStatement = database.prepare('SELECT * FROM assistants WHERE workspace_id = ? AND status != \'deleted\' ORDER BY created_at ASC');
  const findStatement = database.prepare('SELECT * FROM assistants WHERE id = ? AND workspace_id = ? AND status != \'deleted\'');
  const updateStatement = database.prepare('UPDATE assistants SET name=@name, description=@description, system_instructions=@systemInstructions, model=@model, temperature=@temperature, status=@status, updated_at=@updatedAt WHERE id=@id');
  const deleteStatement = database.prepare("UPDATE assistants SET status = 'deleted', updated_at = @updatedAt WHERE id = @id");
  return {
    insert(assistant: AssistantInput): void {
      insertStatement.run({ id: assistant.id, workspaceId: assistant.workspaceId, name: assistant.name, description: assistant.description, systemInstructions: assistant.systemInstructions, model: assistant.model, temperature: assistant.temperature, status: assistant.status, createdAt: assistant.createdAt.toISOString(), updatedAt: assistant.updatedAt.toISOString() });
    },
    findAllByWorkspaceId(workspaceId) { return (listStatement.all(workspaceId) as AssistantRow[]).map(mapAssistantRow); },
    findByIdForWorkspace(id, workspaceId) { const row = findStatement.get(id, workspaceId) as AssistantRow | undefined; return row ? mapAssistantRow(row) : null; },
    update(assistant) { updateStatement.run({ id: assistant.id, name: assistant.name, description: assistant.description, systemInstructions: assistant.systemInstructions, model: assistant.model, temperature: assistant.temperature, status: assistant.status, updatedAt: assistant.updatedAt.toISOString() }); },
    softDelete(id) { deleteStatement.run({ id, updatedAt: new Date().toISOString() }); },
  };
}

export function createWorkspaceRepository(database: DatabaseConnection): WorkspaceRepository {
  const insertWorkspaceStatement = database.prepare('INSERT INTO workspaces (id, user_id, name, is_default, created_at) VALUES (@id, @userId, @name, @isDefault, @createdAt)');
  const findAllWorkspacesStatement = database.prepare('SELECT id, user_id, name, is_default, created_at FROM workspaces WHERE user_id = ? ORDER BY created_at ASC');
  const findWorkspaceByIdStatement = database.prepare('SELECT id, user_id, name, is_default, created_at FROM workspaces WHERE id = ? AND user_id = ?');
  const findDefaultWorkspaceStatement = database.prepare('SELECT id, user_id, name, is_default, created_at FROM workspaces WHERE user_id = ? AND is_default = 1');
  return {
    insert(workspace) {
      insertWorkspaceStatement.run({
        id: workspace.id,
        userId: workspace.userId,
        name: workspace.name,
        isDefault: workspace.isDefault ? 1 : 0,
        createdAt: workspace.createdAt.toISOString(),
      });
    },
    findAllByUserId(userId: string): WorkspaceRecord[] {
      return (findAllWorkspacesStatement.all(userId) as WorkspaceRow[]).map(mapWorkspaceRow);
    },
    findByIdForUser(workspaceId: string, userId: string): WorkspaceRecord | null {
      const row = findWorkspaceByIdStatement.get(workspaceId, userId) as WorkspaceRow | undefined;
      return row ? mapWorkspaceRow(row) : null;
    },
    findDefaultByUserId(userId: string): WorkspaceRecord | null {
      const row = findDefaultWorkspaceStatement.get(userId) as WorkspaceRow | undefined;
      return row ? mapWorkspaceRow(row) : null;
    },
  };
}

export function createSessionRepository(database: DatabaseConnection) {
  const insertSessionStatement = database.prepare('INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at) VALUES (@id, @userId, @tokenHash, @expiresAt, @createdAt)');
  const findByTokenHashStatement = database.prepare('SELECT id, user_id, token_hash, expires_at, created_at FROM sessions WHERE token_hash = ?');
  const deleteByTokenHashStatement = database.prepare('DELETE FROM sessions WHERE token_hash = ?');
  return {
    insert(session: SessionRecord): void {
      insertSessionStatement.run({ id: session.id, userId: session.userId, tokenHash: session.tokenHash, expiresAt: session.expiresAt.toISOString(), createdAt: session.createdAt.toISOString() });
    },
    findByTokenHash(tokenHash: string): SessionRecord | null {
      const row = findByTokenHashStatement.get(tokenHash) as SessionRow | undefined;
      return row ? { id: row.id, userId: row.user_id, tokenHash: row.token_hash, expiresAt: new Date(row.expires_at), createdAt: new Date(row.created_at) } : null;
    },
    deleteByTokenHash(tokenHash: string): void {
      deleteByTokenHashStatement.run(tokenHash);
    },
  };
}

export function createUserRegistrationTransaction(database: DatabaseConnection): (operation: () => void) => void {
  return (operation) => database.transaction(operation)();
}

type UserRow = { id: string; name: string; email: string; password_hash: string; status: 'active' | 'inactive'; created_at: string; updated_at: string };
type WorkspaceRow = { id: string; user_id: string; name: string; is_default: number; created_at: string };
type SessionRow = { id: string; user_id: string; token_hash: string; expires_at: string; created_at: string };
type AssistantRow = { id: string; workspace_id: string; name: string; description: string | null; system_instructions: string; model: string; temperature: number; status: 'active' | 'inactive' | 'deleted'; created_at: string; updated_at: string };

function mapUserRow(row: UserRow): UserRecord {
  return { id: row.id, name: row.name, email: row.email, passwordHash: row.password_hash, status: row.status, createdAt: new Date(row.created_at), updatedAt: new Date(row.updated_at) };
}

function mapWorkspaceRow(row: WorkspaceRow): WorkspaceRecord {
  return { id: row.id, userId: row.user_id, name: row.name, isDefault: row.is_default === 1, createdAt: new Date(row.created_at) };
}

function mapAssistantRow(row: AssistantRow): AssistantInput {
  return { id: row.id, workspaceId: row.workspace_id, name: row.name, description: row.description, systemInstructions: row.system_instructions, model: row.model, temperature: row.temperature, status: row.status as 'active' | 'inactive', createdAt: new Date(row.created_at), updatedAt: new Date(row.updated_at) };
}

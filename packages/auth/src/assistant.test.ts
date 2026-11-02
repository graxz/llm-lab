import { describe, expect, it } from 'vitest';
import { AssistantWorkspaceAccessDeniedError, CreateAssistantUseCase, InvalidAssistantConfigurationError } from './assistant.js';

describe('CreateAssistantUseCase', () => {
  function setup() {
    const saved: any[] = [];
    const useCase = new CreateAssistantUseCase({
      assistants: { insert: (assistant) => saved.push(assistant) },
      workspaces: { findByIdForUser: (workspaceId, userId) => workspaceId === 'workspace-1' && userId === 'user-1' ? { id: workspaceId, userId } : null },
      idGenerator: () => 'assistant-1',
    });
    return { useCase, saved };
  }

  it('creates an active assistant in an authorized workspace', () => {
    const { useCase, saved } = setup();
    const assistant = useCase.execute('user-1', { workspaceId: 'workspace-1', name: 'Support', systemInstructions: 'Help users', model: 'gpt-4o-mini', temperature: 0.2 });
    expect(assistant).toMatchObject({ id: 'assistant-1', status: 'active', workspaceId: 'workspace-1' });
    expect(saved).toHaveLength(1);
  });

  it('rejects an unauthorized workspace and unsupported model', () => {
    const { useCase } = setup();
    expect(() => useCase.execute('user-2', { workspaceId: 'workspace-1', name: 'Support', systemInstructions: 'Help users', model: 'gpt-4o-mini', temperature: 0.2 })).toThrow(AssistantWorkspaceAccessDeniedError);
    expect(() => useCase.execute('user-1', { workspaceId: 'workspace-1', name: 'Support', systemInstructions: 'Help users', model: 'unknown', temperature: 0.2 })).toThrow(InvalidAssistantConfigurationError);
  });
});

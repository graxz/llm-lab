import { describe, expect, it } from 'vitest';
import { FeedbackService } from './index.js';

describe('FeedbackService', () => {
  it('creates one feedback and updates the same active record', () => {
    const records = new Map<string, any>();
    const service = new FeedbackService({ generations: { findById: () => ({ id: 'g1' } as any), insert: () => undefined, update: () => undefined }, feedback: { findByGenerationAndUser: () => [...records.values()][0] ?? null, insert: (feedback) => records.set(feedback.id, feedback), update: (feedback) => records.set(feedback.id, feedback) }, idGenerator: () => 'f1' });
    const first = service.save({ generationId: 'g1', userId: 'u1', value: 'positive' });
    const second = service.save({ generationId: 'g1', userId: 'u1', value: 'negative', comment: 'Needs work' });
    expect(second.id).toBe(first.id);
    expect(second.value).toBe('negative');
    expect(records).toHaveLength(1);
  });
});

import { describe, it, expect } from 'vitest';
import { challengeService } from '../src/services/challengeService.js';

describe('ChallengeService', () => {
  it('deve listar todos os desafios disponíveis com metadados da trilha', () => {
    const all = challengeService.getAllChallenges();
    expect(all.length).toBeGreaterThanOrEqual(10);

    const first = all[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('title');
    expect(first).toHaveProperty('starterCode');
    expect(first).toHaveProperty('testCases');
    expect(first).toHaveProperty('trackId');
    expect(first).toHaveProperty('trackName');
  });

  it('deve buscar desafio por ID específico', () => {
    const ch = challengeService.findChallengeById('ch-geo-init');
    expect(ch).toBeDefined();
    expect(ch?.title).toContain('Haversine');
    expect(ch?.level).toBe('iniciante');
    expect(ch?.starterCode).toContain('def calcular_haversine');
  });

  it('deve filtrar desafios por tecnologia e nível', () => {
    const ch = challengeService.getChallenge({
      technology: 'javascript',
      level: 'intermediario'
    });

    expect(ch).toBeDefined();
    expect(ch?.title).toContain('Rate Limiter');
    expect(ch?.level).toBe('intermediario');
    expect(ch?.starterCode).toContain('TokenBucketRateLimiter');
  });

  it('deve retornar undefined se nenhum desafio atender aos filtros', () => {
    const ch = challengeService.getChallenge({
      technology: 'fortran-77',
      level: 'avancado'
    });

    expect(ch).toBeUndefined();
  });

  it('todos os desafios devem ter casos de teste e instruções válidas', () => {
    const all = challengeService.getAllChallenges();
    for (const ch of all) {
      expect(ch.instructions.length).toBeGreaterThan(10);
      expect(ch.starterCode.length).toBeGreaterThan(10);
      expect(ch.testCases.length).toBeGreaterThan(0);
      expect(ch.testCases[0].expectedOutput).toBeDefined();
    }
  });
});

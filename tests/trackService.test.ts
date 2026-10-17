import { describe, it, expect } from 'vitest';
import { trackService } from '../src/services/trackService.js';

describe('TrackService', () => {
  it('deve retornar todas as trilhas cadastradas', () => {
    const tracks = trackService.getAllTracks();
    expect(tracks.length).toBeGreaterThanOrEqual(5);

    const ids = tracks.map((t) => t.id);
    expect(ids).toContain('python-ai');
    expect(ids).toContain('geo-spatial');
    expect(ids).toContain('javascript-fullstack');
    expect(ids).toContain('cloud-devops');
    expect(ids).toContain('csharp-dotnet');
  });

  it('deve encontrar uma trilha específica por ID', () => {
    const track = trackService.findTrackById('geo-spatial');
    expect(track).toBeDefined();
    expect(track?.name).toContain('Geospatial Data Science');
    expect(track?.technology).toContain('GIS');
    expect(track?.modules.length).toBeGreaterThanOrEqual(3);
  });

  it('deve retornar undefined para ID inexistente', () => {
    const track = trackService.findTrackById('trilha-inexistente-xyz');
    expect(track).toBeUndefined();
  });

  it('deve filtrar trilhas por tecnologia', () => {
    const results = trackService.filterTracks({ technology: 'python' });
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((t) => t.id === 'python-ai')).toBe(true);
  });

  it('deve filtrar trilhas por nível de dificuldade', () => {
    const results = trackService.filterTracks({ level: 'avancado' });
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.every((t) => t.level === 'avancado')).toBe(true);
  });

  it('deve listar tecnologias únicas disponíveis', () => {
    const techs = trackService.getAvailableTechnologies();
    expect(techs).toBeInstanceOf(Array);
    expect(techs.length).toBeGreaterThanOrEqual(4);
  });
});

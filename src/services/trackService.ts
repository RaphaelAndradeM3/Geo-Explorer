import { getTracks } from '../data/loader.js';
import { DifficultyLevel, Track } from '../types/index.js';

export interface TrackFilter {
  technology?: string;
  level?: DifficultyLevel | string;
  category?: string;
  query?: string;
}

export class TrackService {
  public getAllTracks(): Track[] {
    return getTracks();
  }

  public findTrackById(id: string): Track | undefined {
    const tracks = getTracks();
    const normalized = id.trim().toLowerCase();
    return tracks.find(
      (t) => t.id.toLowerCase() === normalized || t.name.toLowerCase() === normalized
    );
  }

  public filterTracks(filter: TrackFilter): Track[] {
    let results = getTracks();

    if (filter.technology) {
      const tech = filter.technology.toLowerCase();
      results = results.filter(
        (t) =>
          t.technology.toLowerCase().includes(tech) ||
          t.id.toLowerCase().includes(tech) ||
          t.name.toLowerCase().includes(tech)
      );
    }

    if (filter.level) {
      const level = filter.level.toLowerCase();
      results = results.filter((t) => t.level.toLowerCase() === level);
    }

    if (filter.category) {
      const category = filter.category.toLowerCase();
      results = results.filter((t) => t.category.toLowerCase().includes(category));
    }

    if (filter.query) {
      const q = filter.query.toLowerCase();
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.technology.toLowerCase().includes(q) ||
          t.modules.some((m) =>
            m.title.toLowerCase().includes(q) ||
            m.topics.some((topic) => topic.toLowerCase().includes(q))
          )
      );
    }

    return results;
  }

  public getAvailableTechnologies(): string[] {
    const tracks = getTracks();
    const techSet = new Set<string>();
    for (const t of tracks) {
      techSet.add(t.technology);
    }
    return Array.from(techSet);
  }
}

export const trackService = new TrackService();

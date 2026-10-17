import { getTracks } from '../data/loader.js';
import { CodeChallenge, DifficultyLevel, Track } from '../types/index.js';
import { trackService } from './trackService.js';

export interface ChallengeQuery {
  technology?: string;
  trackId?: string;
  level?: DifficultyLevel | string;
  id?: string;
}

export interface EnrichedChallenge extends CodeChallenge {
  trackId: string;
  trackName: string;
  technology: string;
}

export class ChallengeService {
  public getAllChallenges(): EnrichedChallenge[] {
    const tracks = getTracks();
    const result: EnrichedChallenge[] = [];

    for (const track of tracks) {
      for (const challenge of track.challenges) {
        result.push({
          ...challenge,
          trackId: track.id,
          trackName: track.name,
          technology: track.technology
        });
      }
    }

    return result;
  }

  public findChallengeById(id: string): EnrichedChallenge | undefined {
    const all = this.getAllChallenges();
    const normalized = id.trim().toLowerCase();
    return all.find((c) => c.id.toLowerCase() === normalized);
  }

  public queryChallenges(query: ChallengeQuery): EnrichedChallenge[] {
    let list = this.getAllChallenges();

    if (query.id) {
      return list.filter((c) => c.id.toLowerCase() === query.id?.toLowerCase());
    }

    if (query.trackId) {
      const track = trackService.findTrackById(query.trackId);
      if (track) {
        list = list.filter((c) => c.trackId === track.id);
      } else {
        return [];
      }
    }

    if (query.technology) {
      const tech = query.technology.toLowerCase();
      list = list.filter(
        (c) =>
          c.technology.toLowerCase().includes(tech) ||
          c.trackId.toLowerCase().includes(tech) ||
          c.trackName.toLowerCase().includes(tech)
      );
    }

    if (query.level) {
      const lvl = query.level.toLowerCase();
      list = list.filter((c) => c.level.toLowerCase() === lvl);
    }

    return list;
  }

  public getChallenge(query: ChallengeQuery): EnrichedChallenge | undefined {
    const matched = this.queryChallenges(query);
    if (matched.length === 0) {
      return undefined;
    }
    // Return the first match or pick one deterministically / first
    return matched[0];
  }
}

export const challengeService = new ChallengeService();

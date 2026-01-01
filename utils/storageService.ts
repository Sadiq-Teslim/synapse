import { ExerciseSession, FormQuality } from '@/types';

const STORAGE_KEY = 'synapse_ai_sessions';
const FIRST_LAUNCH_KEY = 'synapse_ai_first_launch';

export class StorageService {
  /**
   * Save exercise session to localStorage
   */
  static saveSession(session: ExerciseSession): void {
    try {
      const sessions = this.getSessions();
      sessions.push(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  /**
   * Get all exercise sessions from localStorage
   */
  static getSessions(): ExerciseSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return parsed.map((session: any) => ({
        ...session,
        timestamp: new Date(session.timestamp),
        overallForm: session.overallForm as FormQuality,
      }));
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }

  /**
   * Clear all sessions
   */
  static clearAllSessions(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing sessions:', error);
    }
  }

  /**
   * Check if this is first launch
   */
  static isFirstLaunch(): boolean {
    try {
      const value = localStorage.getItem(FIRST_LAUNCH_KEY);
      return value !== 'false';
    } catch (error) {
      return true;
    }
  }

  /**
   * Mark first launch as completed
   */
  static setFirstLaunchCompleted(): void {
    try {
      localStorage.setItem(FIRST_LAUNCH_KEY, 'false');
    } catch (error) {
      console.error('Error setting first launch:', error);
    }
  }
}


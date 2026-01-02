import { ExerciseSession, FormQuality, UserProfile, DailyCheckIn } from '@/types';

const STORAGE_KEY = 'synapse_ai_sessions';
const FIRST_LAUNCH_KEY = 'synapse_ai_first_launch';
const USER_PROFILE_KEY = 'synapse_ai_user_profile';
const CHECKINS_KEY = 'synapse_ai_checkins';

export class StorageService {
  // ==================== USER PROFILE ====================
  
  /**
   * Save user profile to localStorage
   */
  static saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  /**
   * Get user profile from localStorage
   */
  static getUserProfile(): UserProfile | null {
    try {
      const data = localStorage.getItem(USER_PROFILE_KEY);
      if (!data) return null;

      const parsed = JSON.parse(data);
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        lastUpdated: new Date(parsed.lastUpdated),
      };
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  /**
   * Check if user has completed onboarding
   */
  static hasCompletedOnboarding(): boolean {
    return this.getUserProfile() !== null;
  }

  /**
   * Update specific fields in user profile
   */
  static updateUserProfile(updates: Partial<UserProfile>): void {
    try {
      const profile = this.getUserProfile();
      if (profile) {
        const updated = {
          ...profile,
          ...updates,
          lastUpdated: new Date(),
        };
        this.saveUserProfile(updated);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }

  // ==================== DAILY CHECK-INS ====================

  /**
   * Save daily check-in
   */
  static saveCheckIn(checkIn: DailyCheckIn): void {
    try {
      const checkIns = this.getCheckIns();
      // Replace if same date exists
      const existingIndex = checkIns.findIndex(c => c.date === checkIn.date);
      if (existingIndex >= 0) {
        checkIns[existingIndex] = checkIn;
      } else {
        checkIns.push(checkIn);
      }
      localStorage.setItem(CHECKINS_KEY, JSON.stringify(checkIns));
    } catch (error) {
      console.error('Error saving check-in:', error);
    }
  }

  /**
   * Get all check-ins
   */
  static getCheckIns(): DailyCheckIn[] {
    try {
      const data = localStorage.getItem(CHECKINS_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return parsed.map((checkIn: any) => ({
        ...checkIn,
        timestamp: new Date(checkIn.timestamp),
      }));
    } catch (error) {
      console.error('Error loading check-ins:', error);
      return [];
    }
  }

  /**
   * Get today's check-in
   */
  static getTodayCheckIn(): DailyCheckIn | null {
    const today = new Date().toISOString().split('T')[0];
    const checkIns = this.getCheckIns();
    return checkIns.find(c => c.date === today) || null;
  }

  /**
   * Check if user has checked in today
   */
  static hasCheckedInToday(): boolean {
    return this.getTodayCheckIn() !== null;
  }

  // ==================== EXERCISE SESSIONS ====================

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
   * Get sessions from today
   */
  static getTodaySessions(): ExerciseSession[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getSessions().filter(s => 
      s.timestamp.toISOString().split('T')[0] === today
    );
  }

  /**
   * Get sessions from this week
   */
  static getThisWeekSessions(): ExerciseSession[] {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    return this.getSessions().filter(s => s.timestamp >= startOfWeek);
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

  // ==================== LEGACY SUPPORT ====================

  /**
   * Check if this is first launch (legacy - now checks for profile)
   */
  static isFirstLaunch(): boolean {
    return !this.hasCompletedOnboarding();
  }

  /**
   * Mark first launch as completed (legacy)
   */
  static setFirstLaunchCompleted(): void {
    try {
      localStorage.setItem(FIRST_LAUNCH_KEY, 'false');
    } catch (error) {
      console.error('Error setting first launch:', error);
    }
  }

  // ==================== RESET ====================

  /**
   * Clear all user data
   */
  static clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(FIRST_LAUNCH_KEY);
      localStorage.removeItem(USER_PROFILE_KEY);
      localStorage.removeItem(CHECKINS_KEY);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
}


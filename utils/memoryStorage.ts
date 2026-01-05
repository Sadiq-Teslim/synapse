import { Memory } from '@/types/memory';

const MEMORIES_KEY = 'synapse_ai_memories';

export class MemoryStorage {
  /**
   * Save a memory to localStorage
   */
  static saveMemory(memory: Memory): void {
    try {
      const memories = this.getMemories();
      const existingIndex = memories.findIndex(m => m.id === memory.id);
      
      if (existingIndex >= 0) {
        memories[existingIndex] = memory;
      } else {
        memories.push(memory);
      }
      
      localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
    } catch (error) {
      console.error('Error saving memory:', error);
    }
  }

  /**
   * Get all memories
   */
  static getMemories(): Memory[] {
    try {
      const data = localStorage.getItem(MEMORIES_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return parsed.map((memory: any) => ({
        ...memory,
        createdAt: new Date(memory.createdAt),
        lastUsed: memory.lastUsed ? new Date(memory.lastUsed) : undefined,
      }));
    } catch (error) {
      console.error('Error loading memories:', error);
      return [];
    }
  }

  /**
   * Get a specific memory by ID
   */
  static getMemory(id: string): Memory | null {
    const memories = this.getMemories();
    return memories.find(m => m.id === id) || null;
  }

  /**
   * Delete a memory
   */
  static deleteMemory(id: string): void {
    try {
      const memories = this.getMemories().filter(m => m.id !== id);
      localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  }

  /**
   * Update last used timestamp
   */
  static updateLastUsed(id: string): void {
    try {
      const memory = this.getMemory(id);
      if (memory) {
        memory.lastUsed = new Date();
        this.saveMemory(memory);
      }
    } catch (error) {
      console.error('Error updating last used:', error);
    }
  }
}


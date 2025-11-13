// Reference: blueprint:javascript_database integration
import { participants, adminSettings, type Participant, type InsertParticipant, type AdminSettings } from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  // Participant methods
  createParticipant(participant: InsertParticipant): Promise<Participant>;
  getParticipantByPin(pin: string): Promise<Participant | undefined>;
  getAllParticipants(): Promise<Participant[]>;
  getPendingParticipants(): Promise<Participant[]>;
  getApprovedParticipants(): Promise<Participant[]>;
  approveParticipant(pin: string): Promise<void>;
  rejectParticipant(pin: string): Promise<void>;
  getAvailableForDraw(currentPin: string): Promise<Participant[]>;
  assignMatch(fromPin: string, toPin: string): Promise<void>;
  updateParticipant(pin: string, updates: Partial<InsertParticipant>): Promise<void>;
  
  // Admin methods
  getAdminSettings(): Promise<AdminSettings>;
  toggleDrawEnabled(): Promise<boolean>;
  verifyAdminPin(pin: string): Promise<boolean>;
  resetAllDraws(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Participant methods
  async createParticipant(insertParticipant: InsertParticipant): Promise<Participant> {
    // Generate unique PIN in MM-#### format
    let pin = '';
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
      pin = `MM-${Math.floor(1000 + Math.random() * 9000)}`;
      const existing = await this.getParticipantByPin(pin);
      if (!existing) break;
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      throw new Error("Unable to generate unique PIN");
    }
    
    const [participant] = await db
      .insert(participants)
      .values({ ...insertParticipant, pin })
      .returning();
    return participant;
  }

  async getParticipantByPin(pin: string): Promise<Participant | undefined> {
    const [participant] = await db
      .select()
      .from(participants)
      .where(eq(participants.pin, pin));
    return participant || undefined;
  }

  async getAllParticipants(): Promise<Participant[]> {
    return await db.select().from(participants);
  }

  async getPendingParticipants(): Promise<Participant[]> {
    return await db
      .select()
      .from(participants)
      .where(eq(participants.approved, false));
  }

  async getApprovedParticipants(): Promise<Participant[]> {
    return await db
      .select()
      .from(participants)
      .where(eq(participants.approved, true));
  }

  async approveParticipant(pin: string): Promise<void> {
    await db
      .update(participants)
      .set({ approved: true })
      .where(eq(participants.pin, pin));
  }

  async rejectParticipant(pin: string): Promise<void> {
    await db
      .delete(participants)
      .where(eq(participants.pin, pin));
  }

  async getAvailableForDraw(currentPin: string): Promise<Participant[]> {
    // Get all approved participants who haven't been assigned yet and aren't the current user
    return await db
      .select()
      .from(participants)
      .where(
        and(
          eq(participants.approved, true),
          sql`${participants.pin} != ${currentPin}`,
          sql`${participants.pin} NOT IN (SELECT assigned_to_pin FROM participants WHERE assigned_to_pin IS NOT NULL)`
        )
      );
  }

  async assignMatch(fromPin: string, toPin: string): Promise<void> {
    await db
      .update(participants)
      .set({ 
        assignedToPin: toPin,
        hasDrawn: true 
      })
      .where(eq(participants.pin, fromPin));
  }

  async updateParticipant(pin: string, updates: Partial<InsertParticipant>): Promise<void> {
    await db
      .update(participants)
      .set(updates)
      .where(eq(participants.pin, pin));
  }

  // Admin methods
  async getAdminSettings(): Promise<AdminSettings> {
    // Ensure singleton admin settings exists
    const [settings] = await db.select().from(adminSettings);
    
    if (!settings) {
      const [newSettings] = await db
        .insert(adminSettings)
        .values({ id: 'singleton', drawEnabled: false, adminPin: 'ADMIN-2025' })
        .returning();
      return newSettings;
    }
    
    return settings;
  }

  async toggleDrawEnabled(): Promise<boolean> {
    const current = await this.getAdminSettings();
    const newValue = !current.drawEnabled;
    
    await db
      .update(adminSettings)
      .set({ drawEnabled: newValue })
      .where(eq(adminSettings.id, 'singleton'));
    
    return newValue;
  }

  async verifyAdminPin(pin: string): Promise<boolean> {
    const settings = await this.getAdminSettings();
    return settings.adminPin === pin;
  }

  async resetAllDraws(): Promise<void> {
    await db
      .update(participants)
      .set({ 
        hasDrawn: false,
        assignedToPin: null
      });
  }
}

export const storage = new DatabaseStorage();

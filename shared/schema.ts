import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Participants table
export const participants = pgTable("participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pin: varchar("pin", { length: 10 }).notNull().unique(),
  fullName: text("full_name").notNull(),
  codename: text("codename").notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  wishlist: text("wishlist").notNull(),
  approved: boolean("approved").notNull().default(false),
  hasDrawn: boolean("has_drawn").notNull().default(false),
  assignedToPin: varchar("assigned_to_pin", { length: 10 }),
});

// Admin settings table
export const adminSettings = pgTable("admin_settings", {
  id: varchar("id").primaryKey().default('singleton'),
  drawEnabled: boolean("draw_enabled").notNull().default(false),
  adminPin: varchar("admin_pin", { length: 20 }).notNull().default('ADMIN-2025'),
});

// Zod schemas for validation
export const insertParticipantSchema = createInsertSchema(participants).omit({
  id: true,
  approved: true,
  hasDrawn: true,
  assignedToPin: true,
  pin: true,
}).extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  codename: z.string().min(2, "Codename must be at least 2 characters"),
  gender: z.enum(["Male", "Female", "Other"]),
  wishlist: z.string().min(5, "Please add at least one wish item"),
});

export const loginSchema = z.object({
  pin: z.string().min(1, "Please enter your PIN"),
});

export const adminLoginSchema = z.object({
  adminPin: z.string().min(1, "Please enter admin PIN"),
});

// TypeScript types
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
export type Participant = typeof participants.$inferSelect;
export type AdminSettings = typeof adminSettings.$inferSelect;

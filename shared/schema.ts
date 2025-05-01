import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export enum UserTheme {
  DEFAULT = "default",
  BLUE = "blue",
  GREEN = "green",
  PURPLE = "purple",
  ORANGE = "orange",
}

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "user"] }).notNull().default("user"),
  authorized: boolean("authorized").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expirationDate: timestamp("expiration_date"),
  profilePicture: text("profile_picture"),
  preferredLanguage: text("preferred_language").default("pt"),
  theme: text("theme", { enum: ["default", "blue", "green", "purple", "orange"] }).default("default"),
  accentColor: text("accent_color").default("#3498db"),
  twoFactorCode: text("two_factor_code"),
  twoFactorCodeExpires: timestamp("two_factor_code_expires"),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
});

export const insertUserSchema = createInsertSchema(users)
  .omit({
    id: true,
    createdAt: true,
    twoFactorCode: true,
    twoFactorCodeExpires: true,
    resetPasswordToken: true,
    resetPasswordExpires: true,
  });

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export const changePasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
});

export const verifyTwoFactorSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type VerifyTwoFactor = z.infer<typeof verifyTwoFactorSchema>;
export type User = typeof users.$inferSelect;

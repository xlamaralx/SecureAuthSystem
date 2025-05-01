import {
  users,
  type User,
  type InsertUser,
  type LoginUser,
  type ResetPassword,
  type ChangePassword,
  type VerifyTwoFactor,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);
const scryptAsync = promisify(scrypt);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<void>;
  getAllUsers(): Promise<User[]>;
  generateTwoFactorCode(email: string): Promise<string>;
  verifyTwoFactorCode(email: string, code: string): Promise<boolean>;
  generateResetToken(email: string): Promise<string | null>;
  verifyResetToken(token: string): Promise<User | undefined>;
  changePassword(userId: number, newPassword: string): Promise<void>;
  comparePasswords(supplied: string, stored: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await this.hashPassword(insertUser.password);
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
        expirationDate,
      })
      .returning();
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    try {
      // Clone data to avoid modifying the original
      const updateData = { ...data };
      
      // Hash password if provided
      if (updateData.password) {
        updateData.password = await this.hashPassword(updateData.password);
      }

      // Processar a data de expiração - converter string para Date se necessário
      if (updateData.expirationDate && typeof updateData.expirationDate === 'string') {
        updateData.expirationDate = new Date(updateData.expirationDate);
      }
      
      console.log("Atualizando usuário com dados:", JSON.stringify(updateData, null, 2));

      const [updatedUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, id))
        .returning();
      
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async generateTwoFactorCode(email: string): Promise<string> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15); // Code expires in 15 minutes

    await db
      .update(users)
      .set({
        twoFactorCode: code,
        twoFactorCodeExpires: expires,
      })
      .where(eq(users.id, user.id));

    return code;
  }

  async verifyTwoFactorCode(email: string, code: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.twoFactorCode || !user.twoFactorCodeExpires) {
      return false;
    }

    if (new Date() > user.twoFactorCodeExpires) {
      return false; // Code expired
    }

    if (user.twoFactorCode !== code) {
      return false; // Invalid code
    }

    // Clear the code after successful verification
    await db
      .update(users)
      .set({
        twoFactorCode: null,
        twoFactorCodeExpires: null,
      })
      .where(eq(users.id, user.id));

    return true;
  }

  async generateResetToken(email: string): Promise<string | null> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const token = randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour

    await db
      .update(users)
      .set({
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      })
      .where(eq(users.id, user.id));

    return token;
  }

  async verifyResetToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.resetPasswordToken, token));

    if (!user || !user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
      return undefined;
    }

    return user;
  }

  async changePassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await this.hashPassword(newPassword);

    await db
      .update(users)
      .set({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      })
      .where(eq(users.id, userId));
  }

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  async comparePasswords(supplied: string, stored: string): Promise<boolean> {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  }
}

export const storage = new DatabaseStorage();

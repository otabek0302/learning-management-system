import mongoose from "mongoose";
import { env } from "./env";
import { DatabaseError } from "../shared/errors/database.error";

export class Database {
  private static instance: Database;
  private connection: mongoose.Connection | null = null;

  private constructor() {
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /** Connect to MongoDB */
  public async connect(): Promise<void> {
    const mongoUrl = env.DB_URL;

    if (!mongoUrl) {
      throw new DatabaseError("MongoDB URL is missing");
    }

    try {
      await mongoose.connect(mongoUrl, {
        user: env.DB_USER || undefined,
        pass: env.DB_PASS || undefined,
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 20,
      });

      this.connection = mongoose.connection;

      this.setupConnectionEvents();

      console.log(`[DB] Connected → MongoDB @ ${mongoUrl}`);
    } catch (error: any) {
      console.error("[DB] MongoDB connection error:", error);
      throw new DatabaseError("Failed to connect to MongoDB", { error });
    }
  }

  /** Disconnect from MongoDB */
  public async disconnect(): Promise<void> {
    if (!this.connection) return;
    await this.connection.close();
    console.log("[DB] MongoDB disconnected");
  }

  /** MongoDB event listeners */
  private setupConnectionEvents() {
    if (!this.connection) return;

    this.connection.on("connected", () => {
      console.log("[DB] Mongoose connected");
    });

    this.connection.on("error", (err) => {
      console.error("[DB] Mongoose error:", err);
    });

    this.connection.on("disconnected", () => {
      console.warn("[DB] Mongoose disconnected");
    });
  }

  /** Get raw mongoose connection */
  public getConnection(): mongoose.Connection | null {
    return this.connection;
  }
}

// Singleton instance
export const database = Database.getInstance();
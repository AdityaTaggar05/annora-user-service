import {
    pgTable,
    text,
    integer,
    boolean,
    timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users",{
    id: text("id").primaryKey(),
    username: text("username").notNull().unique(),
    name: text("name").notNull(),
    age: integer("age").notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})
import { relations } from "drizzle-orm";
import {
  index,
  text,
  pgTable,
  serial,
  uuid,
  varchar,
  unique,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    username: varchar("username", { length: 100 }).notNull().unique(),
    provider: varchar("provider", {
      length: 100,
      enum: ["github", "credentials"],
    })
      .notNull()
      .default("credentials"),
  },
  (table) => ({
    displayIdIndex: index("display_id_index").on(table.displayId),
  }),
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  usersToChatroomsTable: many(usersToChatroomsTable),
}));

export const chatroomsTable = pgTable(
  "chatrooms",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
  },
  (table) => ({
    displayIdIndex: index("display_id_index").on(table.displayId),
  }),
);

export const chatroomsRelations = relations(chatroomsTable, ({ many }) => ({
  usersToChatroomsTable: many(usersToChatroomsTable),
}));

export const usersToChatroomsTable = pgTable(
  "users_to_chatrooms",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    chatroomId: uuid("chatroom_id")
      .notNull()
      .references(() => chatroomsTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    userAndChatroomIndex: index("user_and_chatroom_index").on(
      table.userId,
      table.chatroomId,
    ),
    // This is a unique constraint on the combination of userId and documentId.
    // This ensures that there is no duplicate entry in the table.
    uniqCombination: unique().on(table.chatroomId, table.userId),
  }),
);

export const usersToChatroomsRelations = relations(
  usersToChatroomsTable,
  ({ one }) => ({
    chatroom: one(chatroomsTable, {
      fields: [usersToChatroomsTable.chatroomId],
      references: [chatroomsTable.displayId],
    }),
    user: one(usersTable, {
      fields: [usersToChatroomsTable.userId],
      references: [usersTable.displayId],
    }),
  }),
);
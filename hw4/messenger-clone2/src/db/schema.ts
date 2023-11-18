import {
  index,
  integer,
  pgTable,
  serial,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

// schemas define the structure of the tables in the database
// watch this playlist to learn more about database schemas:
// although it uses MySQL, the concepts are the same
// https://planetscale.com/learn/courses/mysql-for-developers/schema/introduction-to-schema

export const usersTable = pgTable(
  "users",
  {
    // It is recommended to use something that means nothing outside of the database
    // as the primary key, so that you don't have to change it if the data it represents
    // changes. For example, if you use a user's email as the primary key, and then
    // the user changes their email, you have to update all the foreign keys that
    // reference that email. If you use a serial primary key, you don't have to worry
    // about that.
    id: serial("id").primaryKey(),
    // It is a good idea to set a maximum length for varchars, so that you don't
    // waste space in the database. It is also a good idea to move as much constraints
    // to the database as possible, so that you don't have to worry about them in
    // your application code.
    userName: varchar("display_name", { length: 50 }).notNull().unique(),
  },
  (table) => ({
    // indexes are used to speed up queries. Good indexes can make your queries
    // run orders of magnitude faster. learn more about indexes here:
    // https://planetscale.com/learn/courses/mysql-for-developers/indexes/introduction-to-indexes
    handleIndex: index("handle_index").on(table.userName),
  }),
);

export const activitiesTable = pgTable(
  "activities",
  {
    id: serial("id").primaryKey(),
    content: varchar("content", { length: 280 }).notNull(),
    userHandle: varchar("user_handle", { length: 50 }).notNull()
      // this is a foreign key constraint. It ensures that the user_handle
      // column in this table references a valid user_handle in the users table.
      // We can also specify what happens when the referenced row is deleted
      // or updated. In this case, we want to delete the tweet if the user
      // is deleted, so we use onDelete: "cascade". It is similar for onUpdate.
      .references(() => usersTable.userName, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    startTime: varchar("start_time", { length: 20 }).notNull(),
    endTime: varchar("end_time", { length: 20 }).notNull(),
  },
  (table) => ({
    userHandleIndex: index("user_handle_index").on(table.userHandle),
    // we can even set composite indexes, which are indexes on multiple columns
    // learn more about composite indexes here:
    // https://planetscale.com/learn/courses/mysql-for-developers/indexes/composite-indexes
  }),
);

export const chatsTable = pgTable(
  "chats",
  {
    id: serial("id").primaryKey(),
    userHandle: varchar("user_handle", { length: 50 }).notNull()
      .references(() => usersTable.userName, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  }
)

export const messagesTable = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    content: varchar("content", { length: 280 }).notNull(),
    userHandle: varchar("user_handle", { length: 50 }).notNull()
      // this is a foreign key constraint. It ensures that the user_handle
      // column in this table references a valid user_handle in the users table.
      // We can also specify what happens when the referenced row is deleted
      // or updated. In this case, we want to delete the tweet if the user
      // is deleted, so we use onDelete: "cascade". It is similar for onUpdate.
      .references(() => usersTable.userName, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    replyToChatId: integer("reply_to_chat_id")
      .notNull()
      .references(() => chatsTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userHandleIndex: index("user_handle_index").on(table.userHandle),
    // we can even set composite indexes, which are indexes on multiple columns
    // learn more about composite indexes here:
    // https://planetscale.com/learn/courses/mysql-for-developers/indexes/composite-indexes
    replyToChatIndex: index("reply_to_time_index").on(table.replyToChatId),
  }),
);

export const commentsTable = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    content: varchar("content", { length: 280 }).notNull(),
    userHandle: varchar("user_handle", { length: 50 }).notNull()
      // this is a foreign key constraint. It ensures that the user_handle
      // column in this table references a valid user_handle in the users table.
      // We can also specify what happens when the referenced row is deleted
      // or updated. In this case, we want to delete the tweet if the user
      // is deleted, so we use onDelete: "cascade". It is similar for onUpdate.
      .references(() => usersTable.userName, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    replyToActivityId: integer("reply_to_activity_id")
      .notNull()
      .references(() => activitiesTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userHandleIndex: index("user_handle_index").on(table.userHandle),
    // we can even set composite indexes, which are indexes on multiple columns
    // learn more about composite indexes here:
    // https://planetscale.com/learn/courses/mysql-for-developers/indexes/composite-indexes
    replyToActivityIndex: index("reply_to_time_index").on(table.replyToActivityId),
  }),
);

export const joinsTable = pgTable(
  "joins",
  {
    id: serial("id").primaryKey(),
    userHandle: varchar("user_handle", { length: 50 })
      .notNull()
      .references(() => usersTable.userName, { onDelete: "cascade" }),
    activityId: integer("activity_id")
      .notNull()
      .references(() => activitiesTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    activityIdIndex: index("activity_id_index").on(table.activityId),
    userHandleIndex: index("user_handle_index").on(table.userHandle),
    // unique constraints ensure that there are no duplicate combinations of
    // values in the table. In this case, we want to ensure that a user can't
    // like the same tweet twice.
    uniqCombination: unique().on(table.userHandle, table.activityId),
  }),
);

export const chatJoinsTable = pgTable(
  "chatjoins",
  {
    id: serial("id").primaryKey(),
    userHandle: varchar("user_handle", { length: 50 })
      .notNull()
      .references(() => usersTable.userName, { onDelete: "cascade" }),
    chatId: integer("chat_id")
      .notNull()
      .references(() => chatsTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    chatIdIndex: index("activity_id_index").on(table.chatId),
    userHandleIndex: index("user_handle_index").on(table.userHandle),
    // unique constraints ensure that there are no duplicate combinations of
    // values in the table. In this case, we want to ensure that a user can't
    // like the same tweet twice.
    uniqCombination: unique().on(table.userHandle, table.chatId),
  }),
);
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull().unique(),
  },
  (table) => ({
    nameIndex: index("name_index").on(table.name),
  }),
);

export const activitiesTable = pgTable(
  "activities",{
    id: serial("id").primaryKey(),
    name: varchar("name",{length:100}).notNull().unique(),
    date: varchar("date").notNull(),
  },
  (table) => ({
    nameIndex: index("name_index").on(table.name),
    dateIndex: index("date_index").on(table.date),
  }),
);

export const joinTable = pgTable(
  "join",
  {
    id: serial("id").primaryKey(),
    userName: varchar("user_name", { length: 50 })
      .notNull()
      .references(() => usersTable.name, { onDelete: "cascade" }),
    activityId: integer("activity_id")
      .notNull()
      .references(() => activitiesTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    activityIdIndex: index("activity_id_index").on(table.activityId),
    userHandleIndex: index("user_name_index").on(table.userName),
    // unique constraints ensure that there are no duplicate combinations of
    // values in the table. In this case, we want to ensure that a user can't
    // like the same tweet twice.
    uniqCombination: unique().on(table.userName, table.activityId),
  }),
);

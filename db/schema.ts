import {sqliteTable,text,integer} from "drizzle-orm/sqlite-core";
export const expeditions=sqliteTable("expeditions",{playerId:text("player_id").primaryKey(),revision:integer("revision").notNull().default(0),document:text("document").notNull()});

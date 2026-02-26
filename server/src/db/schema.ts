import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const urls = pgTable('Url', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  originalUrl: text('originalUrl').notNull(),
  shortUrl: text('shortUrl').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  userCounter: integer('userCounter').notNull().default(0),
  isDeleted: boolean('isDeleted').notNull().default(false),
})

export type Url = typeof urls.$inferSelect
export type NewUrl = typeof urls.$inferInsert

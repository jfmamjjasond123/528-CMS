import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "fl_exams_slug_idx";
  ALTER TABLE "payload_cms"."fl_exams" DROP COLUMN IF EXISTS "slug";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."fl_exams" ADD COLUMN "slug" varchar NOT NULL;
  CREATE UNIQUE INDEX IF NOT EXISTS "fl_exams_slug_idx" ON "payload_cms"."fl_exams" USING btree ("slug");`)
}

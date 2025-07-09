import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."subjects" ADD COLUMN "subject_category_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."subjects" ADD CONSTRAINT "subjects_subject_category_id_subject_categories_id_fk" FOREIGN KEY ("subject_category_id") REFERENCES "payload_cms"."subject_categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "subjects_subject_category_idx" ON "payload_cms"."subjects" USING btree ("subject_category_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."subjects" DROP CONSTRAINT "subjects_subject_category_id_subject_categories_id_fk";
  
  DROP INDEX IF EXISTS "subjects_subject_category_idx";
  ALTER TABLE "payload_cms"."subjects" DROP COLUMN IF EXISTS "subject_category_id";`)
}

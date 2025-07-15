import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."fl_exams_rels" RENAME COLUMN "passages_id" TO "fl_passages_id";
  ALTER TABLE "payload_cms"."fl_exams_rels" DROP CONSTRAINT "fl_exams_rels_passages_fk";
  
  DROP INDEX IF EXISTS "fl_exams_rels_passages_id_idx";
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."fl_exams_rels" ADD CONSTRAINT "fl_exams_rels_fl_passages_fk" FOREIGN KEY ("fl_passages_id") REFERENCES "payload_cms"."fl_passages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "fl_exams_rels_fl_passages_id_idx" ON "payload_cms"."fl_exams_rels" USING btree ("fl_passages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."fl_exams_rels" RENAME COLUMN "fl_passages_id" TO "passages_id";
  ALTER TABLE "payload_cms"."fl_exams_rels" DROP CONSTRAINT "fl_exams_rels_fl_passages_fk";
  
  DROP INDEX IF EXISTS "fl_exams_rels_fl_passages_id_idx";
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."fl_exams_rels" ADD CONSTRAINT "fl_exams_rels_passages_fk" FOREIGN KEY ("passages_id") REFERENCES "payload_cms"."passages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "fl_exams_rels_passages_id_idx" ON "payload_cms"."fl_exams_rels" USING btree ("passages_id");`)
}

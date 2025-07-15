import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_cms"."fl_passages" DROP CONSTRAINT "fl_passages_exam_id_fl_exams_id_fk";
    EXCEPTION
      WHEN undefined_object THEN NULL;
    END $$;

    DROP INDEX IF EXISTS "fl_passages_exam_idx";

    ALTER TABLE "payload_cms"."fl_passages" DROP COLUMN IF EXISTS "exam_id";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."fl_passages" ADD COLUMN "exam_id" uuid NOT NULL;
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."fl_passages" ADD CONSTRAINT "fl_passages_exam_id_fl_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "payload_cms"."fl_exams"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "fl_passages_exam_idx" ON "payload_cms"."fl_passages" USING btree ("exam_id");`)
}

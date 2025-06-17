import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."passage_questions" DROP CONSTRAINT "passage_questions_exam_id_exams_id_fk";
  
  DROP INDEX IF EXISTS "passage_questions_exam_idx";
  ALTER TABLE "payload_cms"."passage_questions" DROP COLUMN IF EXISTS "exam_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."passage_questions" ADD COLUMN "exam_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passage_questions" ADD CONSTRAINT "passage_questions_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "payload_cms"."exams"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "passage_questions_exam_idx" ON "payload_cms"."passage_questions" USING btree ("exam_id");`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload_cms"."enum_exams_type" AS ENUM('Full-Length Exam', 'Q-bank', 'Timed-Q-bank');
  ALTER TABLE "payload_cms"."passage_questions" DROP CONSTRAINT "passage_questions_image_id_media_id_fk";
  
  DROP INDEX IF EXISTS "passage_questions_image_idx";
  ALTER TABLE "payload_cms"."exams" ADD COLUMN "type" "payload_cms"."enum_exams_type" DEFAULT 'Q-bank' NOT NULL;
  ALTER TABLE "payload_cms"."passage_questions" DROP COLUMN IF EXISTS "image_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."passage_questions" ADD COLUMN "image_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passage_questions" ADD CONSTRAINT "passage_questions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "passage_questions_image_idx" ON "payload_cms"."passage_questions" USING btree ("image_id");
  ALTER TABLE "payload_cms"."exams" DROP COLUMN IF EXISTS "type";
  DROP TYPE "payload_cms"."enum_exams_type";`)
}

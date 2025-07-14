import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."passage_questions" ALTER COLUMN "skill_id" SET NOT NULL;
  ALTER TABLE "payload_cms"."passage_questions" ALTER COLUMN "question_type_id" SET NOT NULL;
  ALTER TABLE "payload_cms"."passage_questions" ALTER COLUMN "question_title" SET NOT NULL;
  ALTER TABLE "payload_cms"."fl_passage_questions" ALTER COLUMN "skill_id" SET NOT NULL;
  ALTER TABLE "payload_cms"."fl_passage_questions" ALTER COLUMN "question_type_id" SET NOT NULL;
  ALTER TABLE "payload_cms"."fl_passage_questions" ALTER COLUMN "question_title" SET NOT NULL;
  ALTER TABLE "payload_cms"."fl_passage_questions" DROP COLUMN IF EXISTS "text";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."passage_questions" ALTER COLUMN "skill_id" DROP NOT NULL;
  ALTER TABLE "payload_cms"."passage_questions" ALTER COLUMN "question_type_id" DROP NOT NULL;
  ALTER TABLE "payload_cms"."passage_questions" ALTER COLUMN "question_title" DROP NOT NULL;
  ALTER TABLE "payload_cms"."fl_passage_questions" ALTER COLUMN "skill_id" DROP NOT NULL;
  ALTER TABLE "payload_cms"."fl_passage_questions" ALTER COLUMN "question_type_id" DROP NOT NULL;
  ALTER TABLE "payload_cms"."fl_passage_questions" ALTER COLUMN "question_title" DROP NOT NULL;
  ALTER TABLE "payload_cms"."fl_passage_questions" ADD COLUMN "text" jsonb NOT NULL;`)
}

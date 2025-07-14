import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."passage_questions_options" DROP COLUMN IF EXISTS "option_explanation";
  ALTER TABLE "payload_cms"."passage_questions_options" ADD COLUMN "option_explanation" jsonb;
  ALTER TABLE "payload_cms"."fl_passage_questions_options" DROP COLUMN IF EXISTS "option_explanation";
  ALTER TABLE "payload_cms"."fl_passage_questions_options" ADD COLUMN "option_explanation" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."passage_questions_options" ALTER COLUMN "option_explanation" SET DATA TYPE varchar;
  ALTER TABLE "payload_cms"."fl_passage_questions_options" ALTER COLUMN "option_explanation" SET DATA TYPE varchar;`)
}

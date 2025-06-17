import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."passage_questions" ADD COLUMN "question_title" varchar;
  ALTER TABLE "payload_cms"."passage_questions" DROP COLUMN IF EXISTS "question_number";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."passage_questions" ADD COLUMN "question_number" numeric;
  ALTER TABLE "payload_cms"."passage_questions" DROP COLUMN IF EXISTS "question_title";`)
}

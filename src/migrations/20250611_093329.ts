import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_cms"."passage_questions"
    ADD COLUMN IF NOT EXISTS "question_explanation" jsonb;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_cms"."passage_questions"
    DROP COLUMN IF EXISTS "question_explanation";
  `)
}

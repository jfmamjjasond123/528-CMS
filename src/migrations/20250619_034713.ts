import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."subjects" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "payload_cms"."subject_categories" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "payload_cms"."question_skills" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "payload_cms"."question_types" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "payload_cms"."distractor_types" DROP COLUMN IF EXISTS "description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."subjects" ADD COLUMN "description" varchar;
  ALTER TABLE "payload_cms"."subject_categories" ADD COLUMN "description" varchar;
  ALTER TABLE "payload_cms"."question_skills" ADD COLUMN "description" varchar;
  ALTER TABLE "payload_cms"."question_types" ADD COLUMN "description" varchar;
  ALTER TABLE "payload_cms"."distractor_types" ADD COLUMN "description" varchar;`)
}

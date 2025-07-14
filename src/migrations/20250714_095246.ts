import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."passages" ALTER COLUMN "subject_id" SET NOT NULL;
  ALTER TABLE "payload_cms"."fl_passages" ALTER COLUMN "subject_id" SET NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."passages" ALTER COLUMN "subject_id" DROP NOT NULL;
  ALTER TABLE "payload_cms"."fl_passages" ALTER COLUMN "subject_id" DROP NOT NULL;`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."passage_questions_options" DROP CONSTRAINT "passage_questions_options_image_id_media_id_fk";
  
  DROP INDEX IF EXISTS "passage_questions_options_image_idx";
  ALTER TABLE "payload_cms"."passage_questions_options" DROP COLUMN IF EXISTS "image_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."passage_questions_options" ADD COLUMN "image_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passage_questions_options" ADD CONSTRAINT "passage_questions_options_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "passage_questions_options_image_idx" ON "payload_cms"."passage_questions_options" USING btree ("image_id");`)
}

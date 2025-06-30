import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'payload_cms'
        AND table_name = 'passage_questions_options'
        AND column_name = 'option_explanation'
      ) THEN
        ALTER TABLE "payload_cms"."passage_questions_options"
        ADD COLUMN "option_explanation" varchar;
      END IF;
    END
    $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_cms"."passage_questions_options"
    DROP COLUMN IF EXISTS "option_explanation";
  `)
}

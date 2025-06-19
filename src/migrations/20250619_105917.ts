import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."lessons_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."questions_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."questions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload_cms"."lessons_rels" CASCADE;
  DROP TABLE "payload_cms"."questions_options" CASCADE;
  DROP TABLE "payload_cms"."questions" CASCADE;
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_questions_id_idx";
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "questions_id";
  DROP TYPE "payload_cms"."enum_questions_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload_cms"."enum_questions_type" AS ENUM('quiz', 'exercise');
  CREATE TABLE IF NOT EXISTS "payload_cms"."lessons_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"questions_id" uuid
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."questions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"option" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."questions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"question_text" varchar NOT NULL,
  	"type" "payload_cms"."enum_questions_type" NOT NULL,
  	"correct_answer" varchar NOT NULL,
  	"lessons_id" uuid NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD COLUMN "questions_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."lessons_rels" ADD CONSTRAINT "lessons_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_cms"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."lessons_rels" ADD CONSTRAINT "lessons_rels_questions_fk" FOREIGN KEY ("questions_id") REFERENCES "payload_cms"."questions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."questions_options" ADD CONSTRAINT "questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload_cms"."questions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."questions" ADD CONSTRAINT "questions_lessons_id_lessons_id_fk" FOREIGN KEY ("lessons_id") REFERENCES "payload_cms"."lessons"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "lessons_rels_order_idx" ON "payload_cms"."lessons_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "lessons_rels_parent_idx" ON "payload_cms"."lessons_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "lessons_rels_path_idx" ON "payload_cms"."lessons_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "lessons_rels_questions_id_idx" ON "payload_cms"."lessons_rels" USING btree ("questions_id");
  CREATE INDEX IF NOT EXISTS "questions_options_order_idx" ON "payload_cms"."questions_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "questions_options_parent_id_idx" ON "payload_cms"."questions_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "questions_lessons_idx" ON "payload_cms"."questions" USING btree ("lessons_id");
  CREATE INDEX IF NOT EXISTS "questions_updated_at_idx" ON "payload_cms"."questions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "questions_created_at_idx" ON "payload_cms"."questions" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_questions_fk" FOREIGN KEY ("questions_id") REFERENCES "payload_cms"."questions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_questions_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("questions_id");`)
}

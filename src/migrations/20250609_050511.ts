import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "payload_cms"."passages" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"exam_id" uuid NOT NULL,
  	"content" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."passages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"passage_questions_id" uuid
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."passage_questions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"image_id" uuid,
  	"is_correct" boolean DEFAULT false NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."passage_questions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"passage_id" uuid,
  	"exam_id" uuid,
  	"question_number" numeric,
  	"text" jsonb NOT NULL,
  	"image_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."exams" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"total_time_in_minutes" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."exams_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"passages_id" uuid
  );
  
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD COLUMN "passages_id" uuid;
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD COLUMN "passage_questions_id" uuid;
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD COLUMN "exams_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passages" ADD CONSTRAINT "passages_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "payload_cms"."exams"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passages_rels" ADD CONSTRAINT "passages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_cms"."passages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passages_rels" ADD CONSTRAINT "passages_rels_passage_questions_fk" FOREIGN KEY ("passage_questions_id") REFERENCES "payload_cms"."passage_questions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passage_questions_options" ADD CONSTRAINT "passage_questions_options_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passage_questions_options" ADD CONSTRAINT "passage_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload_cms"."passage_questions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passage_questions" ADD CONSTRAINT "passage_questions_passage_id_passages_id_fk" FOREIGN KEY ("passage_id") REFERENCES "payload_cms"."passages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passage_questions" ADD CONSTRAINT "passage_questions_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "payload_cms"."exams"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passage_questions" ADD CONSTRAINT "passage_questions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."exams_rels" ADD CONSTRAINT "exams_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_cms"."exams"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."exams_rels" ADD CONSTRAINT "exams_rels_passages_fk" FOREIGN KEY ("passages_id") REFERENCES "payload_cms"."passages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "passages_exam_idx" ON "payload_cms"."passages" USING btree ("exam_id");
  CREATE INDEX IF NOT EXISTS "passages_updated_at_idx" ON "payload_cms"."passages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "passages_created_at_idx" ON "payload_cms"."passages" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "passages_rels_order_idx" ON "payload_cms"."passages_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "passages_rels_parent_idx" ON "payload_cms"."passages_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "passages_rels_path_idx" ON "payload_cms"."passages_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "passages_rels_passage_questions_id_idx" ON "payload_cms"."passages_rels" USING btree ("passage_questions_id");
  CREATE INDEX IF NOT EXISTS "passage_questions_options_order_idx" ON "payload_cms"."passage_questions_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "passage_questions_options_parent_id_idx" ON "payload_cms"."passage_questions_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "passage_questions_options_image_idx" ON "payload_cms"."passage_questions_options" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "passage_questions_passage_idx" ON "payload_cms"."passage_questions" USING btree ("passage_id");
  CREATE INDEX IF NOT EXISTS "passage_questions_exam_idx" ON "payload_cms"."passage_questions" USING btree ("exam_id");
  CREATE INDEX IF NOT EXISTS "passage_questions_image_idx" ON "payload_cms"."passage_questions" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "passage_questions_updated_at_idx" ON "payload_cms"."passage_questions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "passage_questions_created_at_idx" ON "payload_cms"."passage_questions" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "exams_slug_idx" ON "payload_cms"."exams" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "exams_updated_at_idx" ON "payload_cms"."exams" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "exams_created_at_idx" ON "payload_cms"."exams" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "exams_rels_order_idx" ON "payload_cms"."exams_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "exams_rels_parent_idx" ON "payload_cms"."exams_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "exams_rels_path_idx" ON "payload_cms"."exams_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "exams_rels_passages_id_idx" ON "payload_cms"."exams_rels" USING btree ("passages_id");
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_passages_fk" FOREIGN KEY ("passages_id") REFERENCES "payload_cms"."passages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_passage_questions_fk" FOREIGN KEY ("passage_questions_id") REFERENCES "payload_cms"."passage_questions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_exams_fk" FOREIGN KEY ("exams_id") REFERENCES "payload_cms"."exams"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_passages_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("passages_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_passage_questions_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("passage_questions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_exams_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("exams_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."passages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."passages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."passage_questions_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."passage_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."exams" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."exams_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload_cms"."passages" CASCADE;
  DROP TABLE "payload_cms"."passages_rels" CASCADE;
  DROP TABLE "payload_cms"."passage_questions_options" CASCADE;
  DROP TABLE "payload_cms"."passage_questions" CASCADE;
  DROP TABLE "payload_cms"."exams" CASCADE;
  DROP TABLE "payload_cms"."exams_rels" CASCADE;
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_passages_fk";
  
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_passage_questions_fk";
  
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_exams_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_passages_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_passage_questions_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_exams_id_idx";
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "passages_id";
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "passage_questions_id";
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "exams_id";`)
}

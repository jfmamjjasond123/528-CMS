import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "payload_cms"."enum_exams_type" RENAME TO "enum_fl_exams_type";
  CREATE TABLE IF NOT EXISTS "payload_cms"."fl_passages" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"subject_id" uuid,
  	"exam_id" uuid NOT NULL,
  	"content" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."fl_passages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"fl_passage_questions_id" uuid
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."fl_passage_questions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"distractor_type_id" uuid,
  	"is_correct" boolean DEFAULT false NOT NULL,
  	"option_explanation" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."fl_passage_questions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"passage_id" uuid NOT NULL,
  	"skill_id" uuid,
  	"question_type_id" uuid,
  	"question_title" varchar,
  	"text" jsonb NOT NULL,
  	"question_explanation" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_cms"."exams" RENAME TO "fl_exams";
  ALTER TABLE "payload_cms"."exams_rels" RENAME TO "fl_exams_rels";
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" RENAME COLUMN "exams_id" TO "fl_exams_id";
  ALTER TABLE "payload_cms"."passages" DROP CONSTRAINT "passages_exam_id_exams_id_fk";
  
  ALTER TABLE "payload_cms"."fl_exams_rels" DROP CONSTRAINT "exams_rels_parent_fk";
  
  ALTER TABLE "payload_cms"."fl_exams_rels" DROP CONSTRAINT "exams_rels_passages_fk";
  
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_exams_fk";
  
  DROP INDEX IF EXISTS "passages_exam_idx";
  DROP INDEX IF EXISTS "exams_slug_idx";
  DROP INDEX IF EXISTS "exams_updated_at_idx";
  DROP INDEX IF EXISTS "exams_created_at_idx";
  DROP INDEX IF EXISTS "exams_rels_order_idx";
  DROP INDEX IF EXISTS "exams_rels_parent_idx";
  DROP INDEX IF EXISTS "exams_rels_path_idx";
  DROP INDEX IF EXISTS "exams_rels_passages_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_exams_id_idx";
  ALTER TABLE "payload_cms"."fl_exams" ALTER COLUMN "type" SET DEFAULT 'Full-Length Exam';
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD COLUMN "fl_passages_id" uuid;
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD COLUMN "fl_passage_questions_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."fl_passages" ADD CONSTRAINT "fl_passages_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "payload_cms"."subjects"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."fl_passages" ADD CONSTRAINT "fl_passages_exam_id_fl_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "payload_cms"."fl_exams"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."fl_passages_rels" ADD CONSTRAINT "fl_passages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_cms"."fl_passages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."fl_passages_rels" ADD CONSTRAINT "fl_passages_rels_fl_passage_questions_fk" FOREIGN KEY ("fl_passage_questions_id") REFERENCES "payload_cms"."fl_passage_questions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."fl_passage_questions_options" ADD CONSTRAINT "fl_passage_questions_options_distractor_type_id_distractor_types_id_fk" FOREIGN KEY ("distractor_type_id") REFERENCES "payload_cms"."distractor_types"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."fl_passage_questions_options" ADD CONSTRAINT "fl_passage_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload_cms"."fl_passage_questions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."fl_passage_questions" ADD CONSTRAINT "fl_passage_questions_passage_id_fl_passages_id_fk" FOREIGN KEY ("passage_id") REFERENCES "payload_cms"."fl_passages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."fl_passage_questions" ADD CONSTRAINT "fl_passage_questions_skill_id_question_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "payload_cms"."question_skills"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."fl_passage_questions" ADD CONSTRAINT "fl_passage_questions_question_type_id_question_types_id_fk" FOREIGN KEY ("question_type_id") REFERENCES "payload_cms"."question_types"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "fl_passages_subject_idx" ON "payload_cms"."fl_passages" USING btree ("subject_id");
  CREATE INDEX IF NOT EXISTS "fl_passages_exam_idx" ON "payload_cms"."fl_passages" USING btree ("exam_id");
  CREATE INDEX IF NOT EXISTS "fl_passages_updated_at_idx" ON "payload_cms"."fl_passages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "fl_passages_created_at_idx" ON "payload_cms"."fl_passages" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "fl_passages_rels_order_idx" ON "payload_cms"."fl_passages_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "fl_passages_rels_parent_idx" ON "payload_cms"."fl_passages_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "fl_passages_rels_path_idx" ON "payload_cms"."fl_passages_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "fl_passages_rels_fl_passage_questions_id_idx" ON "payload_cms"."fl_passages_rels" USING btree ("fl_passage_questions_id");
  CREATE INDEX IF NOT EXISTS "fl_passage_questions_options_order_idx" ON "payload_cms"."fl_passage_questions_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "fl_passage_questions_options_parent_id_idx" ON "payload_cms"."fl_passage_questions_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "fl_passage_questions_options_distractor_type_idx" ON "payload_cms"."fl_passage_questions_options" USING btree ("distractor_type_id");
  CREATE INDEX IF NOT EXISTS "fl_passage_questions_passage_idx" ON "payload_cms"."fl_passage_questions" USING btree ("passage_id");
  CREATE INDEX IF NOT EXISTS "fl_passage_questions_skill_idx" ON "payload_cms"."fl_passage_questions" USING btree ("skill_id");
  CREATE INDEX IF NOT EXISTS "fl_passage_questions_question_type_idx" ON "payload_cms"."fl_passage_questions" USING btree ("question_type_id");
  CREATE INDEX IF NOT EXISTS "fl_passage_questions_updated_at_idx" ON "payload_cms"."fl_passage_questions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "fl_passage_questions_created_at_idx" ON "payload_cms"."fl_passage_questions" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."fl_exams_rels" ADD CONSTRAINT "fl_exams_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_cms"."fl_exams"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."fl_exams_rels" ADD CONSTRAINT "fl_exams_rels_passages_fk" FOREIGN KEY ("passages_id") REFERENCES "payload_cms"."passages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fl_exams_fk" FOREIGN KEY ("fl_exams_id") REFERENCES "payload_cms"."fl_exams"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fl_passages_fk" FOREIGN KEY ("fl_passages_id") REFERENCES "payload_cms"."fl_passages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fl_passage_questions_fk" FOREIGN KEY ("fl_passage_questions_id") REFERENCES "payload_cms"."fl_passage_questions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE UNIQUE INDEX IF NOT EXISTS "fl_exams_slug_idx" ON "payload_cms"."fl_exams" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "fl_exams_updated_at_idx" ON "payload_cms"."fl_exams" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "fl_exams_created_at_idx" ON "payload_cms"."fl_exams" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "fl_exams_rels_order_idx" ON "payload_cms"."fl_exams_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "fl_exams_rels_parent_idx" ON "payload_cms"."fl_exams_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "fl_exams_rels_path_idx" ON "payload_cms"."fl_exams_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "fl_exams_rels_passages_id_idx" ON "payload_cms"."fl_exams_rels" USING btree ("passages_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_fl_exams_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("fl_exams_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_fl_passages_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("fl_passages_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_fl_passage_questions_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("fl_passage_questions_id");
  ALTER TABLE "payload_cms"."passages" DROP COLUMN IF EXISTS "exam_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload_cms"."enum_exams_type" AS ENUM('Full-Length Exam', 'Q-bank', 'Timed-Q-bank');
  ALTER TABLE "payload_cms"."fl_passages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."fl_passages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."fl_passage_questions_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."fl_passage_questions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload_cms"."fl_passages" CASCADE;
  DROP TABLE "payload_cms"."fl_passages_rels" CASCADE;
  DROP TABLE "payload_cms"."fl_passage_questions_options" CASCADE;
  DROP TABLE "payload_cms"."fl_passage_questions" CASCADE;
  ALTER TABLE "payload_cms"."fl_exams" RENAME TO "exams";
  ALTER TABLE "payload_cms"."fl_exams_rels" RENAME TO "exams_rels";
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" RENAME COLUMN "fl_exams_id" TO "exams_id";
  ALTER TABLE "payload_cms"."exams_rels" DROP CONSTRAINT "fl_exams_rels_parent_fk";
  
  ALTER TABLE "payload_cms"."exams_rels" DROP CONSTRAINT "fl_exams_rels_passages_fk";
  
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_fl_exams_fk";
  
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_fl_passages_fk";
  
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_fl_passage_questions_fk";
  
  DROP INDEX IF EXISTS "fl_exams_slug_idx";
  DROP INDEX IF EXISTS "fl_exams_updated_at_idx";
  DROP INDEX IF EXISTS "fl_exams_created_at_idx";
  DROP INDEX IF EXISTS "fl_exams_rels_order_idx";
  DROP INDEX IF EXISTS "fl_exams_rels_parent_idx";
  DROP INDEX IF EXISTS "fl_exams_rels_path_idx";
  DROP INDEX IF EXISTS "fl_exams_rels_passages_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_fl_exams_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_fl_passages_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_fl_passage_questions_id_idx";
  ALTER TABLE "payload_cms"."exams" ALTER COLUMN "type" SET DATA TYPE enum_exams_type;
  ALTER TABLE "payload_cms"."exams" ALTER COLUMN "type" SET DEFAULT 'Q-bank';
  ALTER TABLE "payload_cms"."passages" ADD COLUMN "exam_id" uuid NOT NULL;
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passages" ADD CONSTRAINT "passages_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "payload_cms"."exams"("id") ON DELETE set null ON UPDATE no action;
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
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_exams_fk" FOREIGN KEY ("exams_id") REFERENCES "payload_cms"."exams"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "passages_exam_idx" ON "payload_cms"."passages" USING btree ("exam_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "exams_slug_idx" ON "payload_cms"."exams" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "exams_updated_at_idx" ON "payload_cms"."exams" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "exams_created_at_idx" ON "payload_cms"."exams" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "exams_rels_order_idx" ON "payload_cms"."exams_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "exams_rels_parent_idx" ON "payload_cms"."exams_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "exams_rels_path_idx" ON "payload_cms"."exams_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "exams_rels_passages_id_idx" ON "payload_cms"."exams_rels" USING btree ("passages_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_exams_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("exams_id");
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "fl_passages_id";
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "fl_passage_questions_id";
  DROP TYPE "payload_cms"."enum_fl_exams_type";`)
}

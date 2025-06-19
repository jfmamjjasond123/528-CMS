import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "payload_cms"."subjects" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"subject_category_id" uuid,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."subjects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"passages_id" uuid
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."subject_categories" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."subject_categories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"subjects_id" uuid
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."question_skills" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."question_types" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."distractor_types" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_cms"."passages" ADD COLUMN "subject_id" uuid;
  ALTER TABLE "payload_cms"."passage_questions_options" ADD COLUMN "distractor_type_id" uuid;
  ALTER TABLE "payload_cms"."passage_questions" ADD COLUMN "skill_id" uuid;
  ALTER TABLE "payload_cms"."passage_questions" ADD COLUMN "question_type_id" uuid;
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD COLUMN "subjects_id" uuid;
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD COLUMN "subject_categories_id" uuid;
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD COLUMN "question_skills_id" uuid;
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD COLUMN "question_types_id" uuid;
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD COLUMN "distractor_types_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."subjects" ADD CONSTRAINT "subjects_subject_category_id_subject_categories_id_fk" FOREIGN KEY ("subject_category_id") REFERENCES "payload_cms"."subject_categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."subjects_rels" ADD CONSTRAINT "subjects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_cms"."subjects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."subjects_rels" ADD CONSTRAINT "subjects_rels_passages_fk" FOREIGN KEY ("passages_id") REFERENCES "payload_cms"."passages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."subject_categories_rels" ADD CONSTRAINT "subject_categories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_cms"."subject_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."subject_categories_rels" ADD CONSTRAINT "subject_categories_rels_subjects_fk" FOREIGN KEY ("subjects_id") REFERENCES "payload_cms"."subjects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "subjects_subject_category_idx" ON "payload_cms"."subjects" USING btree ("subject_category_id");
  CREATE INDEX IF NOT EXISTS "subjects_updated_at_idx" ON "payload_cms"."subjects" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "subjects_created_at_idx" ON "payload_cms"."subjects" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "subjects_rels_order_idx" ON "payload_cms"."subjects_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "subjects_rels_parent_idx" ON "payload_cms"."subjects_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "subjects_rels_path_idx" ON "payload_cms"."subjects_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "subjects_rels_passages_id_idx" ON "payload_cms"."subjects_rels" USING btree ("passages_id");
  CREATE INDEX IF NOT EXISTS "subject_categories_updated_at_idx" ON "payload_cms"."subject_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "subject_categories_created_at_idx" ON "payload_cms"."subject_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "subject_categories_rels_order_idx" ON "payload_cms"."subject_categories_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "subject_categories_rels_parent_idx" ON "payload_cms"."subject_categories_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "subject_categories_rels_path_idx" ON "payload_cms"."subject_categories_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "subject_categories_rels_subjects_id_idx" ON "payload_cms"."subject_categories_rels" USING btree ("subjects_id");
  CREATE INDEX IF NOT EXISTS "question_skills_updated_at_idx" ON "payload_cms"."question_skills" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "question_skills_created_at_idx" ON "payload_cms"."question_skills" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "question_types_updated_at_idx" ON "payload_cms"."question_types" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "question_types_created_at_idx" ON "payload_cms"."question_types" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "distractor_types_updated_at_idx" ON "payload_cms"."distractor_types" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "distractor_types_created_at_idx" ON "payload_cms"."distractor_types" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passages" ADD CONSTRAINT "passages_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "payload_cms"."subjects"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passage_questions_options" ADD CONSTRAINT "passage_questions_options_distractor_type_id_distractor_types_id_fk" FOREIGN KEY ("distractor_type_id") REFERENCES "payload_cms"."distractor_types"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passage_questions" ADD CONSTRAINT "passage_questions_skill_id_question_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "payload_cms"."question_skills"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."passage_questions" ADD CONSTRAINT "passage_questions_question_type_id_question_types_id_fk" FOREIGN KEY ("question_type_id") REFERENCES "payload_cms"."question_types"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subjects_fk" FOREIGN KEY ("subjects_id") REFERENCES "payload_cms"."subjects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subject_categories_fk" FOREIGN KEY ("subject_categories_id") REFERENCES "payload_cms"."subject_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_question_skills_fk" FOREIGN KEY ("question_skills_id") REFERENCES "payload_cms"."question_skills"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_question_types_fk" FOREIGN KEY ("question_types_id") REFERENCES "payload_cms"."question_types"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_distractor_types_fk" FOREIGN KEY ("distractor_types_id") REFERENCES "payload_cms"."distractor_types"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "passages_subject_idx" ON "payload_cms"."passages" USING btree ("subject_id");
  CREATE INDEX IF NOT EXISTS "passage_questions_options_distractor_type_idx" ON "payload_cms"."passage_questions_options" USING btree ("distractor_type_id");
  CREATE INDEX IF NOT EXISTS "passage_questions_skill_idx" ON "payload_cms"."passage_questions" USING btree ("skill_id");
  CREATE INDEX IF NOT EXISTS "passage_questions_question_type_idx" ON "payload_cms"."passage_questions" USING btree ("question_type_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_subjects_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("subjects_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_subject_categories_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("subject_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_question_skills_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("question_skills_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_question_types_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("question_types_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_distractor_types_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("distractor_types_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_cms"."subjects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."subjects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."subject_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."subject_categories_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."question_skills" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."question_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_cms"."distractor_types" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload_cms"."subjects" CASCADE;
  DROP TABLE "payload_cms"."subjects_rels" CASCADE;
  DROP TABLE "payload_cms"."subject_categories" CASCADE;
  DROP TABLE "payload_cms"."subject_categories_rels" CASCADE;
  DROP TABLE "payload_cms"."question_skills" CASCADE;
  DROP TABLE "payload_cms"."question_types" CASCADE;
  DROP TABLE "payload_cms"."distractor_types" CASCADE;
  ALTER TABLE "payload_cms"."passages" DROP CONSTRAINT "passages_subject_id_subjects_id_fk";
  
  ALTER TABLE "payload_cms"."passage_questions_options" DROP CONSTRAINT "passage_questions_options_distractor_type_id_distractor_types_id_fk";
  
  ALTER TABLE "payload_cms"."passage_questions" DROP CONSTRAINT "passage_questions_skill_id_question_skills_id_fk";
  
  ALTER TABLE "payload_cms"."passage_questions" DROP CONSTRAINT "passage_questions_question_type_id_question_types_id_fk";
  
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_subjects_fk";
  
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_subject_categories_fk";
  
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_question_skills_fk";
  
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_question_types_fk";
  
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_distractor_types_fk";
  
  DROP INDEX IF EXISTS "passages_subject_idx";
  DROP INDEX IF EXISTS "passage_questions_options_distractor_type_idx";
  DROP INDEX IF EXISTS "passage_questions_skill_idx";
  DROP INDEX IF EXISTS "passage_questions_question_type_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_subjects_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_subject_categories_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_question_skills_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_question_types_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_distractor_types_id_idx";
  ALTER TABLE "payload_cms"."passages" DROP COLUMN IF EXISTS "subject_id";
  ALTER TABLE "payload_cms"."passage_questions_options" DROP COLUMN IF EXISTS "distractor_type_id";
  ALTER TABLE "payload_cms"."passage_questions" DROP COLUMN IF EXISTS "skill_id";
  ALTER TABLE "payload_cms"."passage_questions" DROP COLUMN IF EXISTS "question_type_id";
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "subjects_id";
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "subject_categories_id";
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "question_skills_id";
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "question_types_id";
  ALTER TABLE "payload_cms"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "distractor_types_id";`)
}

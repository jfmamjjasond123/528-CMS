import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload_cms"."enum_media_media_type" AS ENUM('image', 'video');
  CREATE TYPE "payload_cms"."enum_lessons_type" AS ENUM('video', 'lesson');
  CREATE TYPE "payload_cms"."enum_questions_type" AS ENUM('quiz', 'exercise');
  CREATE TYPE "payload_cms"."enum_courses_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload_cms"."enum_mux_video_playback_options_playback_policy" AS ENUM('signed', 'public');
  CREATE TABLE IF NOT EXISTS "payload_cms"."users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"media_type" "payload_cms"."enum_media_media_type" NOT NULL,
  	"description" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."lessons" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" jsonb,
  	"type" "payload_cms"."enum_lessons_type" NOT NULL,
  	"duration" varchar,
  	"video_id" uuid,
  	"content" jsonb,
  	"module_id" uuid NOT NULL,
  	"order" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."modules" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"course_id" uuid NOT NULL,
  	"order" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."modules_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"lessons_id" uuid
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."courses_learning_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"outcome" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."courses" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"icon_class" varchar,
  	"thumbnail_id" uuid,
  	"description_short" varchar NOT NULL,
  	"description_long" jsonb,
  	"estimated_total_hours" varchar,
  	"category_id" uuid NOT NULL,
  	"instructor_id" uuid NOT NULL,
  	"level_id" uuid NOT NULL,
  	"status" "payload_cms"."enum_courses_status" DEFAULT 'draft',
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."courses_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"modules_id" uuid
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."categories" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."instructors" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."levels" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."mux_video_playback_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"playback_id" varchar,
  	"playback_policy" "payload_cms"."enum_mux_video_playback_options_playback_policy"
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."mux_video" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"asset_id" varchar,
  	"duration" numeric,
  	"poster_timestamp" numeric,
  	"aspect_ratio" varchar,
  	"max_width" numeric,
  	"max_height" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."payload_locked_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid,
  	"media_id" uuid,
  	"lessons_id" uuid,
  	"questions_id" uuid,
  	"modules_id" uuid,
  	"courses_id" uuid,
  	"categories_id" uuid,
  	"instructors_id" uuid,
  	"levels_id" uuid,
  	"mux_video_id" uuid
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."payload_preferences" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid
  );
  
  CREATE TABLE IF NOT EXISTS "payload_cms"."payload_migrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."lessons" ADD CONSTRAINT "lessons_video_id_mux_video_id_fk" FOREIGN KEY ("video_id") REFERENCES "payload_cms"."mux_video"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."lessons" ADD CONSTRAINT "lessons_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "payload_cms"."modules"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
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
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."modules" ADD CONSTRAINT "modules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "payload_cms"."courses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."modules_rels" ADD CONSTRAINT "modules_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_cms"."modules"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."modules_rels" ADD CONSTRAINT "modules_rels_lessons_fk" FOREIGN KEY ("lessons_id") REFERENCES "payload_cms"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."courses_learning_outcomes" ADD CONSTRAINT "courses_learning_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload_cms"."courses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."courses" ADD CONSTRAINT "courses_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "payload_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."courses" ADD CONSTRAINT "courses_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "payload_cms"."categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."courses" ADD CONSTRAINT "courses_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "payload_cms"."instructors"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."courses" ADD CONSTRAINT "courses_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "payload_cms"."levels"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."courses_rels" ADD CONSTRAINT "courses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_cms"."courses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."courses_rels" ADD CONSTRAINT "courses_rels_modules_fk" FOREIGN KEY ("modules_id") REFERENCES "payload_cms"."modules"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."mux_video_playback_options" ADD CONSTRAINT "mux_video_playback_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload_cms"."mux_video"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_cms"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload_cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload_cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lessons_fk" FOREIGN KEY ("lessons_id") REFERENCES "payload_cms"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_questions_fk" FOREIGN KEY ("questions_id") REFERENCES "payload_cms"."questions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_modules_fk" FOREIGN KEY ("modules_id") REFERENCES "payload_cms"."modules"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "payload_cms"."courses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "payload_cms"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_instructors_fk" FOREIGN KEY ("instructors_id") REFERENCES "payload_cms"."instructors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_levels_fk" FOREIGN KEY ("levels_id") REFERENCES "payload_cms"."levels"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mux_video_fk" FOREIGN KEY ("mux_video_id") REFERENCES "payload_cms"."mux_video"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_cms"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_cms"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload_cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "payload_cms"."users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "payload_cms"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "payload_cms"."users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "payload_cms"."media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "payload_cms"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "payload_cms"."media" USING btree ("filename");
  CREATE UNIQUE INDEX IF NOT EXISTS "lessons_slug_idx" ON "payload_cms"."lessons" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "lessons_video_idx" ON "payload_cms"."lessons" USING btree ("video_id");
  CREATE INDEX IF NOT EXISTS "lessons_module_idx" ON "payload_cms"."lessons" USING btree ("module_id");
  CREATE INDEX IF NOT EXISTS "lessons_updated_at_idx" ON "payload_cms"."lessons" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "lessons_created_at_idx" ON "payload_cms"."lessons" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "lessons_rels_order_idx" ON "payload_cms"."lessons_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "lessons_rels_parent_idx" ON "payload_cms"."lessons_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "lessons_rels_path_idx" ON "payload_cms"."lessons_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "lessons_rels_questions_id_idx" ON "payload_cms"."lessons_rels" USING btree ("questions_id");
  CREATE INDEX IF NOT EXISTS "questions_options_order_idx" ON "payload_cms"."questions_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "questions_options_parent_id_idx" ON "payload_cms"."questions_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "questions_lessons_idx" ON "payload_cms"."questions" USING btree ("lessons_id");
  CREATE INDEX IF NOT EXISTS "questions_updated_at_idx" ON "payload_cms"."questions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "questions_created_at_idx" ON "payload_cms"."questions" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "modules_slug_idx" ON "payload_cms"."modules" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "modules_course_idx" ON "payload_cms"."modules" USING btree ("course_id");
  CREATE INDEX IF NOT EXISTS "modules_updated_at_idx" ON "payload_cms"."modules" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "modules_created_at_idx" ON "payload_cms"."modules" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "modules_rels_order_idx" ON "payload_cms"."modules_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "modules_rels_parent_idx" ON "payload_cms"."modules_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "modules_rels_path_idx" ON "payload_cms"."modules_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "modules_rels_lessons_id_idx" ON "payload_cms"."modules_rels" USING btree ("lessons_id");
  CREATE INDEX IF NOT EXISTS "courses_learning_outcomes_order_idx" ON "payload_cms"."courses_learning_outcomes" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "courses_learning_outcomes_parent_id_idx" ON "payload_cms"."courses_learning_outcomes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "courses_slug_idx" ON "payload_cms"."courses" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "courses_thumbnail_idx" ON "payload_cms"."courses" USING btree ("thumbnail_id");
  CREATE INDEX IF NOT EXISTS "courses_category_idx" ON "payload_cms"."courses" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "courses_instructor_idx" ON "payload_cms"."courses" USING btree ("instructor_id");
  CREATE INDEX IF NOT EXISTS "courses_level_idx" ON "payload_cms"."courses" USING btree ("level_id");
  CREATE INDEX IF NOT EXISTS "courses_updated_at_idx" ON "payload_cms"."courses" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "courses_created_at_idx" ON "payload_cms"."courses" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "courses_rels_order_idx" ON "payload_cms"."courses_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "courses_rels_parent_idx" ON "payload_cms"."courses_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "courses_rels_path_idx" ON "payload_cms"."courses_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "courses_rels_modules_id_idx" ON "payload_cms"."courses_rels" USING btree ("modules_id");
  CREATE INDEX IF NOT EXISTS "categories_updated_at_idx" ON "payload_cms"."categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "categories_created_at_idx" ON "payload_cms"."categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "instructors_updated_at_idx" ON "payload_cms"."instructors" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "instructors_created_at_idx" ON "payload_cms"."instructors" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "levels_updated_at_idx" ON "payload_cms"."levels" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "levels_created_at_idx" ON "payload_cms"."levels" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "mux_video_playback_options_order_idx" ON "payload_cms"."mux_video_playback_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "mux_video_playback_options_parent_id_idx" ON "payload_cms"."mux_video_playback_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "mux_video_title_idx" ON "payload_cms"."mux_video" USING btree ("title");
  CREATE INDEX IF NOT EXISTS "mux_video_updated_at_idx" ON "payload_cms"."mux_video" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "mux_video_created_at_idx" ON "payload_cms"."mux_video" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_cms"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_cms"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_cms"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_lessons_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("lessons_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_questions_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("questions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_modules_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("modules_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_courses_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_categories_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_instructors_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("instructors_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_levels_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("levels_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_mux_video_id_idx" ON "payload_cms"."payload_locked_documents_rels" USING btree ("mux_video_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_cms"."payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_cms"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_cms"."payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_cms"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_cms"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_cms"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_cms"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_cms"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_cms"."payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload_cms"."users" CASCADE;
  DROP TABLE "payload_cms"."media" CASCADE;
  DROP TABLE "payload_cms"."lessons" CASCADE;
  DROP TABLE "payload_cms"."lessons_rels" CASCADE;
  DROP TABLE "payload_cms"."questions_options" CASCADE;
  DROP TABLE "payload_cms"."questions" CASCADE;
  DROP TABLE "payload_cms"."modules" CASCADE;
  DROP TABLE "payload_cms"."modules_rels" CASCADE;
  DROP TABLE "payload_cms"."courses_learning_outcomes" CASCADE;
  DROP TABLE "payload_cms"."courses" CASCADE;
  DROP TABLE "payload_cms"."courses_rels" CASCADE;
  DROP TABLE "payload_cms"."categories" CASCADE;
  DROP TABLE "payload_cms"."instructors" CASCADE;
  DROP TABLE "payload_cms"."levels" CASCADE;
  DROP TABLE "payload_cms"."mux_video_playback_options" CASCADE;
  DROP TABLE "payload_cms"."mux_video" CASCADE;
  DROP TABLE "payload_cms"."payload_locked_documents" CASCADE;
  DROP TABLE "payload_cms"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_cms"."payload_preferences" CASCADE;
  DROP TABLE "payload_cms"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload_cms"."payload_migrations" CASCADE;
  DROP TYPE "payload_cms"."enum_media_media_type";
  DROP TYPE "payload_cms"."enum_lessons_type";
  DROP TYPE "payload_cms"."enum_questions_type";
  DROP TYPE "payload_cms"."enum_courses_status";
  DROP TYPE "payload_cms"."enum_mux_video_playback_options_playback_policy";`)
}

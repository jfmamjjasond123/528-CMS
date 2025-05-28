import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_mux_video_playback_options_playback_policy" AS ENUM('signed', 'public');
  CREATE TABLE IF NOT EXISTS "mux_video_playback_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"playback_id" varchar,
  	"playback_policy" "enum_mux_video_playback_options_playback_policy"
  );
  
  CREATE TABLE IF NOT EXISTS "mux_video" (
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
  
  ALTER TABLE "lessons" DROP CONSTRAINT "lessons_video_id_media_id_fk";
  
  ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid;
  ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "media" ALTER COLUMN "id" SET DATA TYPE uuid;
  ALTER TABLE "media" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "lessons" ALTER COLUMN "id" SET DATA TYPE uuid;
  ALTER TABLE "lessons" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "lessons" ALTER COLUMN "duration" SET DATA TYPE numeric;
  ALTER TABLE "lessons" ALTER COLUMN "duration" SET NOT NULL;
  ALTER TABLE "lessons" ALTER COLUMN "video_id" SET DATA TYPE uuid;
  ALTER TABLE "lessons" ALTER COLUMN "module_id" SET DATA TYPE uuid;
  ALTER TABLE "lessons_rels" ALTER COLUMN "parent_id" SET DATA TYPE uuid;
  ALTER TABLE "lessons_rels" ALTER COLUMN "questions_id" SET DATA TYPE uuid;
  ALTER TABLE "questions_options" ALTER COLUMN "_parent_id" SET DATA TYPE uuid;
  ALTER TABLE "questions" ALTER COLUMN "id" SET DATA TYPE uuid;
  ALTER TABLE "questions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "questions" ALTER COLUMN "lessons_id" SET DATA TYPE uuid;
  ALTER TABLE "modules" ALTER COLUMN "id" SET DATA TYPE uuid;
  ALTER TABLE "modules" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "modules" ALTER COLUMN "course_id" SET DATA TYPE uuid;
  ALTER TABLE "modules_rels" ALTER COLUMN "parent_id" SET DATA TYPE uuid;
  ALTER TABLE "modules_rels" ALTER COLUMN "lessons_id" SET DATA TYPE uuid;
  ALTER TABLE "courses_learning_outcomes" ALTER COLUMN "_parent_id" SET DATA TYPE uuid;
  ALTER TABLE "courses" ALTER COLUMN "id" SET DATA TYPE uuid;
  ALTER TABLE "courses" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "courses" ALTER COLUMN "thumbnail_id" SET DATA TYPE uuid;
  ALTER TABLE "courses" ALTER COLUMN "category_id" SET DATA TYPE uuid;
  ALTER TABLE "courses" ALTER COLUMN "instructor_id" SET DATA TYPE uuid;
  ALTER TABLE "courses" ALTER COLUMN "level_id" SET DATA TYPE uuid;
  ALTER TABLE "courses_rels" ALTER COLUMN "parent_id" SET DATA TYPE uuid;
  ALTER TABLE "courses_rels" ALTER COLUMN "modules_id" SET DATA TYPE uuid;
  ALTER TABLE "categories" ALTER COLUMN "id" SET DATA TYPE uuid;
  ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "instructors" ALTER COLUMN "id" SET DATA TYPE uuid;
  ALTER TABLE "instructors" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "levels" ALTER COLUMN "id" SET DATA TYPE uuid;
  ALTER TABLE "levels" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "payload_locked_documents" ALTER COLUMN "id" SET DATA TYPE uuid;
  ALTER TABLE "payload_locked_documents" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "parent_id" SET DATA TYPE uuid;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "users_id" SET DATA TYPE uuid;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "media_id" SET DATA TYPE uuid;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "lessons_id" SET DATA TYPE uuid;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "questions_id" SET DATA TYPE uuid;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "modules_id" SET DATA TYPE uuid;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "courses_id" SET DATA TYPE uuid;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "categories_id" SET DATA TYPE uuid;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "instructors_id" SET DATA TYPE uuid;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "levels_id" SET DATA TYPE uuid;
  ALTER TABLE "payload_preferences" ALTER COLUMN "id" SET DATA TYPE uuid;
  ALTER TABLE "payload_preferences" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "payload_preferences_rels" ALTER COLUMN "parent_id" SET DATA TYPE uuid;
  ALTER TABLE "payload_preferences_rels" ALTER COLUMN "users_id" SET DATA TYPE uuid;
  ALTER TABLE "payload_migrations" ALTER COLUMN "id" SET DATA TYPE uuid;
  ALTER TABLE "payload_migrations" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "lessons" ADD COLUMN "description" jsonb;
  ALTER TABLE "courses" ADD COLUMN "order" numeric;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "mux_video_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "mux_video_playback_options" ADD CONSTRAINT "mux_video_playback_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."mux_video"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "mux_video_playback_options_order_idx" ON "mux_video_playback_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "mux_video_playback_options_parent_id_idx" ON "mux_video_playback_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "mux_video_title_idx" ON "mux_video" USING btree ("title");
  CREATE INDEX IF NOT EXISTS "mux_video_updated_at_idx" ON "mux_video" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "mux_video_created_at_idx" ON "mux_video" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "lessons" ADD CONSTRAINT "lessons_video_id_mux_video_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."mux_video"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mux_video_fk" FOREIGN KEY ("mux_video_id") REFERENCES "public"."mux_video"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_mux_video_id_idx" ON "payload_locked_documents_rels" USING btree ("mux_video_id");
  ALTER TABLE "media" DROP COLUMN IF EXISTS "external_url";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "mux_video_playback_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "mux_video" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "mux_video_playback_options" CASCADE;
  DROP TABLE "mux_video" CASCADE;
  ALTER TABLE "lessons" DROP CONSTRAINT "lessons_video_id_mux_video_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_mux_video_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_mux_video_id_idx";
  ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "media" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "media" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "lessons" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "lessons" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "lessons" ALTER COLUMN "duration" SET DATA TYPE varchar;
  ALTER TABLE "lessons" ALTER COLUMN "duration" DROP NOT NULL;
  ALTER TABLE "lessons" ALTER COLUMN "video_id" SET DATA TYPE integer;
  ALTER TABLE "lessons" ALTER COLUMN "module_id" SET DATA TYPE integer;
  ALTER TABLE "lessons_rels" ALTER COLUMN "parent_id" SET DATA TYPE integer;
  ALTER TABLE "lessons_rels" ALTER COLUMN "questions_id" SET DATA TYPE integer;
  ALTER TABLE "questions_options" ALTER COLUMN "_parent_id" SET DATA TYPE integer;
  ALTER TABLE "questions" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "questions" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "questions" ALTER COLUMN "lessons_id" SET DATA TYPE integer;
  ALTER TABLE "modules" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "modules" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "modules" ALTER COLUMN "course_id" SET DATA TYPE integer;
  ALTER TABLE "modules_rels" ALTER COLUMN "parent_id" SET DATA TYPE integer;
  ALTER TABLE "modules_rels" ALTER COLUMN "lessons_id" SET DATA TYPE integer;
  ALTER TABLE "courses_learning_outcomes" ALTER COLUMN "_parent_id" SET DATA TYPE integer;
  ALTER TABLE "courses" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "courses" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "courses" ALTER COLUMN "thumbnail_id" SET DATA TYPE integer;
  ALTER TABLE "courses" ALTER COLUMN "category_id" SET DATA TYPE integer;
  ALTER TABLE "courses" ALTER COLUMN "instructor_id" SET DATA TYPE integer;
  ALTER TABLE "courses" ALTER COLUMN "level_id" SET DATA TYPE integer;
  ALTER TABLE "courses_rels" ALTER COLUMN "parent_id" SET DATA TYPE integer;
  ALTER TABLE "courses_rels" ALTER COLUMN "modules_id" SET DATA TYPE integer;
  ALTER TABLE "categories" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "categories" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "instructors" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "instructors" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "levels" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "levels" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "payload_locked_documents" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "payload_locked_documents" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "parent_id" SET DATA TYPE integer;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "users_id" SET DATA TYPE integer;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "media_id" SET DATA TYPE integer;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "lessons_id" SET DATA TYPE integer;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "questions_id" SET DATA TYPE integer;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "modules_id" SET DATA TYPE integer;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "courses_id" SET DATA TYPE integer;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "categories_id" SET DATA TYPE integer;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "instructors_id" SET DATA TYPE integer;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "levels_id" SET DATA TYPE integer;
  ALTER TABLE "payload_preferences" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "payload_preferences" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "payload_preferences_rels" ALTER COLUMN "parent_id" SET DATA TYPE integer;
  ALTER TABLE "payload_preferences_rels" ALTER COLUMN "users_id" SET DATA TYPE integer;
  ALTER TABLE "payload_migrations" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "payload_migrations" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "media" ADD COLUMN "external_url" varchar;
  DO $$ BEGIN
   ALTER TABLE "lessons" ADD CONSTRAINT "lessons_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  ALTER TABLE "lessons" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "courses" DROP COLUMN IF EXISTS "order";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "mux_video_id";
  DROP TYPE "public"."enum_mux_video_playback_options_playback_policy";`)
}

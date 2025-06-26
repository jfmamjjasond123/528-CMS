import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload_cms"."passages_rels" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "payload_cms"."passages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"passage_questions_id" uuid
  );
  
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
  
  CREATE INDEX IF NOT EXISTS "passages_rels_order_idx" ON "payload_cms"."passages_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "passages_rels_parent_idx" ON "payload_cms"."passages_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "passages_rels_path_idx" ON "payload_cms"."passages_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "passages_rels_passage_questions_id_idx" ON "payload_cms"."passages_rels" USING btree ("passage_questions_id");`)
}

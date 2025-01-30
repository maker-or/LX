ALTER TABLE "gallery_repo" ALTER COLUMN "type" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "gallery_repo" ALTER COLUMN "type" SET DEFAULT '{}'::text[];
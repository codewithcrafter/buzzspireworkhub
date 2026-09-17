-- Migration: add_cms_structure
-- This SQL script was generated as a safe read-only diff from the current database to the updated Prisma schema.
-- Do NOT apply this script automatically without first baselining the existing database with Prisma Migrate.

CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'PUBLISHED');

CREATE TYPE "SectionType" AS ENUM ('HERO', 'CONTENT', 'FAQ', 'CTA', 'MEDIA', 'CUSTOM');

CREATE TYPE "ContentFieldType" AS ENUM ('TEXT', 'RICH_TEXT', 'URL', 'IMAGE', 'BOOLEAN', 'NUMBER', 'JSON');

CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "PageStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SectionType" NOT NULL DEFAULT 'CONTENT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContentField" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "ContentFieldType" NOT NULL DEFAULT 'TEXT',
    "value" JSONB,
    "mediaId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentField_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PageSEO" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "canonicalUrl" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageSEO_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FaqItem" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FaqItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
CREATE INDEX "Page_slug_idx" ON "Page"("slug");
CREATE INDEX "Section_pageId_idx" ON "Section"("pageId");
CREATE INDEX "ContentField_sectionId_idx" ON "ContentField"("sectionId");
CREATE UNIQUE INDEX "PageSEO_pageId_key" ON "PageSEO"("pageId");
CREATE INDEX "FaqItem_sectionId_idx" ON "FaqItem"("sectionId");

ALTER TABLE "Section" ADD CONSTRAINT "Section_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentField" ADD CONSTRAINT "ContentField_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentField" ADD CONSTRAINT "ContentField_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "CloudFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PageSEO" ADD CONSTRAINT "PageSEO_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FaqItem" ADD CONSTRAINT "FaqItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

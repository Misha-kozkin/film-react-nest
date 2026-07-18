CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS "films" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "rating" double precision NOT NULL,
  "director" varchar NOT NULL,
  "tags" text NOT NULL,
  "image" varchar NOT NULL,
  "cover" varchar NOT NULL,
  "title" varchar NOT NULL,
  "about" varchar NOT NULL,
  "description" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "schedules" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "daytime" timestamptz NOT NULL,
  "hall" integer NOT NULL,
  "rows" integer NOT NULL,
  "seats" integer NOT NULL,
  "price" integer NOT NULL,
  "taken" varchar,
  "filmId" uuid REFERENCES "films"("id") ON DELETE CASCADE
);
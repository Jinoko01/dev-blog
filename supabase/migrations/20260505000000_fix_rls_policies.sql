-- Fix RLS policies for public read access
-- Problem: posts, post_tags, tags tables had no SELECT policy for anon role,
--          so all reads via the anon key (web app) were blocked.

-- posts: allow anon to read published posts only
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read of published posts" ON posts;
CREATE POLICY "Allow public read of published posts"
  ON posts FOR SELECT
  TO anon
  USING (published = true);

-- post_tags: allow anon to read all rows (no sensitive data)
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read of post_tags" ON post_tags;
CREATE POLICY "Allow public read of post_tags"
  ON post_tags FOR SELECT
  TO anon
  USING (true);

-- tags: allow anon to read all rows
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read of tags" ON tags;
CREATE POLICY "Allow public read of tags"
  ON tags FOR SELECT
  TO anon
  USING (true);

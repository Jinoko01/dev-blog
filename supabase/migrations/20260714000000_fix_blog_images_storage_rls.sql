-- Fix RLS policies for blog-images storage bucket
-- Problem: storage.objects policies for blog-images only granted access to
--          `supabase_etl_admin` (an internal Supabase system role), so no
--          app role (anon/authenticated/service_role) could upload -- causing
--          "Storage upload failed" in the admin CMS.

DROP POLICY IF EXISTS "blog-images bjsgsj_0" ON storage.objects;
DROP POLICY IF EXISTS "blog-images bjsgsj_1" ON storage.objects;
DROP POLICY IF EXISTS "blog-images bjsgsj_2" ON storage.objects;
DROP POLICY IF EXISTS "blog-images bjsgsj_3" ON storage.objects;

CREATE POLICY "blog-images public read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'blog-images');

CREATE POLICY "blog-images write"
  ON storage.objects FOR INSERT
  TO authenticated, service_role
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "blog-images update"
  ON storage.objects FOR UPDATE
  TO authenticated, service_role
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "blog-images delete"
  ON storage.objects FOR DELETE
  TO authenticated, service_role
  USING (bucket_id = 'blog-images');

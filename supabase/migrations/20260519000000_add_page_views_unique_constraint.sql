-- Add unique constraint to page_views table
-- Problem: Same session can create multiple page_views on the same day,
--          leading to duplicate analytics data.
-- Solution: Add unique constraint on (visit_date, session_id) to ensure
--           one record per session per day.

ALTER TABLE page_views
ADD CONSTRAINT uq_page_views_date_session UNIQUE (visit_date, session_id);

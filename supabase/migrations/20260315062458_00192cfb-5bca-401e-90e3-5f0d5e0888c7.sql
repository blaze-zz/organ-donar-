
-- Add latitude/longitude to hospitals for geolocation
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS latitude double precision;
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS longitude double precision;

-- Allow anyone (including anonymous) to view organ requests publicly
CREATE POLICY "Anyone can view organ requests" ON public.organ_requests
  FOR SELECT TO public USING (true);

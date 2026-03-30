CREATE POLICY "Anyone can view requester profiles"
ON public.profiles FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM public.organ_requests
    WHERE organ_requests.requester_id = profiles.user_id
    AND organ_requests.status IN ('pending', 'approved')
  )
);
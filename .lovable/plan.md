

## Plan: Show Hospital Names and Requester Details in Organ Requests Section

### Summary
Update the Organ Requests cards on the homepage to display the associated hospital name/city and the requester's name and blood group alongside each request.

### Database Changes

**1. Add RLS policy for public profile viewing (limited)**
- Add a new SELECT policy on `profiles` that allows anyone to view profiles of users who have active organ requests. This avoids exposing all user profiles publicly.

```sql
CREATE POLICY "Anyone can view requester profiles"
ON public.profiles FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM public.organ_requests
    WHERE organ_requests.requester_id = profiles.user_id
    AND organ_requests.status IN ('pending', 'approved')
  )
);
```

### Frontend Changes

**2. Update `src/components/landing/OrganRequests.tsx`**
- Change the Supabase query to join related tables:
  ```typescript
  .select(`id, organ_type, urgency_level, status, created_at, medical_condition,
    hospitals(name, city),
    profiles!organ_requests_requester_id_fkey(full_name, blood_group)`)
  ```
  - Note: `organ_requests` doesn't have a named FK to profiles. Since `requester_id` references `auth.users` (not `profiles.user_id`), I'll need to fetch hospitals via the FK join and profiles separately, or add a foreign key. Actually, there's no FK from organ_requests to profiles. I'll fetch hospital data via the join and fetch requester profiles in a second query using the `requester_id` values.

- **Approach**: Use the hospital FK join for hospital data. For requester info, do a second query to `profiles` filtering by `user_id` in the list of `requester_id`s from the requests.

- Update the interface to include hospital name/city and requester name/blood group.

- Update the card UI to show:
  - Hospital name and city (with a Building/MapPin icon)
  - Requester name and blood group (with a User icon)

### Technical Details

- The `organ_requests` table has `organ_requests_hospital_id_fkey` to `hospitals`, so the hospital join works directly.
- For profiles, since there's no direct FK from `organ_requests.requester_id` to `profiles.user_id`, we'll query profiles separately with `.in('user_id', requesterIds)` and merge client-side.
- The new RLS policy ensures only profiles of users with active requests are visible publicly.

### Files Modified
1. **New migration** - Add RLS policy for public requester profile viewing
2. **`src/components/landing/OrganRequests.tsx`** - Join hospitals, fetch requester profiles, update card UI


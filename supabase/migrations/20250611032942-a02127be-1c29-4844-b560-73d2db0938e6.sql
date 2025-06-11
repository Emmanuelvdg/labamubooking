
-- Create storage bucket for staff avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('staff-avatars', 'staff-avatars', true);

-- Create storage policies for staff avatars
CREATE POLICY "Anyone can view staff avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'staff-avatars');

CREATE POLICY "Authenticated users can upload staff avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'staff-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update staff avatars" ON storage.objects
FOR UPDATE USING (bucket_id = 'staff-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete staff avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'staff-avatars' AND auth.role() = 'authenticated');

-- TU EE Portal Supabase Schema

-- 1. Create a table for user profiles
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT NOT NULL,
    roll_number TEXT,
    semester TEXT,
    linkedin TEXT DEFAULT '',
    role TEXT DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create a table for question papers
CREATE TABLE public.question_papers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subject_name TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    semester TEXT NOT NULL,
    year TEXT NOT NULL,
    exam_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;

-- Profiles:
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Question Papers:
-- All authenticated users can read question papers
CREATE POLICY "Authenticated users can read question papers" 
ON public.question_papers FOR SELECT 
TO authenticated 
USING (true);

-- Only admins can insert, update, or delete question papers
-- (Note: In this implementation, we will enforce admin checks in Next.js Server Actions, 
-- but you can also add strict RLS admin checks here if desired)
CREATE POLICY "Admins can manage question papers" 
ON public.question_papers FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- 4. Set up Storage for PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('question_papers', 'question_papers', false);

-- Storage RLS: Authenticated users can read
CREATE POLICY "Authenticated users can read PDFs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'question_papers');

-- Storage RLS: Admins can upload/delete
CREATE POLICY "Admins can manage PDFs"
ON storage.objects FOR ALL
USING (
    bucket_id = 'question_papers' AND
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- 5. Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, roll_number, semester, linkedin, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'roll_number', 
    new.raw_user_meta_data->>'semester',
    new.raw_user_meta_data->>'linkedin',
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

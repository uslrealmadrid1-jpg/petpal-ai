-- Create enum for difficulty levels
CREATE TYPE public.difficulty_level AS ENUM ('Nybörjare', 'Medel', 'Avancerad');

-- Create enum for activity types
CREATE TYPE public.activity_type AS ENUM ('Dagaktiv', 'Nattaktiv', 'Skymningsaktiv');

-- Create enum for animal categories
CREATE TYPE public.animal_category AS ENUM ('Reptil', 'Däggdjur', 'Fågel', 'Groddjur', 'Kräftdjur', 'Fisk');

-- Create animals table
CREATE TABLE public.animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  namn TEXT NOT NULL,
  vetenskapligt_namn TEXT,
  emoji TEXT DEFAULT '🐾',
  kategori animal_category NOT NULL,
  svårighet difficulty_level DEFAULT 'Medel',
  aktivitet activity_type DEFAULT 'Dagaktiv',
  livslängd_år TEXT,
  beskrivning TEXT,
  theme TEXT DEFAULT 'gecko',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create animal care requirements table
CREATE TABLE public.animal_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE NOT NULL,
  temperatur TEXT,
  fuktighet TEXT,
  belysning TEXT,
  substrat TEXT,
  bostad TEXT,
  vatten_dryck TEXT,
  vatten_behandling TEXT,
  beteende_aktivitet TEXT,
  beteende_social TEXT,
  beteende_lek TEXT,
  aktivitet_vaknar TEXT,
  aktivitet_sover TEXT,
  aktivitet_timmar TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create food items table
CREATE TABLE public.animal_food (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE NOT NULL,
  typ TEXT NOT NULL,
  frekvens TEXT,
  mängd TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create diseases table
CREATE TABLE public.animal_diseases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE NOT NULL,
  namn TEXT NOT NULL,
  symptom TEXT[] DEFAULT '{}',
  åtgärd TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create warnings table
CREATE TABLE public.animal_warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE NOT NULL,
  varning TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create checklist templates table
CREATE TABLE public.checklist_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE NOT NULL,
  typ TEXT NOT NULL CHECK (typ IN ('inköp', 'daglig', 'veckovis')),
  item TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user checklist progress table
CREATE TABLE public.user_checklist_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES public.checklist_templates(id) ON DELETE CASCADE NOT NULL,
  checked BOOLEAN DEFAULT false,
  checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, template_id)
);

-- Create user favorite animals table
CREATE TABLE public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, animal_id)
);

-- Create AI chat history table
CREATE TABLE public.ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  animal_id UUID REFERENCES public.animals(id) ON DELETE SET NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_food ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_checklist_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;

-- Public read access for animal data (everyone can view animals)
CREATE POLICY "Animals are viewable by everyone" ON public.animals FOR SELECT USING (true);
CREATE POLICY "Requirements are viewable by everyone" ON public.animal_requirements FOR SELECT USING (true);
CREATE POLICY "Food is viewable by everyone" ON public.animal_food FOR SELECT USING (true);
CREATE POLICY "Diseases are viewable by everyone" ON public.animal_diseases FOR SELECT USING (true);
CREATE POLICY "Warnings are viewable by everyone" ON public.animal_warnings FOR SELECT USING (true);
CREATE POLICY "Checklists are viewable by everyone" ON public.checklist_templates FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own progress" ON public.user_checklist_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.user_checklist_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_checklist_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own progress" ON public.user_checklist_progress FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own favorites" ON public.user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON public.user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON public.user_favorites FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own chat history" ON public.ai_chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat history" ON public.ai_chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$;

-- Trigger for creating profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_animals_updated_at
  BEFORE UPDATE ON public.animals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
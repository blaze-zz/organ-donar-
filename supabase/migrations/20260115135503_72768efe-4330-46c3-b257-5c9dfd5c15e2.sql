-- Create role enum
CREATE TYPE public.user_role AS ENUM ('admin', 'doctor', 'user');

-- Create organ type enum
CREATE TYPE public.organ_type AS ENUM ('heart', 'kidney', 'liver', 'lungs', 'pancreas', 'intestines', 'corneas', 'skin', 'bone_marrow');

-- Create request status enum
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected', 'completed', 'cancelled');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  blood_group TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);

-- Create hospitals table
CREATE TABLE public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact_phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  specialization TEXT,
  license_number TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create organ_donations table (users donating organs)
CREATE TABLE public.organ_donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  organ_type organ_type NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  assigned_doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  status request_status DEFAULT 'pending' NOT NULL,
  otp_verified BOOLEAN DEFAULT false,
  otp_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create organ_requests table (users requesting organs)
CREATE TABLE public.organ_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  organ_type organ_type NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  assigned_doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  urgency_level INTEGER DEFAULT 1 CHECK (urgency_level BETWEEN 1 AND 5),
  status request_status DEFAULT 'pending' NOT NULL,
  medical_condition TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create organ_inventory table (available organs in hospitals)
CREATE TABLE public.organ_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organ_type organ_type NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE NOT NULL,
  donation_id UUID REFERENCES public.organ_donations(id) ON DELETE SET NULL,
  is_available BOOLEAN DEFAULT true,
  collected_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organ_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organ_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organ_inventory ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Hospitals policies
CREATE POLICY "Anyone can view hospitals" ON public.hospitals
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage hospitals" ON public.hospitals
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Doctors policies
CREATE POLICY "Anyone can view doctors" ON public.doctors
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage doctors" ON public.doctors
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Doctors can update own record" ON public.doctors
  FOR UPDATE USING (auth.uid() = user_id);

-- Organ donations policies
CREATE POLICY "Users can view own donations" ON public.organ_donations
  FOR SELECT USING (auth.uid() = donor_id);

CREATE POLICY "Users can create donations" ON public.organ_donations
  FOR INSERT WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Users can update own donations" ON public.organ_donations
  FOR UPDATE USING (auth.uid() = donor_id);

CREATE POLICY "Admins can manage all donations" ON public.organ_donations
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Doctors can view assigned donations" ON public.organ_donations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.doctors d
      WHERE d.user_id = auth.uid() AND d.id = assigned_doctor_id
    )
  );

CREATE POLICY "Doctors can update assigned donations" ON public.organ_donations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.doctors d
      WHERE d.user_id = auth.uid() AND d.id = assigned_doctor_id
    )
  );

-- Organ requests policies
CREATE POLICY "Users can view own requests" ON public.organ_requests
  FOR SELECT USING (auth.uid() = requester_id);

CREATE POLICY "Users can create requests" ON public.organ_requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update own requests" ON public.organ_requests
  FOR UPDATE USING (auth.uid() = requester_id);

CREATE POLICY "Admins can manage all requests" ON public.organ_requests
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Doctors can view assigned requests" ON public.organ_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.doctors d
      WHERE d.user_id = auth.uid() AND d.id = assigned_doctor_id
    )
  );

CREATE POLICY "Doctors can update assigned requests" ON public.organ_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.doctors d
      WHERE d.user_id = auth.uid() AND d.id = assigned_doctor_id
    )
  );

-- Organ inventory policies
CREATE POLICY "Anyone can view available organs" ON public.organ_inventory
  FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage inventory" ON public.organ_inventory
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Doctors can update inventory" ON public.organ_inventory
  FOR UPDATE USING (public.has_role(auth.uid(), 'doctor'));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hospitals_updated_at
  BEFORE UPDATE ON public.hospitals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organ_donations_updated_at
  BEFORE UPDATE ON public.organ_donations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organ_requests_updated_at
  BEFORE UPDATE ON public.organ_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile and assign role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
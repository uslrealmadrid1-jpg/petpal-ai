-- Remove any public access policies on login_logs
DROP POLICY IF EXISTS "Public read access" ON login_logs;
DROP POLICY IF EXISTS "Enable read access for all users" ON login_logs;
DROP POLICY IF EXISTS "Anyone can read" ON login_logs;
DROP POLICY IF EXISTS "public_read" ON login_logs;

-- Remove any public access policies on profiles
DROP POLICY IF EXISTS "Public read access" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Anyone can read" ON profiles;
DROP POLICY IF EXISTS "public_read" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Ensure RLS is enabled on both tables
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
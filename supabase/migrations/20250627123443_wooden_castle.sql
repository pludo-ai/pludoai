/*
  # Fix Users Table RLS Policy

  1. Security Updates
    - Drop existing incorrect policies that use `uid()` instead of `auth.uid()`
    - Create new policies using proper `auth.uid()` function
    - Ensure authenticated users can manage their own user records

  2. Policy Changes
    - Users can insert their own data (INSERT policy)
    - Users can read their own data (SELECT policy) 
    - Users can update their own data (UPDATE policy)
*/

-- Drop existing policies that may be using incorrect uid() function
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create new policies with correct auth.uid() function
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
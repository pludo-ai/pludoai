/*
  # Add INSERT policy for users table

  1. Security
    - Add policy for authenticated users to insert their own user records
    - This allows the application to create user records when users sign up

  This migration adds the missing INSERT policy that was causing RLS violations
  when trying to create new user records.
*/

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
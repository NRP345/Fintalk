-- Create user_interests table
CREATE TABLE IF NOT EXISTS user_interests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMP,
  notes TEXT,
  contact_preference TEXT DEFAULT 'email'
);
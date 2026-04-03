CREATE TYPE gender AS ENUM('male', 'female', 'non_binary', 'prefer_not_to_say');

CREATE TABLE users (
	id TEXT PRIMARY KEY NOT NULL,
	username TEXT UNIQUE NOT NULL,
	name TEXT NOT NULL,
	age integer NOT NULL,
  gender gender NOT NULL, 
	avatar_url TEXT DEFAULT '', -- remove default here after drizzle fix
	bio TEXT DEFAULT '', -- remove default here after drizzle fix
	is_active boolean DEFAULT true NOT NULL,
	created_at TIMESTAMP DEFAULT now(),
	updated_at TIMESTAMP DEFAULT now(),
);

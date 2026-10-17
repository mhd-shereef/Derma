-- Initialize database with proper permissions for derma_ai user
-- This runs automatically when PostgreSQL container starts

-- Grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE derma_ai TO derma_ai;

-- Grant schema permissions (required in PostgreSQL 15+)
\c derma_ai;

GRANT ALL ON SCHEMA public TO derma_ai;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO derma_ai;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO derma_ai;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO derma_ai;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO derma_ai;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO derma_ai;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO derma_ai;

-- Make derma_ai owner of public schema (optional but helpful)
-- ALTER SCHEMA public OWNER TO derma_ai;
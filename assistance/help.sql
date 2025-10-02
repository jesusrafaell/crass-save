ALTER TABLE public.ws_users
ADD CONSTRAINT unique_identity_mobile_email
UNIQUE (identity_document, mobile, email);

CREATE TABLE IF NOT EXISTS public.ws_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identity_document VARCHAR(255) NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    identity_document_path VARCHAR(255),
    country_key integer NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM now()),
    updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM now())
);

ALTER TABLE public.a_assistance_requests
DROP CONSTRAINT IF EXISTS fk_a_assistance_requests_user;

ALTER TABLE public.a_assistance_requests
ADD CONSTRAINT fk_ws_user_id

FOREIGN KEY (ws_user_id) REFERENCES public.ws_users(id)
ON DELETE SET NULL;

ALTER TABLE public.a_vehicles
ADD COLUMN IF NOT EXISTS ws_user_id UUID;

ALTER TABLE public.a_assistance_requests
ADD COLUMN IF NOT EXISTS ws_user_id UUID;

ALTER TABLE public.a_assistance_requests
DROP COLUMN IF EXISTS ws;

CREATE TRIGGER trigger_update_timestamp
BEFORE UPDATE ON public.ws_users
FOR EACH ROW

ALTER TABLE public.a_vehicles
DROP COLUMN IF EXISTS is_ws;

ALTER TABLE public.a_vehicles
ADD COLUMN is_ws boolean DEFAULT false;


--------------------------------------------------------------





-- date unix 
ALTER TABLE public.a_vehicles
ALTER COLUMN created_at SET DEFAULT (extract(epoch from now())::bigint),
ALTER COLUMN updated_at SET DEFAULT (extract(epoch from now())::bigint);

-- update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = EXTRACT(epoch FROM now())::bigint;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- update triger active function to update
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.a_vehicles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.ws_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ws TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    req_id UUID NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
);

CREATE TRIGGER trigger_update_timestamp
BEFORE UPDATE ON public.ws_users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();




ALTER TABLE public.u_users 
ADD COLUMN ws text;  

ALTER TABLE public.u_users 
ADD COLUMN is_ws boolean DEFAULT false;

CREATE UNIQUE INDEX u_users_ws_unique ON public.u_users (ws) WHERE ws IS NOT NULL;
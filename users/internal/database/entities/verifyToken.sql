CREATE TABLE IF NOT EXISTS u_verify_tokens
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    token varchar(255),
    type varchar(100) NOT NULL,
    created_at bigint DEFAULT EXTRACT(epoch FROM CURRENT_TIMESTAMP),
    updated_at bigint DEFAULT EXTRACT(epoch FROM CURRENT_TIMESTAMP),
    CONSTRAINT u_verify_token_pkey PRIMARY KEY (id),
    CONSTRAINT u_verify_token_token_key UNIQUE (token),
    CONSTRAINT u_verify_token_user_id_fkey FOREIGN KEY (user_id) REFERENCES u_users (id)
)

-- -- 1. Eliminar la restricción UNIQUE en la columna 'token'
-- ALTER TABLE public.u_verify_tokens
-- DROP CONSTRAINT u_verify_token_token_key;

-- -- 2. Modificar la columna 'token' para permitir valores NULL
-- ALTER TABLE public.u_verify_tokens
-- ALTER COLUMN token DROP NOT NULL;
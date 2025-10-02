CREATE TABLE IF NOT EXISTS public.userxparking
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    id_user uuid NOT NULL,
    id_parking uuid NOT NULL,
    CONSTRAINT userxparking_pkey PRIMARY KEY (id),
    CONSTRAINT userxparking_key UNIQUE (id_user),
    CONSTRAINT fk_user_id FOREIGN KEY (id_user)
        REFERENCES public.auth_users (id) ON DELETE CASCADE
);

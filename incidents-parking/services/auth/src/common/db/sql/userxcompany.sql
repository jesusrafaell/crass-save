CREATE TABLE IF NOT EXISTS public.userxcompany
(
    id         uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    id_user    uuid NOT NULL,
    id_company uuid NOT NULL,
    CONSTRAINT userxcompany_pkey PRIMARY KEY (id),
    CONSTRAINT userxcompany_key UNIQUE (id_user),
    CONSTRAINT fk_user_id FOREIGN KEY (id_user)
        REFERENCES public.auth_users (id) ON DELETE CASCADE
);

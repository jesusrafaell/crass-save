CREATE TABLE IF NOT EXISTS public.auth_roles
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    deleted_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    name varchar(100) ,
    CONSTRAINT auth_roles_pkey PRIMARY KEY (id),
    CONSTRAINT auth_roles_key UNIQUE (name)
)




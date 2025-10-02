CREATE TABLE IF NOT EXISTS public.status
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    deleted_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    es character varying(100),
    en character varying(100), 
    CONSTRAINT status_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS pkl_services
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    "key" INTEGER NOT NULL UNIQUE,
    en varchar(250) NOT NULL,
    es varchar(250) NOT NULL,
    CONSTRAINT services_pkey PRIMARY KEY (id)
)
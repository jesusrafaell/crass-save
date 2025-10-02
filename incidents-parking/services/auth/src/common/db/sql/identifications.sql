

CREATE TABLE IF NOT EXISTS public.auth_identifications
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    deleted_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    type_id uuid REFERENCES types(id),
    image_path  varchar(250),
    CONSTRAINT auth_identifications_pkey PRIMARY KEY (id),
    CONSTRAINT idx_auth_identifications_image_path UNIQUE (image_path),
    
)


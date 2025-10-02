CREATE TABLE IF NOT EXISTS public.driverxcompany
(
    id         uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    id_driver    uuid NOT NULL,
    id_company uuid NOT NULL,
    CONSTRAINT driverxcompany_pkey PRIMARY KEY (id),
    CONSTRAINT fk_driver_id FOREIGN KEY (id_driver)
        REFERENCES public.auth_users (id) ON DELETE CASCADE
);

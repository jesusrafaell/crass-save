CREATE TABLE IF NOT EXISTS public.licensePlatexcompany
(
    id         uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    licensePlate varchar(100) NOT NULL,
    id_company uuid NOT NULL,
    CONSTRAINT licensePlatexcompany_pkey PRIMARY KEY (id),
    CONSTRAINT fk_company_id FOREIGN KEY (id_company)
        REFERENCES public.pkl_companies (id) ON DELETE CASCADE
);

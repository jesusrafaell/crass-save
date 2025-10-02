CREATE TABLE IF NOT EXISTS pkl_companies
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) NOT NULL,
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) NOT NULL,
    name    varchar(100) NOT NULL,
    doc     varchar(100) NOT NULL
    email   varchar(150) NOT NULL,
    credits NUMERIC(20,2) DEFAULT 0 NOT NUll,
    description varchar(100) NOT NULL,
    CONSTRAINT companies_pkey PRIMARY KEY (id)
)


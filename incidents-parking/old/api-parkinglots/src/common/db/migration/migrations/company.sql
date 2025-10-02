CREATE TABLE IF NOT EXISTS pkl_companies
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    name varchar(100),
    description varchar(100),
    CONSTRAINT companies_pkey PRIMARY KEY (id)
)


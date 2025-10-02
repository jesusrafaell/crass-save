CREATE TABLE IF NOT EXISTS pkl_products
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    en varchar(100) NOT NULL,
    es varchar(100) NOT NULL,
    fr varchar(100) NOT NULL,
    price numeric(15,2) NOT NULL,
    credits numeric(15,2) NOT NULL,
    CONSTRAINT products_pkey PRIMARY KEY (id)
)

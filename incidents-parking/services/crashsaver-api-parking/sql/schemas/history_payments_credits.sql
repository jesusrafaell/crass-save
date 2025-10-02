CREATE TABLE IF NOT EXISTS history_payments_credits
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_companies uuid REFERENCES pkl_companies(id),
    id_products uuid REFERENCES pkl_products(id),
    id_user varchar(100) NOT NULL,
    description varchar(255) Null,
    CONSTRAINT history_payments_credits_pkey PRIMARY KEY (id)
)
CREATE TABLE IF NOT EXISTS u_companies (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name varchar(255) NOT NULL,
    key serial NOT NULL,
    created_at bigint DEFAULT EXTRACT(epoch FROM CURRENT_TIMESTAMP),
    updated_at bigint DEFAULT EXTRACT(epoch FROM CURRENT_TIMESTAMP),
    CONSTRAINT u_companies_pkey PRIMARY KEY (id),
    CONSTRAINT u_companies_name_key UNIQUE (name),
    CONSTRAINT u_companies_key UNIQUE (key)
);

CREATE TABLE IF NOT EXISTS a_companies (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name varchar(255) NOT NULL,
    key serial NOT NULL,
    created_at bigint DEFAULT EXTRACT(epoch FROM CURRENT_TIMESTAMP),
    updated_at bigint DEFAULT EXTRACT(epoch FROM CURRENT_TIMESTAMP),
    CONSTRAINT a_companies_pkey PRIMARY KEY (id),
    CONSTRAINT a_companies_name_key UNIQUE (name),
    CONSTRAINT a_companies_key UNIQUE (key)
);

CREATE TABLE IF NOT EXISTS u_usersxcompanies (
    user_id uuid NOT NULL,
    company_id uuid NOT NULL,
    PRIMARY KEY (user_id, company_id),
    FOREIGN KEY (user_id) REFERENCES u_users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES a_companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS u_driverxcompanies (
    driver_id uuid NOT NULL,
    company_id uuid NOT NULL,
    PRIMARY KEY (driver_id, company_id),
    FOREIGN KEY (driver_id) REFERENCES u_users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES a_companies(id) ON DELETE CASCADE
);
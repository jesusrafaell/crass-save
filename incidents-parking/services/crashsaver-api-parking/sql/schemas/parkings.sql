CREATE TABLE IF NOT EXISTS pkl_parkings
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) NOT NULL,
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) NOT NULL,
    country varchar(100) NOT NULL,
    name varchar(100) NOT NULL,
    address varchar(250) NOT NULL,
    available_space INTEGER DEFAULT 0 NOT NULL,
    id_status uuid NOT NULL,
    location GEOGRAPHY(Point, 4326), -- PostGIS
    CONSTRAINT parkings_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_parkings_location
ON pkl_parkings USING GIST (location);

/*
location=ST_SetSRID(ST_MakePoint(1.9459775306841975, 50.94125924925229), 4326)
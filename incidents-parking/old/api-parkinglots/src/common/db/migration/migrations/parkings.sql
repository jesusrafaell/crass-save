CREATE TABLE IF NOT EXISTS pkl_parkings
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    country varchar(100),
    name varchar(100),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    address varchar(250) NOT NULL,
    available_space varchar(100),
    id_status uuid,
    location GEOGRAPHY(Point, 4326), -- PostGIS
    CONSTRAINT parkings_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_parkings_location
ON pkl_parkings USING GIST (location);

CREATE OR REPLACE FUNCTION set_default_status()
RETURNS TRIGGER AS $$
BEGIN
    NEW.id_status := (SELECT id
	FROM public.status where en = 'active');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_default_status_trigger
BEFORE INSERT ON pkl_parkings
FOR EACH ROW EXECUTE FUNCTION set_default_status();


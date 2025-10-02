CREATE TABLE IF NOT EXISTS pkl_parkings_services
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    id_service uuid NOT NULL,
    id_parking uuid NOT NULL,
    id_status uuid NOT NULL,
    price numeric(15,2) NOT NULL,
    CONSTRAINT parkingsservices_pkey PRIMARY KEY (id),
    CONSTRAINT parkings_services_id_parking_fkey FOREIGN KEY (id_parking)
        REFERENCES pkl_parkings (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT parkings_services_id_service_fkey FOREIGN KEY (id_service)
        REFERENCES pkl_services (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE OR REPLACE FUNCTION set_default_status()
RETURNS TRIGGER AS $$
BEGIN
    NEW.id_status := (SELECT id
	FROM public.status where en = 'active');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_default_status_trigger
BEFORE INSERT ON pkl_parkings_services
FOR EACH ROW EXECUTE FUNCTION set_default_status();
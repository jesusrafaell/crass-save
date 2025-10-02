CREATE TABLE IF NOT EXISTS pkl_reservation
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    id_user uuid NOT NULL,
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    init_time  bigint NOT NULL,
    end_time   bigint NOT NULL,
    hours INTEGER,
    license_plate varchar(50) NOT NULL,
    price numeric(15,2) NOT NULL,
    id_parking uuid NOT NULL,
    id_status uuid,
    id_services uuid[] NOT NULL,
    description varchar(250),
    CONSTRAINT reservation_id_parking_fkey FOREIGN KEY (id_parking)
        REFERENCES pkl_parkings (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT reservation_id_status_fkey FOREIGN KEY (id_status)
        REFERENCES public.status (id) MATCH SIMPLE
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
BEFORE INSERT ON pkl_reservation
FOR EACH ROW EXECUTE FUNCTION set_default_status();
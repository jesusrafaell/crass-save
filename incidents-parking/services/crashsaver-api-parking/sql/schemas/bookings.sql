CREATE TABLE IF NOT EXISTS pkl_bookings
(
    id uuid    NOT NULL DEFAULT uuid_generate_v4(),
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) NOT NULL,
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) NOT NULL,
    init_time  bigint NOT NULL,
    end_time   bigint NOT NULL,
    description varchar(250) NOT NULL,
    hours      INTEGER NOT NULL,
    price      numeric(15,2) NOT NULL,
    id_company uuid NOT NULL,
    id_user    uuid NOT NULL,
    id_driver  uuid,
    id_parking uuid NOT NULL,
    id_status  uuid NOT NULL,
    id_services uuid[] NOT NULL,
    license_plate varchar(50) NOT NULL,
    lp_container  varchar(50) NOT NULL,
    CONSTRAINT bookings_id_parking_fkey FOREIGN KEY (id_parking)
        REFERENCES pkl_parkings (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT bookings_id_company_fkey FOREIGN KEY (id_company)
        REFERENCES pkl_companies (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT bookings_id_status_fkey FOREIGN KEY (id_status)
        REFERENCES public.status (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- CREATE OR REPLACE FUNCTION set_default_status()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.id_status := (SELECT id
-- 	FROM public.status where en = 'active');
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER set_default_status_trigger
-- BEFORE INSERT ON pkl_bookings
-- FOR EACH ROW EXECUTE FUNCTION set_default_status();
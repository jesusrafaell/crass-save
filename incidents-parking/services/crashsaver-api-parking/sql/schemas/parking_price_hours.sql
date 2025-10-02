CREATE TABLE IF NOT EXISTS pkl_parkings_price_hours
(
    created_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) NOT NULL,
    updated_at bigint DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) NOT NULL,
    parking_id uuid NOT NULL,
    hours      INTEGER NOT NULL,
    price      numeric(15,2) NOT NULL,
    CONSTRAINT parkings_price_hours_id_parking_fkey FOREIGN KEY (parking_id)
        REFERENCES pkl_parkings (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

/*
INSERT INTO public.pkl_parkings_price_hours(parking_id, hours, price)
	VALUES ('071d76ac-e8b9-49c9-82d0-c7e77739d524', 9, 17.00);
INSERT INTO public.pkl_parkings_price_hours(parking_id, hours, price)
	VALUES ('071d76ac-e8b9-49c9-82d0-c7e77739d524', 12, 23.00);
INSERT INTO public.pkl_parkings_price_hours(parking_id, hours, price)
	VALUES ('071d76ac-e8b9-49c9-82d0-c7e77739d524', 24, 24.00);

//check
SELECT 
    p.id, 
    p.name, 
    pph.hours, 
    pph.price 
FROM pkl_parkings p
JOIN public.pkl_parkings_price_hours pph ON p.id = pph.parking_id
CREATE TABLE u_identity_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- UUID como clave primaria, generado automáticamente
    user_id UUID NOT NULL,                          -- UUID del usuario, no puede ser nulo
    document_type_id UUID NOT NULL,                 -- UUID del tipo de documento, no puede ser nulo
    document_number VARCHAR(255) NOT NULL,          -- Número de documento
    path VARCHAR(255) NOT NULL,                     -- Ruta del archivo asociado al documento
    created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())),  -- Fecha de creación, Unix timestamp generado automáticamente
    updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())),  -- Fecha de actualización, Unix timestamp generado automáticamente
    CONSTRAINT unique_u_identity_documents UNIQUE (user_id, document_type_id, document_number),  -- Restricción de unicidad
 	CONSTRAINT fk_document_type FOREIGN KEY (document_type_id) REFERENCES u_identification_types(id) ON DELETE CASCADE  -- Relación de clave foránea
);

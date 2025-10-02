export interface StatusDB {
    id: string; // UUID in PostgreSQL 
    es: string;
    en: string;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
}

export interface Status {
    id: string;
    name: string;
}

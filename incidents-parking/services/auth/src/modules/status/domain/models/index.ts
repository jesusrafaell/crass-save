export interface StatusDB {
	id: string; // UUID in PostgreSQL
	es: string;
	en: string;
}

export interface Status {
	id: string;
	name: string;
}

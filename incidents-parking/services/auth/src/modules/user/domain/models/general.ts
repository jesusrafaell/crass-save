type IdentType = 'passport' | 'dni';

export interface Role {
	id: string;
	name: string;
	key: string; //number
}

export interface OS {
	id: string;
	name: string;
	key: number;
}

export interface TransportTypes {
	id:   string;
	name: string;
	key:  number;
}

export interface Identification {
	type: IdentType;
	image: string;
}

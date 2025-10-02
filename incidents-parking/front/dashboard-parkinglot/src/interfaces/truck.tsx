export interface Role {
	id: string;
	key: string;
	name: string;
}

export interface Status {
	id: string;
	name: string;
}

export interface TransportType {
	id: string;
	key: number;
	name: string;
}

export interface Data {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	mobile: string;
	distance_radius: number;
	utc: string;
	fcm_token: string;
	guest: boolean;
	id_roles: string[];
	roles: Role[];
	id_os: string;
	id_status: string;
	status: Status;
	id_transport_type: string;
	transportType: TransportType;
	created_time: string;
	updated_time: string;
}

export interface IGetAll {
	data: Data[];
	ok: boolean;
}

export interface IAddTruck {
	companyId: string;
	token: string;
}

export interface IVerifyTruck {
	companyId: string;
	token: string;
}

export interface IRegisterTruckDriver {
	token: string;
	message: string;
}

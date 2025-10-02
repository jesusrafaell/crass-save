import listCodeErrors from "../../utils/listCodeErrors";

export const loginSchema = {
	body: {
		type: 'object',
		required: ['email', 'password', 'so'],
		properties: {
			email: {
				type: 'string',
				format: 'email',
				errorMessage: listCodeErrors.email.code,
			},
			password: {
				type: 'string',
				minLength: 8,
				maxLength: 20,
				errorMessage: listCodeErrors.password.code,
			},
			so: {
				type: 'string',
				errorMessage: listCodeErrors.string.code,
			},
		},
	},
	additionalProperties: false,
	errorMessage: {
		required: listCodeErrors.empty.code,
	},
};


export const loginGuestSchema = {
	body: {
		type: 'object',
		required: ['utc', 'so'],
		properties: {
			utc: {
				type: 'string',
				errorMessage: listCodeErrors.string.code,
			},
			so: {
				type: 'string',
				errorMessage: listCodeErrors.string.code,
			},
		},
	},
	additionalProperties: false,
	errorMessage: {
		required: listCodeErrors.empty.code,
	},
};

export const loginTruckSchema = {
	body: {
		type: 'object',
		required: ['email', 'password', 'licensePlate' ,'so'],
		properties: {
			email: {
				type: 'string',
				format: 'email',
				errorMessage: listCodeErrors.email.code,
			},
			password: {
				type: 'string',
				minLength: 8,
				maxLength: 20,
				errorMessage: listCodeErrors.password.code,
			},
			licensePlate: {
				type: 'string',
				minLength: 3,
				maxLength: 9,
				errorMessage: listCodeErrors.string.code,
			},
			so: {
				type: 'string',
				errorMessage: listCodeErrors.string.code,
			},
		},
	},
	additionalProperties: false,
	errorMessage: {
		required: listCodeErrors.empty.code,
	},
};


export const loginParkingSchema = {
	body: {
		type: 'object',
		required: ['email', 'password', 'so', 'svc'],
		properties: {
			email: {
				type: 'string',
				format: 'email',
				errorMessage: listCodeErrors.email.code,
			},
			password: {
				type: 'string',
				minLength: 8,
				maxLength: 20,
				errorMessage: listCodeErrors.password.code,
			},
			so: {
				type: 'string',
				errorMessage: listCodeErrors.string.code,
			},
			svc: {
				type: 'string',
				enum: ['parking', 'company'],
				errorMessage: listCodeErrors.string.code,
			},
		},
	},
	additionalProperties: false,
	errorMessage: {
		required: listCodeErrors.empty.code,
	},
};

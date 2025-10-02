import listCodeErrors from "../../utils/listCodeErrors";

export const forgetPasswordValidator = {
	body: {
		type: 'object',
		required: ['email'],
		properties: {
			email: {
				type: 'string',
				format: 'email',
				errorMessage: listCodeErrors.email.code,
			},
		},
	},
	additionalProperties: false,
	errorMessage: {
		required: listCodeErrors.empty.code,
	},
};
export const changePasswordByEmailValidator = {
	body: {
		type: 'object',
		required: ['token', 'password'],
		properties: {
			token: {
				type: 'string',
				errorMessage: listCodeErrors.email.code,
			},
			password: {
				type: 'string',
				minLength: 8,
				maxLength: 20,
				errorMessage: listCodeErrors.password.code,
			},
		},
	},
	additionalProperties: false,
	errorMessage: {
		required: listCodeErrors.empty.code,
	},
};

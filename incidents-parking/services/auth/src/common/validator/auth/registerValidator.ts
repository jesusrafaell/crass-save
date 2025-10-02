import listCodeErrors from "../../utils/listCodeErrors";

export const registerSchema = {
	body: {
		type: 'object',
		required: ['first_name', 'last_name', 'email', 'password', 'mobile', 'utc'],
		properties: {
			first_name: {
				type: 'string',
				pattern: '^[^0-9]+$',
				errorMessage: listCodeErrors.string.code,
			},
			last_name: {
				type: 'string',
				pattern: '^[^0-9]+$',
				errorMessage: listCodeErrors.onlyLetter.code,
			},
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
			mobile: {
				type: 'string',
				minLength: 1,
				errorMessage: listCodeErrors.string.code,
			},
			utc: {
				type: 'string',
				errorMessage: listCodeErrors.string.code,
			},
		},
		additionalProperties: false,
		errorMessage: {
			required: listCodeErrors.empty.code,
		},
	},
};
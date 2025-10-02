import listCodeErrors from "../../utils/listCodeErrors";

export const changePasswordValidation = {
	body: {
		type: 'object',
		required: ['id_user', 'new_password'],
		properties: {
			id_user: {
				type: 'string',
				minLength: 8,
				maxLength: 50,
				errorMessage: listCodeErrors.string.code,
			},
			new_password: {
				type: 'string',
				minLength: 8,
				maxLength: 50,
				errorMessage: listCodeErrors.password.code,
			},
		},
	},
	additionalProperties: false,
	errorMessage: {
		required: listCodeErrors.empty.code,
	},
};

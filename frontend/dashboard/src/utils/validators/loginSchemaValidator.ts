import { useTranslations } from 'next-intl';
import * as yup from 'yup';

export const useLoginSchema = () => {
	const messages = useTranslations('Login');
	const loginSchema = yup.object().shape({
		email: yup
			.string()
			.email(messages('invalidemail'))
			.required(messages('required', { field: messages('email') })),
		password: yup
			.string()
			.required(messages('required', { field: messages('password') }))
			.min(8, messages('minpassword'))
			.max(12, messages('maxpassword')),
	});
	return loginSchema;
};

import dotenvFlow from 'dotenv-flow';
import { Pool, types } from 'pg';

dotenvFlow.config({
  silent: true,
});

types.setTypeParser(1700, 'text', parseFloat);

const pool = new Pool({
	host: process.env.HOST_DB,
	database: process.env.NAME_DB,
	user: process.env.USER_DB,
	password: process.env.PASS_DB,
	port: Number(process.env.PORT_DB),
	ssl: {
		rejectUnauthorized: false, // Aceptar certificados autofirmados
	},
});



export default pool;

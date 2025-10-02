import { FastifyReply, FastifyRequest } from "fastify";
import pool from "../../common/db/config";
import { CompanyService } from "../../domain/services/company.service";
import ResponseFastifyAdapter from "../../common/adapters/responseFastifyAdapter";
import { Companies } from "../../domain/models/company";

export class CompanyController {
  constructor(
    private readonly responseAdapter = new ResponseFastifyAdapter(),
    private readonly companyService = new CompanyService()
  ) {}

  public getAll = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const companies = await this.companyService.getAll();
      return this.responseAdapter.successResponse(reply, companies);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public create = async (
    req: FastifyRequest<{ Body: Companies }>,
    reply: FastifyReply
  ) => {
    try {
      await this.companyService.create(req.body);
      return this.responseAdapter.successCreatedResponse(reply);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public getById = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const company = await this.companyService.getById(req.params.id);
      return this.responseAdapter.successResponse(reply, company);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };
}

// export const PostReservas = async (
// 	req: Request<
// 		any,
// 		Api.Resp,
// 		{
// 			license_plate: string;
// 		}
// 	>,
// 	res: Response<Api.Resp<{ token: string; data: any }> | any>,
// 	next: NextFunction
// ): Promise<void> => {
// 	try {
// 		const { license_plate } = req.body;

// 		//Conexion a BD
// 		const client = await pool.connect();

// 		const query = `SELECT
// 		r.id, r.id_usuario, r.created_at, r.fecha_hora_inicio, r.fecha_hora_finalizacion,
// 		r.horas_solicitadas, r.license_plate, r."price_$", r.id_parking, r.id_status, r.id_servicios, r.description,
// 		s.en,s.es,p.id, p.country, p.name, p.latitud, p.longitud, p.address, p.available_space,
// 		p.id_status

// 	  FROM
// 		public.reservation r
// 	  INNER JOIN
// 		public.status s ON r.id_status = s.id
// 	  INNER JOIN
// 		public.parkings p ON r.id_parking = p.id
// 	  WHERE
// 		r.license_plate = '${license_plate}'
// 	  `;
// 		const result = await client.query(query);
// 		// inserta new user

// 		//cerrar conexion
// 		client.release();

// 		// Response
// 		res.status(200).json({
// 			message: 'Consulta con Exito',
// 			info: result.rows,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

// export const RegisterParking = async (
// 	req: Request<
// 		any,
// 		Api.Resp,
// 		{
// 			country: string;
// 			name: string;
// 			latitud: string;
// 			longitud: string;
// 			address: string;
// 			available_space: number;
// 		}
// 	>,
// 	res: Response<Api.Resp<{ token: string; data: any }> | any>,
// 	next: NextFunction
// ): Promise<void> => {
// 	try {
// 		const { country, name, latitud, longitud, address, available_space } = req.body;
// 		console.log('LLEGO ESTO', country, name, latitud, longitud, address, available_space);

// 		//Conexion a BD
// 		const client = await pool.connect();

// 		const query = `INSERT INTO parkings(
// 			country, name, latitud, longitud, address,
// 		   available_space)
// 		   VALUES ( '${country}', '${name}', '${latitud}', '${longitud}', '${address}', '${available_space}')`;

// 		// inserta new user
// 		await client.query(query);

// 		//cerrar conexion
// 		client.release();

// 		// Response
// 		res.status(200).json({
// 			message: 'Registrado con Exito',
// 			// info:
// 			// token,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

// export const GetParking = async (
// 	req: Request<
// 		any,
// 		Api.Resp,
// 		{
// 			contry: string;
// 		}
// 	>,
// 	res: Response<Api.Resp<{ token: string; data: any }> | any>,
// 	next: NextFunction
// ): Promise<void> => {
// 	try {
// 		const { contry } = req.body;

// 		//Conexion a BD
// 		const client = await pool.connect();

// 		const query = `SELECT p.id, p.country, p.name, p.latitud, p.longitud, p.address, p.available_space, p.id_status, s.en, s.es
// 		FROM public.parkings p
// 		INNER JOIN public.status s ON p.id_status = s.id
// 		${contry.length < 1 ? ' ' : `where LOWER(p.country) = LOWER('${contry}') `}
// 		`;

// 		const result = await client.query(query);
// 		// inserta new user

// 		//cerrar conexion
// 		client.release();

// 		// Response
// 		res.status(200).json({
// 			message: 'Consulta con Exito',
// 			info: result.rows,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };
// export const GetParkingService = async (
// 	req: Request<
// 		any,
// 		Api.Resp,
// 		{
// 			id_parking: string;
// 		}
// 	>,
// 	res: Response<Api.Resp<{ token: string; data: any }> | any>,
// 	next: NextFunction
// ): Promise<void> => {
// 	try {
// 		const { id_parking } = req.body;

// 		//Conexion a BD
// 		const client = await pool.connect();

// 		const query = `select p.id, p.id_service, p.price, p.id_parking, p.id_status, s.en, s.es
// 		from parkings_services p
// 		INNER JOIN public.status s ON p.id_status = s.id

// 		${id_parking.length < 1 ? ' ' : `Where p.id_parking ='${id_parking}' `}
// 		`;

// 		const result = await client.query(query);
// 		// inserta new user

// 		//cerrar conexion
// 		client.release();

// 		// Response
// 		res.status(200).json({
// 			message: 'Consulta con Exito',
// 			info: result.rows,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

// export const RegisterService = async (
// 	req: Request<
// 		any,
// 		Api.Resp,
// 		{
// 			en: string;
// 			es: string;
// 		}
// 	>,
// 	res: Response<Api.Resp<{ token: string; data: any }> | any>,
// 	next: NextFunction
// ): Promise<void> => {
// 	try {
// 		const { en, es } = req.body;
// 		console.log('LLEGO ESTO', en, es);

// 		//Conexion a BD
// 		const client = await pool.connect();

// 		const query = `INSERT INTO services (
// 			en, es)
// 		   VALUES ( '${en}', '${es}' )`;

// 		// inserta new user
// 		await client.query(query);

// 		//cerrar conexion
// 		client.release();

// 		// Response
// 		res.status(200).json({
// 			message: 'Registrado con Exito',
// 			// info:
// 			// token,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

// export const GetService = async (
// 	req: Request<any, Api.Resp>,
// 	res: Response<Api.Resp<{ token: string; data: any }> | any>,
// 	next: NextFunction
// ): Promise<void> => {
// 	try {
// 		//Conexion a BD
// 		const client = await pool.connect();

// 		const query = ` select id, es, en from services `;

// 		const result = await client.query(query);
// 		// inserta new user

// 		//cerrar conexion
// 		client.release();

// 		// Response
// 		res.status(200).json({
// 			message: 'Consulta con Exito',
// 			info: result.rows,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

// export const RegisterParkingService = async (
// 	req: Request<
// 		any,
// 		Api.Resp,
// 		{
// 			id_service: string;
// 			price: number;
// 			id_parking: string;
// 		}
// 	>,
// 	res: Response<Api.Resp<{ token: string; data: any }> | any>,
// 	next: NextFunction
// ): Promise<void> => {
// 	try {
// 		const { id_service, price, id_parking } = req.body;
// 		console.log('LLEGO ESTO', id_service, price, id_parking);

// 		//Conexion a BD
// 		const client = await pool.connect();

// 		const query = `INSERT INTO parkings_services(
// 			id_service, price, id_parking)
// 		   VALUES ( '${id_service}' ,'${price}' ,'${id_parking}' )`;

// 		// inserta new user
// 		await client.query(query);

// 		//cerrar conexion
// 		client.release();

// 		// Response
// 		res.status(200).json({
// 			message: 'Registrado con Exito',
// 			// info:
// 			// token,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

// export const RegisterReservation = async (
// 	req: Request<
// 		any,
// 		Api.Resp,
// 		{
// 			id_usuario: string;
// 			ini_time: string;
// 			end_time: string;
// 			hours: number;
// 			license_plate: string;
// 			price: string;
// 			id_parking: string;
// 			id_services: string;
// 			description: string;
// 		}
// 	>,
// 	res: Response<Api.Resp<{ token: string; data: any }> | any>,
// 	next: NextFunction
// ): Promise<void> => {
// 	try {
// 		const { id_usuario, ini_time, end_time, hours, license_plate, price, id_parking, id_services, description } =
// 			req.body;
// 		// console.log(
// 		// 	'LLEGO ESTO',
// 		// 	id_usuario,
// 		// 	ini_time,
// 		// 	end_time,
// 		// 	hours,
// 		// 	license_plate,
// 		// 	price,
// 		// 	id_parking,
// 		// 	id_services,
// 		// 	description
// 		// );

// 		//Conexion a BD
// 		const client = await pool.connect();

// 		const query = `INSERT INTO public.reservation(
// 			id_usuario, ini_time, end_time, hours, license_plate, price, id_parking, id_services, description )
// 		   VALUES (   '${id_usuario}', '${ini_time}','${end_time}', '${hours}', '${license_plate}', '${price}', '${id_parking}', '{${id_services}}', '${description}') `;

// 		// inserta new user
// 		await client.query(query);

// 		//cerrar conexion
// 		client.release();

// 		// Response
// 		res.status(200).json({
// 			message: 'Registrado con Exito',
// 			// info:
// 			// token,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

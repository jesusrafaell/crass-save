import bcrypt from "bcrypt";
import { RegisterUser, RoleDB, User } from "../model/user";
import { DaoUserConnector } from "../../infra/connectors/daoUserConnector";
import { SchemaValidatorAdapter } from "../../../../common/adapters/schemaValidatorAdapter";
import { UserSchema } from "../model/userSchema";
import { MomentAdapter } from "../../../../common/adapters/momentAdapter";
import { RoleService } from "../../../role/domain/services/role.service";
import { v4 as uuidv4 } from 'uuid';

export class CreateUserService {
  private user!: User;
  private momentAdapter!: MomentAdapter;
  constructor(
    private readonly daoUserConnector = new DaoUserConnector(),
    private _schemaValidatorAdapter = new SchemaValidatorAdapter(),
    private readonly roleService = new RoleService(),
  ) {}

  public async createUser(data: RegisterUser) {
    try {
      //get role
      const role = await this.roleService.getByName("user");

      //create User format
      this.initializeUser(data, role);

      //passoword
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(this.user.password, saltRounds);
      this.user.password = passwordHash;

      this._schemaValidatorAdapter.compileSchema(UserSchema);
      this._schemaValidatorAdapter.verifySchema(this.user);

      return await this.daoUserConnector.createUser(this.user);
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  private initializeUser(data: RegisterUser, role: RoleDB) {
    this.momentAdapter = new MomentAdapter(data.utc);
    const currentTime = this.momentAdapter.dateUnix();

    this.user = {
      id: uuidv4(),
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      mobile: data.mobile,
      image: "",
      status: data.quest ? "activo" : "new",
      distance_radius: 1,
      role: {
        ...role,
        _id: role._id.toString(),
      },
      utc: data.utc,
      created_time: currentTime,
      updated_time: currentTime,
      fcm_token: "",
      is_guest: data.quest ? data.quest : false,
      transport_type: 0,
    };
  }
}

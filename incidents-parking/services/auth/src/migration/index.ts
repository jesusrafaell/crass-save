import dotenvFlow from "dotenv-flow";
import { MongoClient } from "mongodb";
import { UserRepoCore } from "./userRepo";
import { ClientBase } from "pg";
import { User } from "../modules/user/domain/models/user";
import { UserRepository } from "../modules/user/infraestructure/repository/userRepository";
import { postgressConnect } from "../common/db/config/configPosgre";
import { MongoConnection } from "../common/db/config/configMongo";
import { LocationService } from "../modules/location/domain/services/location.service";
import { error } from "console";
import { StatusRepository } from "../modules/status/infrastructure/repository/statusRepository";

export const dbNameCore = "crashsaver_core";

//connect to mongo
dotenvFlow.config({
  silent: true,
});

async function MongoCore(): Promise<MongoClient> {
  try {
    const URLConnection = process.env.MONGO_URI as string;
    const client = await MongoClient.connect(URLConnection, {});
    console.log("Connect mongo crashsaver_core");
    return client;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const migration = async () => {
  //db test
  try {
    await postgressConnect();
    new MongoConnection().connectionMongo();

    const client = await MongoCore();
    const userRepo = new UserRepoCore(client);
    const usersCore = await userRepo.getAllUser();

    const users: User[] = [];
    const activeId = "81a950d2-b6d6-4b5f-b5fb-420fa249e66c";
    const inactiveId = "e1e193ca-464d-444b-a591-498b1acc23b2";

    const rolUserId = "abf45b4c-ca6f-435b-b223-2246b74c2277";

    const transportTypeId = "75f9f25e-a04d-488e-945b-37392e445932";

    console.log("Total Users", usersCore.length);
    for (let i = usersCore.length - 1; i > 0; --i) {
      const user = usersCore[i];
      if (
        !user.is_guest &&
        (user.status === "activo" || user.status === "inactive") &&
        user.email !== ""
      ) {
        let valid = {
          mobile: false,
          fcm: false,
        };
        for (let item of users) {
          if (user.mobile === item.mobile) {
            valid.mobile = true;
          }
          if (user.fcm_token === item.fcm_token) {
            valid.fcm = true;
          }
          if (valid.fcm || valid.mobile) {
            break;
          }
        }

        if (!valid.mobile) {
          users.push({
            id: "",
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            mobile: user.mobile,
            id_status: user.status === "inactive" ? inactiveId : activeId, //get active or inactive
            id_os: null,
            os: null,
            id_transport_type: transportTypeId, //default
            fcm_token: valid.fcm ? null : user.fcm_token,
            id_roles: [rolUserId],
            utc: user.utc,
            guest: false,
            id_auth_identification: "",
            distance_radius: 1,
            created_time: user.created_time,
            updated_time: user.updated_time,
          });
        }
      }
    }

    console.log("Will Create:", users.length);

    const userRepository = new UserRepository();
    const locationService = new LocationService();
    for (let user of users) {
      //create user postgress
      const newUser = await userRepository.create(user);

      //location user mongo
      await locationService.create(
        { userLatitude: 0, userLongitude: 0 },
        newUser.id
      );

      console.log("Created:", user.email, newUser.id);
    }

    console.log("Users Created:", users.length);
  } catch (err) {
    console.log(error);
  } finally {
    process.exit();
  }
};

migration();

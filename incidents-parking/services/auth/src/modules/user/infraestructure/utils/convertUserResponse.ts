import { User } from "../../domain/models/user";
import { UserResponse } from "../../domain/models/userRes";

export const convertUserResponse = (user: User): UserResponse => {
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email || "",
    image: "",
    mobile: user.mobile || "",
    distance_radius: user.distance_radius,
    utc: user.utc,
    created_time: user.created_time,
    updated_time: user.updated_time,
    fcm_token: user.fcm_token ? user.fcm_token : "",
    status: user.status?.name || "",
    role: null,
    guest: user.guest,
    roles: user.roles || [],
    transportType: {
      type: user.transportType?.key || 0,
    },
  };
};

//always in english
export const queryDataUser = (userId?: string, email?: string): string => {
  let whereClause = "";
  if (userId) {
    whereClause = `WHERE u.id = '${userId}'`;
  } else if (email) {
    whereClause = `WHERE u.email = '${email}' `;
  }

  return `
        SELECT
            u.id as id,
            u.first_name as first_name,
            u.last_name as last_name,
            u.email as email,
            u.mobile as mobile,
            u.password as password,
            u.distance_radius as distance_radius,
            u.utc as utc,
            u.fcm_token as fcm_token,
            u.guest as guest,
            u.id_auth_roles as id_roles,
            jsonb_agg(
                jsonb_build_object(
                    'id', ar.id,
                    'name', ar.name,
                    'key', ar.key
                )
            ) AS roles,
            u.id_os as id_os,
            u.id_status as id_status,
            jsonb_build_object(
                'id', s.id,
                'name', s.en
            ) AS status,
            u.id_transport_type as id_transport_type,
            jsonb_build_object(
                'id', tt.id,
                'name', tt.name,
                'key', tt."key"
            ) AS "transportType",
            u.created_at as created_time,
            u.updated_at as updated_time
        FROM auth_users u
        JOIN status s ON u.id_status = s.id
        LEFT JOIN auth_roles ar ON ar.id = ANY(u.id_auth_roles)
        JOIN transport_types tt ON u.id_transport_type = tt.id
        ${whereClause}
        GROUP BY u.id, s.id, tt.id
    `;
};
export const queryDataUsers = (userId?: string, email?: string): string => {
  let whereClause = "";
  if (userId) {
    whereClause = `WHERE u.id in ( ${userId} )`;
  } else if (email) {
    whereClause = `WHERE u.email in ( ${email} )`;
  }

  return `
        SELECT
            u.id as id,
            u.first_name as first_name,
            u.last_name as last_name,
            u.email as email,
            u.mobile as mobile,
            u.password as password,
            u.distance_radius as distance_radius,
            u.utc as utc,
            u.fcm_token as fcm_token,
            u.guest as guest,
            u.id_auth_roles as id_roles,
            jsonb_agg(
                jsonb_build_object(
                    'id', ar.id,
                    'name', ar.name,
                    'key', ar.key
                )
            ) AS roles,
            u.id_os as id_os,
            u.id_status as id_status,
            jsonb_build_object(
                'id', s.id,
                'name', s.en
            ) AS status,
            u.id_transport_type as id_transport_type,
            jsonb_build_object(
                'id', tt.id,
                'name', tt.name,
                'key', tt."key"
            ) AS "transportType",
            u.created_at as created_time,
            u.updated_at as updated_time
        FROM auth_users u
        JOIN status s ON u.id_status = s.id
        LEFT JOIN auth_roles ar ON ar.id = ANY(u.id_auth_roles)
        JOIN transport_types tt ON u.id_transport_type = tt.id
        ${whereClause}
        GROUP BY u.id, s.id, tt.id
    `;
};
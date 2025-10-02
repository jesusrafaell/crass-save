interface PropertiesSchema {
  radius: { type: string; minimum: number; maximum: number; default: number };
  latitude: { type: string; minimum: number; maximum: number };
  longitude: { type: string; minimum: number; maximum: number };
}

interface RouteSchema {
  type: string;
  properties: PropertiesSchema;
  required: Array<keyof PropertiesSchema>;
}

interface RouteQuerystring {
  querystring: RouteSchema;
}

export const schema: RouteQuerystring = {
  querystring: {
    type: 'object',
    properties: {
      latitude: { type: 'number', minimum: -90, maximum: 90 },
      longitude: { type: 'number', minimum: -180, maximum: 180 },
      radius: { type: 'number', minimum: 50, maximum: 1000, default: 1000 },
    },
    required: ['latitude', 'longitude', 'radius'],
  },
};

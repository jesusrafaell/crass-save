const tokenRoles = [
  { name: "user", key: 1 },
  { name: "admin", key: 2 }, //superadmin front
  { name: "guest", key: 3 },
  { name: "truck", key: 4 },
  { name: "parking", key: 5 },
  { name: "company", key: 6 },
];

export const roleToStr = (roleKey: number): string => {
  const role = tokenRoles.find((r) => r.key === roleKey);
  return role ? role.name : "user";
};

export const strToRole = (roleName: string): number => {
  const role = tokenRoles.find((r) => r.name === roleName);
  return role ? role.key : 1;
};

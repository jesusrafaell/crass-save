//Base
export const baseEPUrl = `/api/v1`;
export const authUrl = `${baseEPUrl}/auth/login/manager`;
//Users
export const userUrl = `${baseEPUrl}/users`;
export const userDataUrl = `${userUrl}/data`;
export const driverDataUrl = `${userUrl}/driver/`;
//Assistance
export const assistUrl = `${baseEPUrl}/assistance`;
//Request
export const requestUrl = `${assistUrl}/requests`;
// Expense History
export const addExpense = `${assistUrl}/tow-truck/expense-history`;
export const getExpenseHistory = (towTruckId: string) =>
  `${assistUrl}/tow-truck/expense-history/${towTruckId}`;
//Currency
export const getCoins = `${assistUrl}/coins`;

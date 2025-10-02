//Base
export const baseEPUrl = `/v1/api`;
export const authUrl = `${baseEPUrl}/auth/login`;
export const parkingUrl = `${baseEPUrl}/parking`;
//Auth
export const loginTruck = `${authUrl}/truck`;
export const loginParking = `${authUrl}/parkinglot`;
//Booking
export const bookingUrl = `${parkingUrl}/booking`;
//Company
export const companyUrl = `${parkingUrl}/company`;
//Parking
export const parkingParkingUrl = `${parkingUrl}/parking`;
//Services
export const servicesUrl = `${parkingUrl}/services`;
export const servByParkingUrl = `${servicesUrl}/parking`;
export const getservicesByParking = `${servicesUrl}/parking`;
//status
export const statusUrl = `${parkingUrl}/status`;
//Products
export const productsUrl = `${parkingUrl}/products`;
export const buyProductsUrl = `${productsUrl}/buy`;
//Trucks (yaml jose pio)
export const baseTrucks = `${baseEPUrl}/users`;
export const userUrl = `${baseEPUrl}/user/data`;
export const truckListbyCompID = `${baseTrucks}/truck/all/`;
export const truckAdd = `${baseTrucks}/add-truck`;

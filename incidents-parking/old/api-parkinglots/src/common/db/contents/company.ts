import { Companies } from "../../../domain/models/company";
import { CompanyRepository } from "../../../infrastructure/repository/companyRepository";

// --CREATE EXTENSION IF NOT EXISTS postgis;

const listCompanies: Companies[] = [
    {
        id: "",
        name: "DHL",
        description: "Una empresa internacional de logística y mensajería que opera en España",
    },
    {
        id: "",
        name: "NACEX",
        description: "Compañía de mensajería y paquetería urgente que ofrece servicios en España y Portugal.",
    },
    {
        id: "",
        name: "TIPSA",
        description: "Otra empresa de mensajería y paquetería que presta servicios en toda España.",
    },
];

export const preCompanies  = async() =>{
    const repo = new CompanyRepository()
    for (let i of listCompanies) {
        await repo.create(i)
    }
    console.log('Already Companies', listCompanies.length)
}
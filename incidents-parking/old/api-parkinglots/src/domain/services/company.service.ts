import { CompanyRepository } from "../../infrastructure/repository/companyRepository";
import { Companies } from "../models/company";

export class CompanyService {
    constructor(
        private readonly companyRepository = new CompanyRepository(),
    ) {}

    public async getAll() {
        try {
            const companies = await this.companyRepository.getAll()
            return companies;
        } catch (err) {
            throw err;
        }
    }

    public async create(company: Companies) {
        try {
            //case when error
            await this.companyRepository.create(company)
        } catch (err) {
            throw err;
        }
    }


    public async getById(id: string) {
        try {
            const company = await this.companyRepository.getById(id)
            if (!company) {
                throw new Error("Not Found");
            }
            return company;
        } catch (err) {
            throw err;
        }
    }
}
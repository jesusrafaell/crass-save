import { preCompanies } from "./company"
import { preParkings } from "./parkings";
import { preParkingXServices } from "./parkings_services";
import { preServices } from "./services";

async function main() {
    try {
        // await preCompanies();
        // await preServices();
        // await preParkings();
        // await preParkingXServices();
        console.log("finish contents");
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

main()
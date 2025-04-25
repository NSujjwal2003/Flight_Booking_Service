const {StatusCodes} = require("http-status-codes");
const {AirportRepository} = require("../repositories");
const AppError = require("../utils/errors/app-error");

const airportRepository = new AirportRepository();

async function createAirport(data) {
    try{
        const airport = await airportRepository.create(data);
        return airport;
    } catch (error) {
        console.log(error);
        if(error.name == 'SequelizeValidationError'){
            let explaination = [];
            error.errors.forEach((err) => {
                explaination.push(err.message);
            });
            throw new AppError(explaination, StatusCodes.BAD_REQUEST);
        }
        throw new AppError("cant create a new airport object", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirports(){
    try{
        const airports = await airportRepository.getAll();
        return airports;
    }
    catch(error){
        throw new AppError("cant fetch data of all the airports", StatusCodes.INTERNAL_SERVER_ERROR);
    }
} 

async function getAirport(id){
    try{
        const airport = await airportRepository.get(id);
        return airport;
    }
    catch(error){
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError("the airport u req is not presnet", error.statusCode);
        }
        throw new AppError("cant fetch data of all the airport", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyAirport(id){
    try{
        const response = await airportRepository.destroy(id);
        return response;
    }
    catch(error){
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError("the airport u req to delete is not presenet", error.statusCode);
        }
        throw new AppError("cant destroy the airport", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function updateAirport(id, data){
    try{
        const airport = await airportRepository.update(id, data);
        return airport;
    }
    catch(error){
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError("the airport u req to update is not presenet", error.statusCode);
        }
        throw new AppError("cant fetch data of all the airport", StatusCodes.INTERNAL_SERVER_ERROR);
    }
} 


module.exports = {
    createAirport, 
    getAirports,
    getAirport,
    destroyAirport,
    updateAirport
}

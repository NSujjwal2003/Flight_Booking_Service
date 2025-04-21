const {StatusCodes} = require("http-status-codes");
const {CityRepository} = require("../repositories");
const AppError = require("../utils/errors/app-error");

const cityRepository = new CityRepository();

async function createCity(data) {
    try{
        const city = await cityRepository.create(data);
        return city;
    } catch (error) {
        console.log(error);
        if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
            let explaination = [];
            error.errors.forEach((err) => {
                explaination.push(err.message);
            });
            throw new AppError(explaination, StatusCodes.BAD_REQUEST);
        }
        throw new AppError("Cant create a new city object", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyCity(id){
    try{
        const response = await cityRepository.destroy(id);
        return response;
    }
    catch(error){
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError("the city u req to delete is not presenet", error.statusCode);
        }
        throw new AppError("cant fetch data of all the cities", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



async function updateCity(id, data){
    try{
        const city = await cityRepository.update(id, data);
        return city;
    }
    catch(error){
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError("the city u req to update is not presenet", error.statusCode);
        }
        throw new AppError("cant fetch data of all the city", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports = {
    createCity,
    destroyCity,
    updateCity
}

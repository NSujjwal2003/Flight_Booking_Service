const {StatusCodes} = require("http-status-codes");
const { Op } = require("sequelize");
const {FlightRepository} = require("../repositories");
const AppError = require("../utils/errors/app-error");

const flightRepository = new FlightRepository();

async function createFlight(data) {
    try{
        if(data.arrivalTime < data.departureTime){
            throw new AppError("arrival time should be greater than departure time", StatusCodes.BAD_REQUEST);
        }
        const flight = await flightRepository.create(data);
        return flight;
    } catch (error) {
        if(error instanceof AppError){
            throw error;
        }
        console.log(error);
        if(error.name == 'SequelizeValidationError'){
            let explaination = [];
            error.errors.forEach((err) => {
                explaination.push(err.message);
            });
            throw new AppError(explaination, StatusCodes.BAD_REQUEST);
        }
        throw new AppError("cant create a new flight object", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllFlights(query){
    let customFilter = {};
    let sortFilters = [];
    const endingTime = " 23:59:00";

    if(query.trips){
        [departureAirportId, arrivalAirportId] = query.trips.split("-");
        customFilter.departureAirportId = departureAirportId;
        customFilter.arrivalAirportId = arrivalAirportId;
    }

    if(query.price){
        [minPrice, maxPrice] = query.price.split("-");
        customFilter.price = {
            [Op.between] : [minPrice, ((maxPrice == undefined) ? 1000000 : maxPrice)] 
        };
    }

    if(query.travellers){
        customFilter.totalSeats = {
            [Op.gte] : query.travellers
        };
    }

    if(query.tripDate){
        customFilter.departureTime = {
            [Op.between] :  [query.tripDate, query.tripDate + endingTime]
        };
    }

    if(query.sort){
        const params = query.sort.split(',');
        sortFilters = params.map((param) => param.split('_'));
    }

    try {
        const flights = await flightRepository.getAllFlights(customFilter, sortFilters);
        return flights;
    } catch (error) {
        throw new AppError("can't fetch data of all the flights", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getFlight(id){
    try{
        const flight = await flightRepository.get(id);
        return flight;
    }
    catch(error){
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError("the flight u req is not presnet", error.statusCode);
        }
        throw new AppError("cant fetch data of all the flight", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = {
    createFlight, 
    getAllFlights,
    getFlight
}

const {Sequelize} = require("sequelize");
const CrudRepository = require("./crud-repository");
const { Flight, Airplane, Airport, City } = require("../models");
const db = require("../models");
const {addRowLockOnFlights} = require('./queries');

class FlightRepository extends CrudRepository {
  constructor() {
    super(Flight);
  }

  async getAllFlights(filter, sort){
    const response = await Flight.findAll({
      where: filter,
      order: sort,
      include: [
        {
          model: Airplane, 
          required: true,
          as: 'airplaneDetail',
        },
        {
          model: Airport, 
          required: true,
          as: 'departureAirport',
          on: {
            col1: Sequelize.where(
              Sequelize.col('Flight.departureAirportId'), '=', 
              Sequelize.col('departureAirport.code')
            ),
          },

          include:{
            model: City,
            required: true,
          }
        },
        {
          model: Airport, 
          required: true,
          as: 'arrivalAirport',
          on: {
            col1: Sequelize.where(
              Sequelize.col('Flight.arrivalAirportId'), '=', 
              Sequelize.col('arrivalAirport.code')
            ),
          },
          include:{
            model: City,
            required: true,
          }
        }
      ]
    });
    return response;
  }

  // async updateRemainingSeats(flightId, seats, dec = true){
  //   const flight = await Flight.findByPk(flightId);
  //   if(parseInt(dec)){
  //     await flight.decrement('totalSeats', { by: seats });
  //   } else {
  //     await flight.increment('totalSeats', { by: seats });
  //   }
  //   return flight;
  // }

  async updateRemainingSeats(flightId, seats, dec = true) {
    const transaction = await db.sequelize.transaction();
    try {
      await db.sequelize.query(addRowLockOnFlights(flightId));
      const flight = await Flight.findByPk(flightId);
  
      const shouldDecrement = dec === true || dec === 1 || dec === '1' || dec === 'true';
  
      if (shouldDecrement) {
          await flight.decrement('totalSeats', { by: seats }, {transaction: transaction});
      } else {
          await flight.increment('totalSeats', { by: seats }, {transaction: transaction});
      }
      await transaction.commit();
      return flight;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  }



}

module.exports = FlightRepository;



// dec missing	Decrease ✅
// dec = true	Decrease ✅
// dec = "true"	Decrease ✅
// dec = 1	Decrease ✅
// dec = "1"	Decrease ✅
// dec = false	Increase ✅
// dec = "false"	Increase ✅
// dec = 0	Increase ✅
// dec = "0"	Increase ✅
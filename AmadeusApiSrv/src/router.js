// router.js
const { API_KEY, API_SECRET } = require("./config");
const Amadeus = require("amadeus");
const express = require("express");
// Create router
const router = express.Router();
// ...
// Create Amadeus API client
const amadeus = new Amadeus({
    clientId: API_KEY,
    clientSecret: API_SECRET,
  });

const API = "api";
// default host:port response
router.get(`/`, async (req, res) => {  
  try {
    var runResponse ={"Running on port": "1338"}    
    await res.send(runResponse).json;
  } catch (err) {
    await res.json(err);
  }
});

// City search suggestions
router.get(`/${API}/city-search`, async (req, res) => {
  const { keyword } = req.query;
  if (keyword.length >= 3) {
    const response = await amadeus.referenceData.locations
      .get({
        keyword,
        subType: Amadeus.location.city,
      })
      .catch((err) => console.log(err));
    try {
      await res.json(JSON.parse(response.body));
    } catch (err) {
      await res.json(err);
    }
  }
  else{
    await res.send("Invalid data provided").json;
  }
});

//http://localhost:1338/city-and-airport-search/lax
router.get(`/city-and-airport-search/:parameter`, async (req, res) => {
  const parameter = req.params.parameter;
  // Which cities or airports start with the parameter variable
  await amadeus.referenceData.locations
      .get({
          keyword: parameter,
          subType: Amadeus.location.any,
      })
      .then(function (response) {
          res.send(response.result.data);
          //res.json(JSON.parse(response.body));
      })
      .catch(function (response) {
          res.send(response);
      });
});

// Search flight by origin and destination, departure date , return date, number of adult and max result.
router.get(`/flight-search`, (req, res) => {
  const originCode = req.query.originCode;
  const destinationCode = req.query.destinationCode;
  const dateOfDeparture = req.query.dateOfDeparture
  // Find the cheapest flights
 const response =  amadeus.shopping.flightOffersSearch.get({
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate: dateOfDeparture,
      adults: '1',
      max: '7'
  }).then(function (response) {
      res.send(response.result);
  }).catch(function (response) {
      res.send(response);      
  });
  });

  /* Async example =>  Search flight by origin and destination, departure date , return date, number of adult and max result.
  http://localhost:1338/async-flight-search?originCode=LAX&destinationCode=NAN&dateOfDeparture=2023-12-20&
  returnDate=2023-12-30&adults=2&children=2&max=5&currencyCode=FJD&nonStop=true  */

  /* One way flight with infant
  http://localhost:1338/async-flight-search?originCode=LAX&destinationCode=NAN&dateOfDeparture=2023-12-20&returndate=""
  &adults=1&children=2&infants=1&max=5&currencyCode=FJD&nonStop=true
  */
router.get(`/${API}/async-flight-search`, async(req, res) => {
  const originCode = req.query.originCode;
  const destinationCode = req.query.destinationCode;
  const dateOfDeparture = req.query.dateOfDeparture;  
  const dateOfReturn = req.query.dateOfReturn;
  const adults = req.query.adults;
  const children = req.query.children;
  const infants = req.query.infants;
  const maxResult = req.query.max;  
  const currencyCode =  req.query.currencyCode;
  const nonStop = req.query.nonStop;
  const travelClass = req.query.travelClass;

      try{
        // Find the cheapest flights
        console.log("Departyre date: Date.parse(dateOfDeparture) "+ Date.parse(dateOfDeparture))
        console.log("Return date : Date.parse(dateOfReturn) "+ Date.parse(dateOfReturn))
        if(Date.parse(dateOfReturn)<  Date.parse(dateOfDeparture)){
          console.log("Date.parse(dateOfReturn)<  Date.parse(dateOfDeparture)");
              
              const response = await amadeus.shopping.flightOffersSearch.get({
                originLocationCode: originCode,
                destinationLocationCode: destinationCode,
                departureDate: dateOfDeparture,
                //returnDate: dateOfReturn, // exclude return date if return date is not requiured or less than departure date.
                adults: adults,
                children: children,
                infants: infants,
                max: maxResult,
                currencyCode: currencyCode,
                nonStop: nonStop,
                travelClass: travelClass, 
      
              });
              await res.send(response.result);
        }else{
                  console.log("Date.parse(dateOfReturn)>= Date.parse(dateOfDeparture)");
                  const response = await amadeus.shopping.flightOffersSearch.get({
                    originLocationCode: originCode,
                    destinationLocationCode: destinationCode,
                    departureDate: dateOfDeparture,
                    returnDate: dateOfReturn,
                    adults: adults,
                    children: children,
                    infants: infants,
                    max: maxResult,
                    currencyCode: currencyCode,
                    nonStop: nonStop,
                    travelClass: travelClass, 
                    });
                    await res.send(response.result);
              }
      
    }
    catch (err) {
      await res.json(err);       
    }
  });

/* Confirming flight from flight offer data.
 Send the post request with body {}, data as raw and type as JSON. Refer example post data in ./public/flightpricingdata.txt
*/

  router.post(`/flight-confirmation`, async (req, res) => {
    const flight = req.body.flight;
    // Confirm availability and price
    try {
          const response = await amadeus.shopping.flightOffers.pricing.post(
            JSON.stringify({
              data: {
                type: "flight-offers-pricing",
                flightOffers: [flight],
              },
            })
          );
          await res.send(response.result);
    } 
    catch (err) {
        await res.json(err);
    }
  });


/* Book flight using confirmed flight data. */
router.post(`/flight-booking`, async (req, res) => {
  // Book a flight
  const flight = req.body.flight;
  const name = req.body.name;
  try {
    const response = await amadeus.booking.flightOrders.post(
      JSON.stringify({
        data: {
          type: "flight-order",
          flightOffers: [flight],
          travelers: [
            {
              id: "1",
              dateOfBirth: "1982-01-16",
              name: {
                firstName: "Ronald",
                lastName: "Test",
              },
              gender: "MALE",
              contact: {
                emailAddress: "jorge.gonzales833@telefonica.es",
                phones: [
                  {
                    deviceType: "MOBILE",
                    countryCallingCode: "34",
                    number: "480080076",
                  },
                ],
              },
              documents: [
                {
                  documentType: "PASSPORT",
                  birthPlace: "Madrid",
                  issuanceLocation: "Madrid",
                  issuanceDate: "2015-04-14",
                  number: "00000000",
                  expiryDate: "2025-04-14",
                  issuanceCountry: "ES",
                  validityCountry: "ES",
                  nationality: "ES",
                  holder: true,
                },
              ],
            },
          ],
        },
      })
    );

    await res.send(response.result);
  } catch (err) {
    await res.json(err);
  }
});


module.exports = router;
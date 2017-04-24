function ClaimsDataService($q) {
  let data = {
    claims: null,
    airlines: [],
    airportCodes: [],
    avgTotalLoss: {},
    years: []
  }

  const loadData = (claimsArray) => {
    data.claims = configureClaims(claimsArray);
    data.avgTotalLoss = avgValueLossByAirline();
  }

  const waitData = () => {
    let deferred = $q.defer();
    setTimeout(() => {
      if (true) {
        deferred.resolve(data);
      } else {
        deferred.reject(console.log('err'));
      }
    }, 1000);
    return deferred.promise;
  }

  const getData = () => {
    return data;
  }

  // arranges array of objects into JSON object
  // organized by date and extracts data to populate service
  const configureClaims = (claims) => {
    let airlinesObj = {}                               //using objects instead of arrays for uniqueness
    let airportCodeObj = {}
    let results = {};
    const numClaims = claims.length;                   //total number of claims for speed
    for (let i = 0; i < numClaims; i++) {
      if( isNaN(parseInt(claims[i]['Claim Number'])) ) { break; } //stop read if the Claim Number isn't a number

      let airline = claims[i]['Airline Name'].trim();
      if (airline === '-') {
        airline = 'Unknown'
      }

      airlinesObj[ airline ] = 1;   //value insignifant, just need keys
      airportCodeObj[ claims[i]['Airport Code'] ] = 1;

      let date = Date.parse( claims[i]['Incident Date'].split(" ")[0] ); //if Incident Date is date & time, only use date
      let year = new Date(date).getFullYear();
      let month = new Date(date).getMonth() + 1;       //add one to month per Date Object documentation

      if (!results[year]) {                            //if year hasn't been set yet
        results[year] = {};                            //make new object
        results[year][month] = [ claims[i] ];          //assign claim array
      } else {
        if (!results[year][month]) {                   //if month in that year hasn't been set yet
          results[year][month] = [ claims[i] ];        //assign claim array
        } else {                                       //otherwise
          results[year][month].push(claims[i]);        //add claim to array
        }
      }
    }

    data.airlines = Object.keys(airlinesObj);         //array of unique airline names
    data.airportCodes = Object.keys(airportCodeObj);  //array of unique airport codes
    data.claims = results                             //JSON object arranged by date
    data.years = Object.keys(data.claims)
    return results;
  }

  const avgValueLossByAirline = () => {
    if ((data.claims !== null) && (typeof data.claims === 'object')){
      let avgLoss = {
        'Global Average': {} //global average held next to all airlines
      }
      for (let year in data.claims) {
        avgLoss['Global Average'][year] = {}
        for (let month in data.claims[year]) {
          avgLoss['Global Average'][year][month] = []
          data.claims[year][month].forEach((claim) => { //for each claim in each month of each year

            let claimValue = parseFloat(claim['Close Amount'].replace('$', "").trim());
            if (claimValue > 0) { //only save claims with value
              avgLoss['Global Average'][year][month].push(claimValue) //add claim to global avg
              let airline = claim['Airline Name'].trim();
              if (airline === '-') {
                airline = 'Unknown'
              }

              if (!!avgLoss[airline]) {                           //build JSON object organized by airline
                if (!!avgLoss[airline][year]) {
                  if (!!avgLoss[airline][year][month]) {
                    avgLoss[airline][year][month].push(claimValue);  //if all found, add value to current monthly total
                  } else {                                        //otherwise, create object at appropriate level
                    avgLoss[airline][year][month] = [claimValue]
                  }
                } else {
                  avgLoss[airline][year] = {
                    [month]: [claimValue]
                  }
                }
              } else {
                avgLoss[airline] = {
                  [year]: {
                    [month]: [claimValue]
                  }
                }
              }
            }
          }); //end of data.claims loop
          for (let airline in avgLoss) { //calculate monthly average for each airline this month
            if (!!avgLoss[airline][year] && !!avgLoss[airline][year][month]) { //if claims exists for this year and month
              if (avgLoss[airline][year][month].length === 0) { //set to 0 if month exists but is empty
                avgLoss[airline][year][month] = 0;
              } else {
                avgLoss[airline][year][month] = avgLoss[airline][year][month].reduce( (total, amt, index, array) => {
                  total += amt;
                  if (index === array.length-1){
                    return (total/array.length).toFixed(2);
                  } else {
                    return total;
                  }
                });
              }
            }
          }
        } //end of month loop
      } //end of year loop
      return avgLoss;
    }
  }

  return {
    data: data,
    getData: getData,
    loadData: loadData,
    waitData: waitData
  }
}

angular
  .module('tsa')
  .service('ClaimsDataService', ClaimsDataService)

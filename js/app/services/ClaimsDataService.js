function ClaimsDataService() {
  let data = {
    claims: null,
    avgTotalLoss: {}
  }

  const loadData = (claimsArray) => {
    console.log('loading...');
    data.claims = organizeByDate(claimsArray);
    data.avgTotalLoss = calcAvgLossAllAirlines();
  }

  const getData = () => {
    return data;
  }

  const organizeByDate = (claims) => {                 //arranges array of objects into JSON object organized by date
    let results = {};
    const numClaims = claims.length;                   //total number of claims for speed
    for (let i = 0; i < numClaims; i++) {
      if( isNaN(parseInt(claims[i]['Claim Number'])) ) { break; } //stop read if the Claim Number isn't a number
      let date = Date.parse( claims[i]['Incident Date'].split(" ")[0] ); //if Incident Date is date & time, only use date
      let year = new Date(date).getFullYear();
      let month = new Date(date).getMonth() + 1;       //add one to month per Date Object

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
    return results;                                    //JSON object arranged by date
  }

  const calcAvgLossAllAirlines = () => {              //requires claims to be JSON object organized by date
    if ((data.claims !== null) && (typeof data.claims === 'object')){ //make sure claims have been loaded and converted to JSON object
      let avgTotalLoss = {};
      for (let year in data.claims) {
        avgTotalLoss[year] = {};
        for (let month in data.claims[year]) {
          avgTotalLoss[year][month] = 0; //sum for each month
          data.claims[year][month].forEach((claim) => {
            if (claim['Close Amount'] !== '-') {
              avgTotalLoss[year][month] += parseFloat(claim['Close Amount'].replace('$', ""));
            }
          });
          avgTotalLoss[year][month] =
              (avgTotalLoss[year][month]/data.claims[year][month].length).toFixed(2); //get average for month
        }
      }
      return avgTotalLoss;
    }
  }

  return {
    data: data,
    getData: getData,
    loadData: loadData
  }
}

angular
  .module('tsa')
  .service('ClaimsDataService', ClaimsDataService)

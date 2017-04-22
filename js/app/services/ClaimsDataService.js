function ClaimsDataService() {
  let data = {
    claims: null,
    avgTotalLoss: {}
  }

  const loadData = (claimsArray) => {
    data.claims = organizeByMonth(claimsArray);
    data.avgTotalLoss = calcAvgLossAllAirlines();
  }

  const getData = () => {
    return data;
  }

  const organizeByMonth = (claims) => {
    let results = {};
    const numClaims = claims.length;                   //get total number of claims
    for (let i = 0; i < numClaims; i++ ){
      let date = claims[i]['Incident Date'].split("-") //split date string by '-'
      date = Date.parse(date[1] + '1, 20' + date[2])   //save as date object
      let year = new Date(date).getFullYear();
      let month = new Date(date).getMonth() + 1;       //add one to month per Date Object
      if (!results[year]) {                            //if year hasn't been set yet
        results[year] = {};                            // make new object
        results[year][month] = [ claims[i] ];          //assign claim arry
      } else {
        if (!results[year][month]) {                   //if month in that year hasn't been set yet
          results[year][month] = [ claims[i] ];        //assign claim array
        } else {                                       //otherwise
          results[year][month].push(claims[i]);        //add claim to array
        }
      }
    }
    return results;
  }

  const calcAvgLossAllAirlines = () => { //relies on being organized by month
    if (data.claims !== null){ //make sure claims have been loaded
      avgTotalLoss = {};
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

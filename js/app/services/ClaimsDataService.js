function ClaimsDataService() {
  let data = {
    claims: null,
    averageLossAllAirlines: {}
  }

  const loadData = (claimsArray) => {
    data.claims = organizeByMonth(claimsArray);
    calcAvgLossAllAirlines();
  }

  const getData = () => {
    return data;
  }

  const organizeByMonth = (claims) => {
    let claimsByMonth = {};
    const numClaims = claims.length; //get total number of claims
    for (let i = 0; i < numClaims; i++ ){
      let date = claims[i]['Incident Date']
      date = date.substring(date.indexOf('-') + 1, date.length) //[DD, MM, YY]
      if (typeof claimsByMonth[date] === 'undefined'){
        claimsByMonth[date] = [ claims[i] ]; //create new array of claims if new month
      } else {
        claimsByMonth[date].push(claims[i]); //add to existing month of claims
      }
    }
    return claimsByMonth;
  }

  const calcAvgLossAllAirlines = () => {
    if (data.claims !== null){ //make sure claims have been loaded
      for (let month in data.claims){
        data.averageLossAllAirlines[month] = 0; //sum for each month
        data.claims[month].forEach((claim) => {
          if (claim['Close Amount'] !== '-') {
            data.averageLossAllAirlines[month] += parseFloat(claim['Close Amount'].replace('$', ""));
          }
        });
        data.averageLossAllAirlines[month] = (data.averageLossAllAirlines[month]/data.claims[month].length).toFixed(2); //get average for month
      }
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

function ClaimsDataService() {
  let data = {
    claims: null,
    claimsByMonth: {}
  }

  const loadData = (claimsArray) => {
    data.claims = claimsArray;
  }

  const getData = () => {
    return data;
  }

  const byMonth = (claims) => {
    const numClaims = claims.length; /*get total number of claims */
    for (let i = 0; i < numClaims; i++ ){
      let date = claims[i]['Incident Date']
      date = date.substring(date.indexOf('-') + 1, date.length) /*[DD, MM, YY]*/
      if (typeof data.claimsByMonth[date] === 'undefined'){
        data.claimsByMonth[date] = [ claims[i] ]; /*create new array of claims if new month*/
      } else {
        data.claimsByMonth[date].push(claims[i]); /*add to existing month of claims*/
      }
    }
  }

  return {
    data: data,
    getData: getData,
    loadData: loadData,
    byMonth: byMonth
  }
}

angular
  .module('tsa')
  .service('ClaimsDataService', ClaimsDataService)

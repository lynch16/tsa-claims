function ClaimsDataService($q, $filter) {
  let data = {
    claims: null,
  }

  const loadData = (claimsArray) => {
    let claims = []
    claimsArray.forEach((claim) => {
      if (!isNaN(claim["Claim Number"])) { //remove any claims that don't have a real claim number
        claims.push(claim)
      }
    });
    data.claims = claims;
  }

  const getData = () => {
    return data;
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

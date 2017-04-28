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

  const waitData = () => {      //returns a promise
    Promise.resolve(data.claims)
      .then((data) => {
        return data
      })
    // let deferred = $q.defer();
    //     deferred.resolve(data.claims)
    //     deferred.reject(console.log('err'));
    // return deferred.promise;
  }

  const getData = () => {
    return data;
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

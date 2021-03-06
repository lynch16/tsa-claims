function ClaimsDataService($q, $filter) {
  let data = {
    claims: null,
  }

  const loadData = (claimsArray) => {
    let claims = []
    claimsArray.forEach((claim) => {
      if (!isNaN(claim["Claim Number"])) { //remove any claims that don't have a real claim number
        claims.push(claim);
      }
    });
    data.claims = claims;
  }

  const waitData = () => {
    let deferred = $q.defer();
    if (data.claims !== null) { //resolve immediately if data already loaded
      deferred.resolve(data);
    } else {
      setTimeout(() => {
        if (data.claims !== null) {
          deferred.resolve(data);
        } else {
          deferred.reject(console.log('data loading timed out!'));
        }
      }, 3000);
    }
    return deferred.promise;
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

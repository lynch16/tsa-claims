function ClaimsDataService($q) {
  let data = {
    claims: null,
  }

  const loadData = (claimsArray) => {
    data.claims = claimsArray;
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

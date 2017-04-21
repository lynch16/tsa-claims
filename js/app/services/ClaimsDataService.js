function ClaimsDataService() {
  let data = {
    claims: null
  }

  const loadData = (claimsArray) => {
    data.claims = claimsArray;
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

function ClaimsDataService() {
  let data = {
    claims: null
  }

  let loadData = (claimsArray) => {
    data.claims = claimsArray;
  }

  let getData = () => {
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

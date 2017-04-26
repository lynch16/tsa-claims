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

  const valuesByYear = (groupedData) => {
    let values = {};
    let counts = {};
    for (let groupKey in groupedData) {
      if (groupKey === '-'){ //Fix '-' fields
        groupKey = 'Unknown';
      }
      values[groupKey] = {};
      counts[groupKey] = {}
      let orderedGroup = $filter('groupBy')(groupedData[groupKey], 'Incident Date');  //order data by date for chart
      for (let year in orderedGroup){
        values[groupKey][year] = {}
        counts[groupKey][year] = {}
        for (let month in orderedGroup[year]) {
          let  claimValues = []
          for (let i = 0; i < orderedGroup[year][month].length; i++){
            let val = parseFloat( orderedGroup[year][month][i]['Close Amount'].replace('$', "").trim() )
            if (isNaN(val)) (val = 0)
            claimValues.push(val);
          }
          values[groupKey][year][month] = jStat.mean(claimValues);
          counts[groupKey][year][month] = claimValues.length
        }
      }
    }
    return { 'values': values, 'counts': counts };
  }

  const valuesByMonth = (groupedData) => {
    let values = {};
    let counts = {};
    for (let groupKey in groupedData) {
      if (groupKey === '-'){ //Fix '-' fields
        groupKey = 'Unknown';
      }
      values[groupKey] = {};
      counts[groupKey] = {}
      let orderedGroup = $filter('groupBy')(groupedData[groupKey], 'Incident Date');  //order data by date for chart
      for (let year in orderedGroup){
        values[groupKey][year] = {}
        counts[groupKey][year] = {}
        for (let month in orderedGroup[year]) {
          let  claimValues = []
          for (let i = 0; i < orderedGroup[year][month].length; i++){
            let val = parseFloat( orderedGroup[year][month][i]['Close Amount'].replace('$', "").trim() )
            if (isNaN(val)) (val = 0)
            claimValues.push(val);
          }
          values[groupKey][year][month] = jStat.sum(claimValues);
          counts[groupKey][year][month] = claimValues.length
        }
      }
    }
    return { 'values': values, 'counts': counts };
  }

  return {
    data: data,
    getData: getData,
    loadData: loadData,
    waitData: waitData,
    valuesByYear: valuesByYear,
    valuesByMonth: valuesByYear
  }
}

angular
  .module('tsa')
  .service('ClaimsDataService', ClaimsDataService)

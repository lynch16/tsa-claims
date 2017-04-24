function ClaimsDataService($q, $filter) {
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

  const gatherClaimValues = (groupedData) => {
    let result = {}
    for (let groupKey in groupedData) {
      let orderedGroup = $filter('groupBy')(groupedData[groupKey], 'Incident Date');  //order data by date for chart
      for (let year in orderedGroup){
        for (let month in orderedGroup[year]) {
          let claimValues = []
          for (let i = 0; i < orderedGroup[year][month].length; i++){
            let val = parseFloat( orderedGroup[year][month][i]['Close Amount'].replace('$', "").trim() )
            if (val > 0) {
              claimValues.push(val);
            }
          }
          if (claimValues.length > 0){
            let avg = claimValues.reduce( (total, amt, index, array) => { //find average of that airline's monthly claim value
              total += amt;
              if (index === array.length-1){
                return (total/array.length).toFixed(2)/1; //toFixed makes strings from floating decimals.
                                                          //divide by 1 to make them numbers gain
              } else {
                return total;
              }
            });
            if (groupKey === '-'){ //Fix '-' fields
              groupKey = 'Unknown';
            }
            if (!result[groupKey]){ //build or add to result object
              result[groupKey] = {
                [year]: {
                  [month]: avg
                }
              }
            } else if (!result[groupKey][year]) {
              result[groupKey][year] = {
                  [month]: avg
              }
            } else {
              result[groupKey][year][month] = avg
            }
          }
        }
      }
    }
    return result;
  }

  return {
    data: data,
    getData: getData,
    loadData: loadData,
    waitData: waitData,
    gatherClaimValues: gatherClaimValues
  }
}

angular
  .module('tsa')
  .service('ClaimsDataService', ClaimsDataService)

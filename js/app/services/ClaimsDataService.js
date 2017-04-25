function ClaimsDataService($q, $filter) {
  let data = {
    claims: null,
  }

  const loadData = (claimsArray) => {
    let claims = []
    claimsArray.forEach((claim) => {
      if (!isNaN(claim["Claim Number"])) {
        claims.push(claim)
      }
    });
    data.claims = claims;
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
    let values = {};
    let counts = {};
    for (let groupKey in groupedData) {
      let orderedGroup = $filter('groupBy')(groupedData[groupKey], 'Incident Date');  //order data by date for chart
      for (let year in orderedGroup){
        for (let month in orderedGroup[year]) {
          let claimValues = []
          let count = 0
          for (let i = 0; i < orderedGroup[year][month].length; i++){
            count ++;
            let val = parseFloat( orderedGroup[year][month][i]['Close Amount'].replace('$', "").trim() )
            if (val > 0) {
              claimValues.push(val);
            }
          }

          if (!counts[groupKey]){ //build or add to counts object
            counts[groupKey] = {
              [year]: {
                [month]: count
              }
            }
          } else if (!counts[groupKey][year]) {
            counts[groupKey][year] = {
                [month]: count
            }
          } else {
            counts[groupKey][year][month] = count
          }

          if (claimValues.length > 0){
            let avg = claimValues.reduce( (total, amt, index, array) => { //find average of that airline's monthly claim value
              total += amt;
              if (index === array.length-1){
                return (total/count).toFixed(2)/1;     /* toFixed makes strings from floating decimals.
                                                          divide by 1 to make them numbers gain
                                                          count is all claims regardless of value.
                                                          use array.length for avg of only claims w/ values */
              } else {
                return total;
              }
            });
            if (groupKey === '-'){ //Fix '-' fields
              groupKey = 'Unknown';
            }
            if (!values[groupKey]){ //build or add to values object
              values[groupKey] = {
                [year]: {
                  [month]: avg
                }
              }
            } else if (!values[groupKey][year]) {
              values[groupKey][year] = {
                  [month]: avg
              }
            } else {
              values[groupKey][year][month] = avg
            }
          }
        }
      }
    }
    return [values, counts];
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

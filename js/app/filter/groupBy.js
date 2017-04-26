function groupBy() {
  return (claims, param, type = true) => {
    if (!(claims && param)) return;
    let result = {};
    if (param === 'Incident Date') {
      if (type === true) {
        for (let i = 0; i < claims.length; i++) {
          let date = Date.parse( claims[i]['Incident Date'].split(" ")[0] );
          let year = new Date(date).getFullYear();
          let month = new Date(date).getMonth() + 1;       //add one to month per Date Object documentation

          if (!result[year]) {                            //if year hasn't been set yet
            result[year] = {};                            //make new object
            result[year][month] = [ claims[i] ];          //assign claim array
          } else {
            if (!result[year][month]) {                   //if month in that year hasn't been set yet
              result[year][month] = [ claims[i] ];        //assign claim array
            } else {                                       //otherwise
              result[year][month].push(claims[i]);        //add claim to array
            }
          }
        }
        return result;
      } else {
        for (let i = 0; i < claims.length; i++) {
          let date = Date.parse( claims[i]['Incident Date'].split(" ")[0] );
          let year = new Date(date).getFullYear();
          let month = new Date(date).getMonth() + 1;       //add one to month per Date Object documentation

          let chartDate = month + ", " + year;

          if (!result[chartDate]) {                            //if year hasn't been set yet
            result[chartDate] = [ claims[i] ];                 //assign claim array
          } else {
            result[chartDate].push(claims[i]);                 //add claim to array
          }
        }
        return result;
      }
    } else { //if not Incident Date
      for (let i = 0; i < claims.length; i++){
        if (!result[claims[i][param]]) {
          result[ claims[i][param] ] = [];
        }
        result[claims[i][param]].push(claims[i])
      }
      return result;
    }
  }
}

angular
  .module('tsa')
  .filter('groupBy', groupBy)

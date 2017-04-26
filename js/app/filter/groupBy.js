function groupBy() {
  return (claims, param, type = true) => {
    if (!(claims && param)) return;
    let result = {};
    if (param === 'Incident Date') {
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
    } else { //if not Incident Date
      for (let i = 0; i < claims.length; i++){
        if (!result[claims[i][param]]) {
          result[ claims[i][param] ] = [];
        }
        result[claims[i][param]].push(claims[i])
      }
    }
    return result;
  }
}

angular
  .module('tsa')
  .filter('groupBy', groupBy)

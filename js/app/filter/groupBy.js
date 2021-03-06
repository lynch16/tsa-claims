function groupBy() {
  return (claims, param) => {
    if (!(claims && param)) return; //return if no claims or no grouping param
    let result = {};
    if (param === 'Incident Date') {
      for (let i = 0; i < claims.length; i++) {
        let date = Date.parse( claims[i]['Incident Date'].split(" ")[0] ); //if date and time, use date
        let chartDate = new Date(date);
        chartDate = chartDate.setDate(1).valueOf();
        if (!result[chartDate]) {                            //if year hasn't been set yet
          result[chartDate] = [ claims[i] ];                 //assign claim array
        } else {
          result[chartDate].push(claims[i]);                 //add claim to array
        }
      }
    } else { //if not Incident Date
      for (let i = 0; i < claims.length; i++){
        if (claims[i][param] === '-') {
          claims[i][[param]] = 'Unknown';
        }
        if (!result[claims[i][param]]) {
          result[ claims[i][param] ] = [];
        }
        result[claims[i][param]].push(claims[i]);
      }
    }
    return result;
  }
}

angular
  .module('tsa')
  .filter('groupBy', groupBy)

function selectKeys() {
  return (data, keys) => {
    let results = [];
    data.forEach((dataset) => {
      let setKey = Object.keys(dataset)[0] //each dataset should only have one key
      if (keys.indexOf(setKey) > -1) {
        results.push(dataset)
      }
    });
    return results;
  }
}

angular
  .module('tsa')
  .filter('selectKeys', selectKeys)

function GraphService($filter) {
  const setSeries = (data) => {
    let series = []
    data.forEach((entry) => {
      for (let key in entry) {
        series.push(key);
      }
    });
    return series;
  }

  const setTotalValues = (dateRange, data) => {
    let extractedData = [];
    data.forEach((series) => {
      let results = []
      for (let key in series) {  //key is airline, airport, etc.
        dateRange.forEach((date) => {
          if (!!series[key][date]){ //see if that airline has a value for that month
            results.push(jStat.sum(series[key][date]).toFixed(2));
          } else {
            results.push(0) //otherwise, send 0
          }
        })
      }
      extractedData.push(results) //build nested array
    });
    return extractedData
  }

    const setCountAverages = (labels, data) => {
      let avgCounts = [];
      let stdDevs = [];
      data.forEach((series) => {
        let results = [ [], [] ]
        for (let key in series) {  //key is airline, airport, etc.
          for (let i = 0; i < labels.length; i++) { //for each month in labels
            let monthlyCounts = [];
            for (let date in series[key]) {         //check all claims
              let month = new Date(parseInt(date)).getMonth();  //parse ms and store month
              if (month === i){                                //if claim month and current label are equal
                monthlyCounts.push(series[key][date].length); //add the number of claims
              }
            }
            let avg, stdev;
            if (monthlyCounts.length > 0) {
              avg = jStat.mean(monthlyCounts).toFixed(2)
              stdev = jStat.stdev(monthlyCounts).toFixed(2)
            } else {                                          //keep zeros for months with no claims
              avg = 0;
              stdev = 0;
            }
            results[0].push(avg)
            results[1].push(stdev)
          } //end labels loop
        }
        avgCounts.push(results[0]) //array of averages
        stdDevs.push(results[1]) //array of stdevs
      });
      return [avgCounts, stdDevs] //return as nested array per ChartJS
    }


  const setLabels = (labels, rangeType = 'month') => {
    labels = labels.map((label) => {
      let d = new Date(label)
      if (rangeType === 'month'){
        return (d.getMonth() + 1) + ", " + d.getFullYear();
      } else if (rangeType === 'year') {
        return d.getFullYear();
      } else {
        return d.getDate() + ", " + (d.getMonth() + 1) + ", " + d.getFullYear();

      }
    });
    return labels
  }

  const allDatesInRange = (min, max, rangeType = 'month') => {
    let dates = [];
    let stop = new Date(parseInt(max));
    let current = new Date(parseInt(min));
    while (current <= stop) {
      dates.push(current.valueOf());
      current = new Date(current);
      if (rangeType === 'month'){
        current = current.setMonth(current.getMonth() + 1);
      } else if (rangeType === 'year') {
        current = current.setFullYear(current.getFullYear() + 1);
      } else {
        current = current.getDate() + 1;
      }
    }
    return dates;
  }

  const configureValues = (groupedData, dateType = 'month') => {
    let data = [];
    for (let groupKey in groupedData) {
      let orderedGroup = $filter('groupBy')(groupedData[groupKey], 'Incident Date', dateType);  //order data by date for chart
      if (!!orderedGroup) {
        for (let d in orderedGroup) {
          orderedGroup[d] = orderedGroup[d].map((claim) => {
            let val = parseFloat( claim['Close Amount'].replace('$', "").trim() );
            if (isNaN(val)) return 0;
            return val;
          });
        }
        if (groupKey === '-') {
          groupKey = 'Unknown';
        }
        data.push({ [groupKey]: orderedGroup });
      }
    }
    return data;
  }

  return {
    setSeries: setSeries,
    setTotalValues: setTotalValues,
    setCountAverages: setCountAverages,
    setLabels: setLabels,
    allDatesInRange: allDatesInRange,
    configureValues: configureValues
  }
}

angular
  .module('tsa')
  .service('GraphService', GraphService)

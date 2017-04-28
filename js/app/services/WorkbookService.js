function WorkbookService($http, ClaimsDataService) {

  const loadLocalData = (fileLocation) => { //load XLS data from local file for when app starts
    /* set up XMLHttpRequest */
    const url = fileLocation;
    let oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function(e) {
      const arraybuffer = oReq.response;

      /* convert data to binary string */
      const data = new Uint8Array(arraybuffer);
      let arr = new Array();
      for(let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      const bstr = arr.join("");

      /* Call XLS */
      const workbook = XLS.read(bstr, {type:"binary"});

      read(workbook);
    }
    oReq.send();
  }

  const read = (workbook) => {
    /*Convert workbook object into array of JSON objects*/
    workbook.SheetNames.forEach((sheetName) => {
      let jsonArray = XLS.utils.sheet_to_json(workbook.Sheets[sheetName]);
      if (jsonArray.length > 0){
        ClaimsDataService.loadData(jsonArray);
        console.log('data loaded');
      }
    });
  }

  return {
    loadLocalData: loadLocalData,
    read: read
  }
}

angular
  .module('tsa')
  .service('WorkbookService', WorkbookService)

function WorkbookController(WorkbookService) {
  this.read = (workbook) => {
    WorkbookService.read(workbook);
  }
  this.error = (err) => console.log(err);
}

angular
  .module('tsa')
  .controller('WorkbookController', WorkbookController)

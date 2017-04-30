function TabsController(values, ClaimsDataService) {

  let tabs = [
      { title: 'Total Value', content: 'line' },
      { title: 'Average # Claims', content: 'bar' },
      { title: 'Average $ Claims', content: 'line-average' }
    ],
    selected = null,
    previous = null;
  this.$onInit = () => {
    this.tabs = tabs;
    this.selectedIndex = 1;
  }
}

angular
  .module('tsa')
  .controller('TabsController', TabsController)

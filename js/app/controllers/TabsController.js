function TabsController(values, ClaimsDataService) {
  this.values = values

  let tabs = [
      { title: 'Total Value', content: 'line' },
      { title: 'Average # Claims', content: 'bar' },
      { title: 'Add a Claim', content: 'new' }
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

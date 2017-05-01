function TabsController(values, ClaimsDataService) {
  let tabsCtrl = this;
  tabsCtrl.values = values;

  let tabs = [
      { title: 'Total Value', content: 'line' },
      { title: 'Average # Claims', content: 'bar' },
      { title: 'Add a Claim', content: 'new' }
    ],
    selected = null,
    previous = null;
  tabsCtrl.$onInit = () => {
    tabsCtrl.tabs = tabs;
    tabsCtrl.selectedIndex = 1;
  }
}

angular
  .module('tsa')
  .controller('TabsController', TabsController)

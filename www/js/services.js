

angular.module('deepBlue.services', [])

.factory('BackendService', ['$http', function ($http) {

  var svc = {};

  svc.getProducts = function(){
    return $http.get('sampledata/products.json');
  }

  return svc;
}])
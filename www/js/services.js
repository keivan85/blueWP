/*

  DeepBlue Starter Kit - version 1.1
  Copyright (c) 2015 INMAGIK SRL - www.inmagik.com
  All rights reserved

  written by Mauro Bianchi
  bianchimro@gmail.com  
  
  file: services.js
  description: this file contains all services of the DeepBlue app.

*/


angular.module('deepBlue.services', [])

// CartService is an example of service using localStorage 
// to persist items of the catPosts.
.factory('CartService', [function () {

  var svc = {};

  svc.saveCart = function(catPosts){
    window.localStorage.setItem('catPosts', JSON.stringify(catPosts));
  };

  svc.loadCart = function(){
    var catPosts = window.localStorage.getItem('catPosts');
    if(!catPosts){
      return { products : [ ] }
    }
    return JSON.parse(catPosts);
  };

  svc.resetCart = function(){
    var catPosts =  { products : [ ] };
    svc.saveCart(catPosts);
    return catPosts;
  };

  svc.getTotal = function(catPosts){
    var out = 0;
    if(!catPosts || !catPosts.products || !angular.isArray(catPosts.products)){
      return out;
    }
    for(var i=0; i < catPosts.products.length; i++){
      out += catPosts.products[i].price;
    }
    return out;
  }

  return svc;

}])

// #SIMPLIFIED-IMPLEMENTATION
// This is an example if backend service using $http to get
// data from files.
// In this example, files are shipped with the application, so 
// they are static and cannot change unless you deploy an application update
// Other possible implementations (not covered by this kit) include:
// - loading dynamically json files from the web 
// - calling a web service to fetch data dinamically
// in those cases be sure to handle url whitelisting (specially in android)
// (https://cordova.apache.org/docs/en/5.0.0/guide_appdev_whitelist_index.md.html)
// and handle network errors in your interface
.factory('BackendService', ['$http', function ($http) {

  var svc = {};

  svc.getFeeds = function(){
    return $http.get('sampledata/feeds.json');
  }

  svc.getProducts = function(){
    return $http.get('sampledata/products.json');
  }

  return svc;
}])
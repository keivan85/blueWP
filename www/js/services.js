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
// to persist items of the cat_posts.
.factory('CartService', [function () {

  var svc = {};

  svc.saveCart = function(cat_posts){
    window.localStorage.setItem('cat_posts', JSON.stringify(cat_posts));
  };

  svc.loadCart = function(){
    var cat_posts = window.localStorage.getItem('cat_posts');
    if(!cat_posts){
      return { products : [ ] }
    }
    return JSON.parse(cat_posts);
  };

  svc.resetCart = function(){
    var cat_posts =  { products : [ ] };
    svc.saveCart(cat_posts);
    return cat_posts;
  };

  svc.getTotal = function(cat_posts){
    var out = 0;
    if(!cat_posts || !cat_posts.products || !angular.isArray(cat_posts.products)){
      return out;
    }
    for(var i=0; i < cat_posts.products.length; i++){
      out += cat_posts.products[i].price;
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
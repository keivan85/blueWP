/*
  
  DeepBlue Starter Kit - version 1.1
  Copyright (c) 2015 INMAGIK SRL - www.inmagik.com
  All rights reserved

  written by Mauro Bianchi
  bianchimro@gmail.com  
  
  file: controllers.js
  description: this file contains all controllers of the DeepBlue app.

*/


//controllers are packed into a module
angular.module('deepBlue.controllers', [])

//top view controller
.controller('AppCtrl', function($scope, $rootScope, $state) {
  
  // #SIMPLIFIED-IMPLEMENTATION:
  // Simplified handling and logout function.
  // A real app would delegate a service for organizing session data
  // and auth stuff in a better way.
  
  $rootScope.user = {
    avatar : 'sampledata/images/avatar.png'
  };



  $scope.login = function(){
    //in this case we just set the user in $rootScope
    $rootScope.user = {
      email : "mary@ubiqtspaces.com",
      name : "Mary Ubiquitous",
      address : "Rue de Galvignac",
      city : "RonnieLand",
      zip  : "00007",
      avatar : 'sampledata/images/avatar.png'
    };
    //finally, we route our app to the 'app.main' view
    $state.go('app.main');
  };

  $scope.logout = function(){
  $rootScope.user = {};
  $state.go('app.start')
  };
})

// This controller is bound to the "app.account" view






// main controller.
.controller('mainCtrl', function($scope, 
  $ionicActionSheet, 
  BackendService, 
  CartService, 
  $http, 
  $sce,
  ionicToast ) {
  

  $scope.siteCategories = [];
  $scope.catPosts = CartService.loadCart();

  $scope.doRefresh = function(){
      BackendService.getProducts()
      .success(function(newItems) {
        $scope.products = newItems;
       // console.log($scope.products);
        $http.get("http://allfashion.mobiproj.com/wp-json/wp/v2/categories/").then(
        function(returnedData){
          $scope.siteCategories = returnedData.data;
          //console.log($scope.siteCategories);
          $scope.products.forEach(function(item1) {
            item1.categoryObj = $scope.siteCategories.find(function(item2) {
              return item2.name === item1.title;
            });
          });
        }, function(err){
          ionicToast.show('در حال حاضر امکان به روز رسانی مطالب وجود ندارد', 'top', false, 2000);
          console.log(err);
        })
      })
      .finally(function() {
        // Stop the ion-refresher from spinning (not needed in this view)
        $scope.$broadcast('scroll.refreshComplete');
      });
  };




  // private method to add a product to catPosts
  var addProductToCart = function(product){
    $scope.catPosts.products.push(product);
    CartService.saveCart($scope.catPosts);
  };

  // method to add a product to catPosts via $ionicActionSheet
  $scope.addProduct = function(product){
    $ionicActionSheet.show({
       buttons: [
         { text: '<b>Add to catPosts</b>' }
       ],
       titleText: 'Buy ' + product.title,
       cancelText: 'Cancel',
       cancel: function() {
          // add cancel code if needed ..
       },
       buttonClicked: function(index) {
         if(index == 0){
           addProductToCart(product);
           return true;
         }
         return true;
       }
     });
  };
 


  //trigger initial refresh of products
  $scope.doRefresh();

})


// post controller.
.controller('postCtrl', function($scope, $http, $stateParams, $sce, $localStorage) {
    $http.get('http://allfashion.mobiproj.com/wp-json/wp/v2/posts/' + $stateParams.postId).then(
      function(returnedData){
        $scope.postDetails = returnedData.data;
        $scope.post_title = $sce.trustAsHtml($scope.postDetails.title.rendered);
        $scope.post_content = $sce.trustAsHtml($scope.postDetails.content.rendered);
        $scope.post_image = $scope.postDetails.better_featured_image.source_url;

      }, function(err){
        console.log(err);
      })

    $scope.Share = function() {
      window.plugins.socialsharing.share($scope.post_title, $scope.post_image);
    }

})


// controller for "app.catContent" view
.controller('catContentCtrl', function($scope, 
  $sce, 
  $http, 
  $stateParams, 
  $ionicListDelegate, 
  $ionicScrollDelegate, 
  $localStorage, 
  ionicToast) {
    
  $scope.doRefresh = function() {
    $http.get("http://allfashion.mobiproj.com/wp-json/wp/v2/posts?categories=" + $stateParams.catId).then(
      function(returnedData){
        $scope.category_posts = returnedData.data;
        //console.log($scope.category_posts);
        $scope.category_posts.forEach(function(element, index, array) {
          element.excerpt.rendered = element.excerpt.rendered.substr(0, 150);
          element.excerpt.rendered = $sce.trustAsHtml(element.excerpt.rendered);
          element.title.rendered = $sce.trustAsHtml(element.title.rendered);
        if($scope.Favorites.indexOf(element.id) != -1) {
            element.isFavorite = true;
          } else {
            element.isFavorite = false;
          }
        })
        ionicToast.show('در حال مشاهده آخرین مطالب هستید', 'top', false, 2000);
    }, function(err){
        ionicToast.show('در حال حاضر امکان به روز رسانی مطالب وجود ندارد', 'top', false, 2000);
      console.log(err);
    })

    
    .finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.Favorites = $localStorage.Favorites;
  if(!$scope.Favorites) {
    $scope.Favorites = [];
    //console.log($scope.Favorites);
  }

  $scope.toggleFavorite = function(post) {
    //console.log(post);
    post.isFavorite = !post.isFavorite;

    if(post.isFavorite == true) {
      $scope.Favorites.push(post.id);
    } else {
      $scope.Favorites.forEach(function(e, i, a) {
        if (e == post.id) {
          $scope.Favorites.splice(i, 1);
          //console.log("Spliced index "+ i);
        }
      })
    }
    $localStorage.Favorites = $scope.Favorites;
  }
  
  $scope.recentPosts = [];
  $http.get("http://allfashion.mobiproj.com/wp-json/wp/v2/posts?categories=" + $stateParams.catId).then(
    function(returnedData){
      $scope.category_posts = returnedData.data;
      //console.log($scope.category_posts);
      $scope.category_posts.forEach(function(element, index, array) {
        element.excerpt.rendered = element.excerpt.rendered.substr(0, 150);
        element.excerpt.rendered = $sce.trustAsHtml(element.excerpt.rendered);
        element.title.rendered = $sce.trustAsHtml(element.title.rendered);
        if($scope.Favorites.indexOf(element.id) != -1) {
          element.isFavorite = true;
        } else {
          element.isFavorite = false;
        }
      })
   
    }, function(err){
      console.log(err);
    })

    
    .finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });
  $scope.searchTextChanged = function() {
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
  };
})

// controller for "app.catPosts" view
.controller('catPostsCtrl', function($scope, 
  CartService, 
  $ionicListDelegate, 
  $http, 
  $sce, 
  $ionicScrollDelegate, 
  $localStorage,
  ionicToast) {
  
  $scope.doRefresh = function(){
    $scope.recentPosts = [];

    $http.get("http://allfashion.mobiproj.com/wp-json/wp/v2/posts?per_page=15").then(
      function(returnedData){
        $scope.recentPosts = returnedData.data;
        //console.log($scope.recentPosts);
        $scope.recentPosts.forEach(function(element, index, array) {
          element.excerpt.rendered = element.excerpt.rendered.substr(0, 150);
          element.excerpt.rendered = $sce.trustAsHtml(element.excerpt.rendered);
          element.title.rendered = $sce.trustAsHtml(element.title.rendered);
          if($scope.Favorites.indexOf(element.id) != -1) {
            element.isFavorite = true;
          } else {
            element.isFavorite = false;
          }
        })
        ionicToast.show('در حال مشاهده آخرین مطالب هستید', 'top', false, 2000);
    }, function(err){
        ionicToast.show('در حال حاضر امکان به روز رسانی مطالب وجود ندارد', 'top', false, 2000);
      console.log(err);
    })

    
    .finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.Favorites = $localStorage.Favorites;
  if(!$scope.Favorites) {
    $scope.Favorites = [];
    console.log($scope.Favorites);
  }
  $scope.toggleFavorite = function(post) {
    console.log(post);
    console.log("fired");
    post.isFavorite = !post.isFavorite;

    if(post.isFavorite == true) {
      $scope.Favorites.push(post.id);
    } else {
      $scope.Favorites.forEach(function(e, i, a) {
        if (e == post.id) {
          $scope.Favorites.splice(i, 1);
          console.log("Spliced index "+ i);
        }
      })
    }
    $localStorage.Favorites = $scope.Favorites;
  }
  $scope.recentPosts = [];

  $http.get("http://allfashion.mobiproj.com/wp-json/wp/v2/posts?per_page=15").then(
    function(returnedData){
      $scope.recentPosts = returnedData.data;
      //console.log($scope.recentPosts);
      $scope.recentPosts.forEach(function(element, index, array) {
        element.excerpt.rendered = element.excerpt.rendered.substr(0, 150);
        element.excerpt.rendered = $sce.trustAsHtml(element.excerpt.rendered);
        element.title.rendered = $sce.trustAsHtml(element.title.rendered);
        if($scope.Favorites.indexOf(element.id) != -1) {
          element.isFavorite = true;
        } else {
          element.isFavorite = false;
        }
      })
 
  }, function(err){
    console.log(err);
  })

  $scope.searchTextChanged = function() {
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
  };




  // using the CartService to load cart from localStorage
  $scope.catPosts = CartService.loadCart();
  
  // we assign getTotal method of CartService to $scope to have it available
  // in our template
  $scope.getTotal = CartService.getTotal;

  // removes product from catPosts (making in persistent)
  $scope.dropProduct = function($index){
    $scope.catPosts.products.splice($index, 1);
    CartService.saveCart($scope.catPosts);
    // as this method is triggered in an <ion-option-button> 
    // we close the list after that (not strictly needed)
    $ionicListDelegate.closeOptionButtons();

  }
})

.controller('favCtrl', function($scope, 
  $http, 
  $localStorage, 
  $sce, 
  $stateParams,
  ionicToast) {

  $scope.doRefresh = function(){

    $scope.Favorites = $localStorage.Favorites;
    $scope.favorite_posts = [];
    //console.log($scope.favorite_posts);
    $scope.Favorites.forEach(function(element, index, array){
      $http.get('http://allfashion.mobiproj.com/wp-json/wp/v2/posts/'+element)
      .success(function(data){
        $scope.favorite_posts.push(data);
        //console.log(data);

        if($scope.favorite_posts.length == $scope.Favorites.length) {
          $scope.favorite_posts.forEach(function(element, index, array) {
            element.excerpt.rendered = element.excerpt.rendered.substr(0, 150);
            element.excerpt.rendered = $sce.trustAsHtml(element.excerpt.rendered);
            element.title.rendered = $sce.trustAsHtml(element.title.rendered);
            //console.log($scope.favorite_posts);
            if($scope.Favorites.indexOf(element.id) != -1) {
              element.isFavorite = true;
            } else {
              element.isFavorite = false;
            }
          })
          ionicToast.show('در حال مشاهده آخرین مطالبی که پسندیده اید هستید', 'top', false, 2000);

        }
      })

      .finally(function(){
        $scope.$broadcast('scroll.refreshComplete');
      })
    })

  }

  

  $scope.toggleFavorite = function(post){
    post.isFavorite = !post.isFavorite;

    if(post.isFavorite)
    {
      $scope.Favorites.push(post.id)
    }
    else
    {
      $scope.Favorites.forEach(function(element, index, array){
        if(element == post.id)
        {
          $scope.Favorites.splice(index, 1);
          //console.log("Spliced Item from index " + index);
        }
      })
    }

    $localStorage.Favorites = $scope.Favorites;
  }

  $scope.doRefresh();
})

.controller('CheckoutCtrl', function($scope, CartService, $state) {
  
  //using the CartService to load cart from localStorage
  $scope.catPosts = CartService.loadCart();
  $scope.getTotal = CartService.getTotal;

  $scope.getTotal = CartService.getTotal;

  // #NOT-IMPLEMENTED: This method is just calling alert()
  // you should implement this method to connect an ecommerce
  // after that the cart is reset and user is redirected to main
  $scope.checkout = function(){
    alert("this implementation is up to you!");
    $scope.catPosts = CartService.resetCart();
    $state.go('app.main')
  }

})
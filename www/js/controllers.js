
angular.module('deepBlue.controllers', [])

//top view controller
.controller('AppCtrl', function($scope, $rootScope, $state, $ionicSideMenuDelegate, $localStorage) {

  $scope.$ionicSideMenuDelegate = $ionicSideMenuDelegate;

  $rootScope.user = {
    avatar : 'sampledata/images/avatar.png'
  };  

  $scope.login = function(){
    $rootScope.user = {
      name : "Shiksho",
      avatar : 'sampledata/images/avatar.png'
    };
    $state.go('app.main');
  };

  $scope.logout = function(){
  ionic.Platform.exitApp();
  };
})


// main controller.
.controller('mainCtrl', function($scope, 
  $ionicActionSheet, 
  BackendService, 
  $http, 
  $sce,
  ionicToast) {
  

  $scope.siteCategories = [];

  $scope.doRefresh = function(){
      BackendService.getProducts()
      .success(function(newItems) {
        $scope.products = newItems;
       // console.log($scope.products);
        $http.get("http://allfashion.mobiproj.com/wp-json/wp/v2/categories/", {cache: true}).then(
        function(returnedData){
          $scope.siteCategories = returnedData.data;
          //console.log($scope.siteCategories);
          $scope.products.forEach(function(item1) {
            item1.categoryObj = $scope.siteCategories.find(function(item2) {
              return item2.name === item1.title;
            });
          });
        }, function(err){
          ionicToast.show('در حال حاضر امکان به روز رسانی مطالب وجود ندارد', 'top', false, 2500);
          console.log(err);
        })
      })
      .finally(function() {
        // Stop the ion-refresher from spinning (not needed in this view)
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  $scope.doRefresh();

})


// post controller.
.controller('postCtrl', function(
  $scope, 
  $http, 
  $stateParams, 
  $sce, 
  $localStorage,
  $cordovaSocialSharing) {
    $http.get('http://allfashion.mobiproj.com/wp-json/wp/v2/posts/' + $stateParams.postId, {cache: true}).then(
      function(returnedData){
        $scope.postDetails = returnedData.data;
        $scope.post_title = $sce.trustAsHtml($scope.postDetails.title.rendered);
        $scope.post_content = $sce.trustAsHtml($scope.postDetails.content.rendered);
        $scope.post_image = $scope.postDetails.better_featured_image.source_url;
      }, function(err){
        console.log(err);
      })

   $scope.share = function(title) {
    //console.log(title);
    $cordovaSocialSharing.share(title);
  };

})


// controller for "app.catContent" view
.controller('catContentCtrl', function(
  $scope, 
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
        ionicToast.show('در حال مشاهده آخرین مطالب هستید', 'top', false, 2500);
    }, function(err){
        ionicToast.show('در حال حاضر امکان به روز رسانی مطالب وجود ندارد', 'top', false, 2500);
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
.controller('catPostsCtrl', function(
  $scope, 
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
        ionicToast.show('در حال مشاهده آخرین مطالب هستید', 'top', false, 2500);
    }, function(err){
        ionicToast.show('در حال حاضر امکان به روز رسانی مطالب وجود ندارد', 'top', false, 2500);
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

})

.controller('favCtrl', function(
  $scope, 
  $http, 
  $localStorage, 
  $sce, 
  ionicToast,
  $cordovaSocialSharing) {

  $scope.doRefresh = function(){

    $scope.Favorites = $localStorage.Favorites;
    $scope.favorite_posts = [];
    //console.log($scope.Favorites);
    if($scope.Favorites && $scope.Favorites.length > 0) {
      $scope.Favorites.forEach(function(element, index, array){
        $http.get('http://allfashion.mobiproj.com/wp-json/wp/v2/posts/'+element).success(
          function(data){
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
          } else {
             $scope.$broadcast('scroll.refreshComplete');

          }
        })

        .finally(function(){
          $scope.$broadcast('scroll.refreshComplete');

        })
      })
    } else {
      $scope.$broadcast('scroll.refreshComplete');
      ionicToast.show('شما هنوز مطلبی را به لیست مطالب پسندیده شده اضافه نکردید', 'middle', false, '3000');
    }
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

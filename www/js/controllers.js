angular.module('brunchball.controllers', [])

.controller('DashCtrl', function($scope, fireBaseData, $firebase) {
      $scope.events = $firebase(fireBaseData.refEvents()).$asArray();
        $scope.user = fireBaseData.ref().getAuth();
      //ADD MESSAGE METHOD
      $scope.addEvent = function(e) {
          $scope.events.$add({
            by: $scope.user.password.email,
            label: $scope.label,
              cost: $scope.cost
          });
          $scope.label = "";
          $scope.cost = 0;
      };
        $scope.getTotal = function () {
            var i, rtnTotal = 0;
            for (i = 0; i < $scope.events.length; i = i + 1) {
                rtnTotal = rtnTotal + $scope.events[i].cost;
            }
            return rtnTotal;
        };
})
.controller('EventsCtrl', function($scope, fireBaseData, $firebase) {
    $scope.events = $firebase(fireBaseData.refEvents()).$asArray();
    /*$scope.remove = function(event) {
        Events.remove(event);
    }*/
    $scope.goers = $firebase(fireBaseData.refEventGoers()).$asArray();
    $scope.addEvent = function(e) {
            $scope.events.$add({
                by: $scope.user.password.email,
                label: $scope.label,
                cost: $scope.cost
            });
            $scope.label = "";
            $scope.cost = 0;
};
    /*$scope.addExpense = function(e) {
            $scope.expenses.$add({
                by: $scope.roomiesEmail,
                label: $scope.label,
                cost: $scope.cost
            });
            $scope.label = "";
            $scope.cost = 0;
        };
        $scope.getTotal = function () {
            var i, rtnTotal = 0;
            for (i = 0; i < $scope.expenses.length; i = i + 1) {
                rtnTotal = rtnTotal + $scope.expenses[i].cost;
            }
            return rtnTotal;
        };*/
})

/*.controller('EventDetailCtrl', function($scope, firebaseBaseData, $firebase) {
    $scope.event = $firebase(firebaseBaseData.refEvents(title);
                            )})*/

.controller('HomeCtrl', function($rootScope, $scope, $firebase, $location) {
  var ref = new Firebase($rootScope.URL + 'chatRooms');
  var sync = $firebase(ref);
 
  $scope.rooms = sync.$asArray();
 
  $scope.newRoom = function() {
    sync.$push({
      createdby: $rootScope.user.name,
      roomname: $scope.roomName,
      createddate: Date.now()
    });
    $scope.isNew = false;
  };
  $scope.deleteRoom = function(room) {
    sync.$remove($scope.rooms[room].$id);
  };
 
  $scope.joinChat = function(room) {
    $location.path('/chat/' + $scope.rooms[room].$id);
  };
})

.controller('ChatCtrl', function($rootScope, $scope, $firebase, $routeParams) {
  // get room details
  var chatRoom = new Firebase($rootScope.URL + 'chatRooms/' + $routeParams.roomid);
  var roomSync = $firebase(chatRoom);
  $scope.roomInfo = roomSync.$asObject();
 
  var msgsSync = $firebase(chatRoom.child('chatMessages'));
  $scope.chatMessages = msgsSync.$asArray();
 
  $scope.sendMessage = function($event) {
    if (!($event.which == 13)) return;
    if ($scope.message.length == 0) return;
 
    msgsSync.$push({
      postedby: $rootScope.user.name,
      message: $scope.message,
      posteddate: Date.now(),
      userimg: $rootScope.user.img
    });
 
    $scope.message = '';
  };
})

.controller('FriendsCtrl', function($scope, fireBaseData, $firebase) {
        $scope.user = fireBaseData.ref().getAuth();
        $scope.events = $firebase(fireBaseData.refEvents()).$asArray();
        $scope.friends = $firebase(fireBaseData.refFriends()).$asArray();
        /*$scope.roomies.$loaded().then(function(array) {
           var i;
            //array = [[set1_rm1_email, set1_rm2_email], [set2_rm1_email, set2_rm2_email] ...]
            for (i = 0; i < array.length; i = i + 1) {
               if (array[i][0] === $scope.user.password.email) {
                   $scope.roomiesEmail = array[i][1];
               } else if (array[i][1] === $scope.user.password.email) {
                   $scope.roomiesEmail = array[i][0];
               }
            }
            $scope.$apply();
            //Yes this whole app, front-end to backend is built only for two room-mates situation
        });
        $scope.addExpense = function(e) {
            $scope.expenses.$add({
                by: $scope.roomiesEmail,
                label: $scope.label,
                cost: $scope.cost
            });
            $scope.label = "";
            $scope.cost = 0;
        };
        $scope.getTotal = function () {
            var i, rtnTotal = 0;
            for (i = 0; i < $scope.expenses.length; i = i + 1) {
                rtnTotal = rtnTotal + $scope.expenses[i].cost;
            }
            return rtnTotal;
        };*/
})
.controller('AccountCtrl', function($scope, fireBaseData, $firebase) {
        $scope.showLoginForm = false;
        $scope.showCreateAccountForm = false;
        //Checking if user is logged in
        $scope.user = fireBaseData.ref().getAuth();
        if (!$scope.user) {
            $scope.showLoginForm = true;
        }
        //Create a new account
        $scope.createANewAccountForm = function() {
            $scope.showCreateAccountForm = !$scope.showCreateAccountForm;
        };
        $scope.backToLogin = function() {
            $scope.showCreateAccountForm = false;
        };
        //$scope.createNewAccount = function() {
        
        
        
        //Login method
        $scope.login = function (em, pwd) {
            fireBaseData.ref().authWithPassword({
                email    : em,
                password : pwd
            }, function(error, authData) {
                if (error === null) {
                    console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
                    $scope.user = fireBaseData.ref().getAuth();
                    $scope.showLoginForm = false;
                    $scope.$apply();
                    /*var r = $firebase(fireBaseData.refRoomMates()).$asArray();
                    r.$add(["k@gmail.com","r@gmail.com"]);*/
                } else {
                    console.log("Error authenticating user:", error);
                }
            });
        };
        //Logout method
        $scope.logout = function () {
            fireBaseData.ref().unauth();
            $scope.showLoginForm = true;
        };
})

.controller('AppCtrl',
  function($rootScope, $scope, $window, $firebaseSimpleLogin) {
    $rootScope.URL = 'https://brunchball.firebaseio.com/';
    var ref = new Firebase($rootScope.URL);
    $rootScope.authClient = $firebaseSimpleLogin(ref);
 
    $rootScope.redirect = function(user) {
      if ($window.location.href.indexOf('home') < 0)
        $window.location.assign('http://localhost:3000/#home');
 
      if (user.provider == 'password') {
        user.name = user.email;
        user.img = '/img/user.png'
      } else if (user.provider == 'facebook') {
        user.name = user.displayName;
        user.img = user.thirdPartyUserData.picture.data.url;
      } else if (user.provider == 'twitter') {
        user.name = user.displayName;
        user.img = user.thirdPartyUserData.profile_image_url;
      } else if (user.provider == 'google') {
        user.name = user.displayName;
        user.img = user.thirdPartyUserData.picture;
      }
 
      $rootScope.user = user;
    };
 
    $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
      if (user) {
        $rootScope.redirect(user);
      }
    });
  }
)
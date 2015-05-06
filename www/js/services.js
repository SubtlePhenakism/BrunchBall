angular.module('brunchball.services', [])
/**
 * A simple example service that returns some data.
 */
.factory('fireBaseData', function($firebase) {
  var ref = new Firebase("https://brunchball.firebaseio.com/"),
      refExpenses = new Firebase("https://brunchball.firebaseio.com/expenses"),
      refFriends = new Firebase("https://brunchball.firebaseio.com/friends"),
      refEvents = new Firebase("https://brunchball.firebaseio.com/events");
  return {
    ref: function () {
      return ref;
    },
    refExpenses: function () {
      return refExpenses;
    },
    refEvents: function () {
      return refEvents;
    },
    refFriends: function () {
      return refFriends;
    }
  }
});
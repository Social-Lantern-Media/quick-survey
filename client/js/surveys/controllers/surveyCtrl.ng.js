angular.module('quick-survey').controller('SurveyCtrl',
  function ($scope, $rootScope, $meteor) {

  $scope.loaded = false;

  $meteor.subscribe('surveys').then(function(subscriptionHandle) {
    $scope.surveys = $meteor.collection(Surveys);
    // ToDo, check for the survey's active status.
    $scope.newResponse = {
      'survey': $scope.surveys[0],
      'questions': angular.copy($scope.surveys[0].questions)
    };
  });

  $scope.$watch('currentUser', function() {
    if ($rootScope.currentUser) {
      $scope.loaded = true;
      $scope.user = $meteor.object(Meteor.users, $rootScope.currentUser._id, false).subscribe('users');
    }
  });

  $scope.responses = $meteor.collection(Responses);

  $scope.submit = function(newResponse) {
    newResponse.user = $rootScope.currentUser._id;
    $scope.responses.save(newResponse)
      .then(function(result) {
        $scope.user.has_submitted = true;
        $scope.user.save();
      });
  };

});
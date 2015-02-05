'use strict';

describe('Controller: SearchCtrl', function() {

  // load the controller's module
  beforeEach(module('tikrApp'));

  var SearchCtrl, $scope, createController, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend;
    $scope = $rootScope.$new();
    createController = function() {
      SearchCtrl = $controller('SearchCtrl', {
        $scope: $scope
      });
    };

  }));

  it('should be able to fetch all users by language = javascript', function() {
    $scope.TEST_USER = 'scottrice10';
    createController();
    var searchInput = null;

    httpBackend.whenPOST('/api/users/me/search?pageNumber=1').respond(function(method, url, data, headers){
      searchInput = JSON.parse(data).skill;
      return [302, {}, {}];
    });
    httpBackend.flush();

    expect(searchInput).toBe('javascript');
  });
});

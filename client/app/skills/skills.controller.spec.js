/*
Note: This is a template copied from main
*/
'use strict';

describe('Controller: SkillsCtrl', function () {

  // load the controller's module
  beforeEach(module('tikrApp'));

  var scope, $httpBackend, SkillsCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/skills')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    SkillsCtrl = $controller('SkillsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of skills to the scope', function () {

  });
});

"use strict";angular.module("tikrApp",["ngCookies","ngResource","ngSanitize","ui.router","ui.bootstrap"]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider",function(a,b,c,d){b.otherwise("/"),c.html5Mode(!0),d.interceptors.push("authInterceptor")}]).factory("authInterceptor",["$rootScope","$q","$cookieStore","$location",function(a,b,c,d){return{request:function(a){return a.headers=a.headers||{},c.get("token")&&(a.headers.Authorization="Bearer "+c.get("token")),a},responseError:function(a){return 401===a.status?(d.path("/login"),c.remove("token"),b.reject(a)):b.reject(a)}}}]).run(["$rootScope","$location","Auth",function(a,b,c){a.$on("$stateChangeStart",function(a,d){c.isLoggedInAsync(function(a){d.authenticate&&!a&&b.path("/login")})})}]),angular.module("tikrApp").controller("Error404Ctrl",["$scope",function(){}]),angular.module("tikrApp").config(["$stateProvider",function(a){a.state("error404",{url:"/pagenotfound",templateUrl:"app/404/error404.html",controller:"Error404Ctrl"})}]),angular.module("tikrApp").config(["$stateProvider",function(a){a.state("login",{url:"/login",templateUrl:"app/account/login/login.html",controller:"LoginCtrl"}).state("signup",{url:"/signup",templateUrl:"app/account/signup/signup.html",controller:"SignupCtrl"}).state("settings",{url:"/settings",templateUrl:"app/account/settings/settings.html",controller:"SettingsCtrl",authenticate:!0})}]),angular.module("tikrApp").controller("LoginCtrl",["$scope","Auth","$location","$window",function(a,b,c,d){a.user={},a.errors={},a.login=function(d){a.submitted=!0,d.$valid&&b.login({email:a.user.email,password:a.user.password}).then(function(){c.path("/")})["catch"](function(b){a.errors.other=b.message})},a.loginOauth=function(a){d.location.href="/auth/"+a}}]),angular.module("tikrApp").controller("SettingsCtrl",["$scope","User","Auth",function(a,b,c){a.errors={},a.changePassword=function(b){a.submitted=!0,b.$valid&&c.changePassword(a.user.oldPassword,a.user.newPassword).then(function(){a.message="Password successfully changed."})["catch"](function(){b.password.$setValidity("mongoose",!1),a.errors.other="Incorrect password",a.message=""})}}]),angular.module("tikrApp").controller("SignupCtrl",["$scope","Auth","$location","$window",function(a,b,c,d){a.user={},a.errors={},a.register=function(d){a.submitted=!0,d.$valid&&b.createUser({name:a.user.name,email:a.user.email,password:a.user.password}).then(function(){c.path("/")})["catch"](function(b){b=b.data,a.errors={},angular.forEach(b.errors,function(b,c){d[c].$setValidity("mongoose",!1),a.errors[c]=b.message})})},a.loginOauth=function(a){d.location.href="/auth/"+a}}]),angular.module("tikrApp").controller("AdminCtrl",["$scope","$http","Auth","User",function(a,b,c,d){a.users=d.query(),a["delete"]=function(b){d.remove({id:b._id}),angular.forEach(a.users,function(c,d){c===b&&a.users.splice(d,1)})}}]),angular.module("tikrApp").config(["$stateProvider",function(a){a.state("admin",{url:"/admin",templateUrl:"app/admin/admin.html",controller:"AdminCtrl"})}]),angular.module("tikrApp").controller("MainCtrl",["$scope","$http","$window","Auth",function(a,b,c,d){a.awesomeThings=[],b.get("/api/things").success(function(b){a.awesomeThings=b}),a.isLoggedIn=d.isLoggedIn,a.addThing=function(){""!==a.newThing&&(b.post("/api/things",{name:a.newThing}),a.newThing="")},a.loginOauth=function(a){c.location.href="/auth/"+a},a.deleteThing=function(a){b["delete"]("/api/things/"+a._id)}}]),angular.module("tikrApp").config(["$stateProvider",function(a){a.state("main",{url:"/",templateUrl:"app/main/main.html",controller:"MainCtrl"})}]),angular.module("tikrApp").controller("MessageCtrl",["$scope","$state","messageService",function(a,b,c){a.$state=b,a.inbox=function(){c.inbox().then(function(b){a.messages=b})},a.show=function(b){c.update(b,{read:!0}).then(function(c){a.message=c,b.read=!0})},a.starred=function(a){c.update(a,{starred:!0}).then(function(){a.starred=!0})},a.create=function(d){c.create(d).then(function(c){a.messages.push(c),b.transitionTo("inbox.messages")},function(){b.transitionTo("inbox.messages.create")})},a.inbox(),b.transitionTo("inbox.messages")}]),angular.module("tikrApp").config(["$stateProvider","$urlRouterProvider",function(a,b){a.state("inbox",{url:"/messages/inbox",controller:"MessageCtrl",templateUrl:"app/message/message.html"}).state("inbox.messages",{views:{sidebar:{templateUrl:"app/message/message.sidebar.html"},messages:{templateUrl:"app/message/message.inbox.html"}}}).state("inbox.messages.show",{url:"/:id",templateUrl:"app/message/message.show.html"}).state("inbox.messages.create",{url:"/create",templateUrl:"app/message/message.create.html"}),b.otherwise("/messages/inbox")}]),angular.module("tikrApp").controller("ProfileCtrl",["$scope","$http","$rootScope","$modal","messageService","$stateParams","$location","Auth","User",function(a,b,c,d,e,f,g,h){a.languages={},a.currentUsername=f.username,a.showFormToAddSkills=!1,a.getUserProfile=function(){var c=f.username,d="api/users/profiles/"+c;return b({method:"GET",url:d}).success(function(b){a.userProfile=b,a.languages=b.languages;var c=_.reduce(a.languages,function(a,b){return a+=b},0);_.map(a.languages,function(b,d){var e=b/c*100;return a.languages[d]=[b,e]})}).error(function(a,b){return console.log("There has been an error",a),404===b&&g.path("/pagenotfound"),a})},a.isLoggedInAsCurrentUser=function(){var a=f.username,b=h.getCurrentUser();return b.github&&b.github.login&&b.github.login===a?!0:!1},a.showAddSkillsForm=function(){a.showFormToAddSkills=!0},a.addASkill=function(c){a.showFormToAddSkills=!1;var d=a.skillname,e=a.githublink;if(c.$valid){var g=f.username,h="api/users/profiles/"+g;b.post(h,{skillname:d,githublink:e}).success(function(b){a.userProfile=b}).error(function(a,b){console.log("Error adding skill",a,b)})}},a.sendMessage=function(a,b,c){var d={userGithubID:c,title:a,message:b};e.create(d).then(function(){console.log("sent message")},function(){console.log("failed to send message")})},a.sendMessageModal=function(b){var e=c.$new();e.messageTitle="",e.messageText="";var f="modal-default";e.modal={dismissable:!0,title:"Sending Message to: "+b.name,buttons:[{classes:"btn-danger",text:"Send",click:function(c){a.sendMessage(e.messageTitle,e.messageText,b.github.id),a.messageModal.close(c)}},{classes:"btn-default",text:"Cancel",click:function(b){a.messageModal.dismiss(b)}}]},a.messageModal=d.open({templateUrl:"app/profile-page/messageDialog.html",windowClass:f,scope:e,controller:"ProfileCtrl"})},a.setupGauges=function(){c3.generate({data:{columns:[["data",91.4]],type:"gauge",onclick:function(a,b){console.log("onclick",a,b)},onmouseover:function(a,b){console.log("onmouseover",a,b)},onmouseout:function(a,b){console.log("onmouseout",a,b)}},gauge:{},color:{pattern:["#FF0000","#F97600","#F6C600","#60B044"],threshold:{values:[30,60,90,100]}},size:{height:180}})},a.getUserProfile(),a.hasSkills=function(){return a.userProfile&&a.userProfile.skills?!0:!1}}]),angular.module("tikrApp").config(["$stateProvider",function(a){a.state("profile",{url:"/profiles/:username",templateUrl:"app/profile-page/profile.html",controller:"ProfileCtrl"})}]),angular.module("tikrApp").controller("SearchCtrl",["$scope","$http","$q","User",function(a,b,c,d){a.users=[],a.skills=[],a.hasAllSkills=!1,a.fetchUsers=function(){return c(function(b,c){a.users=d.search({skills:a.skills,hasAllSkills:a.hasAllSkills}),a.users?b(a.users):c("failed")})},a.fetchUsers().then(function(b){a.users=b})}]),angular.module("tikrApp").config(["$stateProvider",function(a){a.state("search",{url:"/search",templateUrl:"app/search/search.html",controller:"SearchCtrl"})}]),angular.module("tikrApp").controller("SkillsCtrl",["$scope","$http","Auth",function(a,b,c){a.awesomeThings=[],b.get("/api/things").success(function(b){a.awesomeThings=b}),a.isCollapsed=!0,a.isLoggedIn=c.isLoggedIn,a.isAdmin=c.isAdmin,a.getCurrentUser=c.getCurrentUser,a.addThing=function(){""!==a.newThing&&(b.post("/api/things",{name:a.newThing}),a.newThing="")},a.loginOauth=function(a){$window.location.href="/auth/"+a},a.deleteThing=function(a){b["delete"]("/api/things/"+a._id)}}]),angular.module("tikrApp").config(["$stateProvider",function(a){a.state("skills",{url:"/skills",templateUrl:"app/skills/skills.html",controller:"SkillsCtrl"})}]),angular.module("tikrApp").factory("Auth",["$location","$rootScope","$http","User","$cookieStore","$q",function(a,b,c,d,e,f){var g={};return e.get("token")&&(g=d.get()),{login:function(a,b){var h=b||angular.noop,i=f.defer();return c.post("/auth/local",{email:a.email,password:a.password}).success(function(a){return e.put("token",a.token),g=d.get(),i.resolve(a),h()}).error(function(a){return this.logout(),i.reject(a),h(a)}.bind(this)),i.promise},logout:function(){e.remove("token"),g={}},createUser:function(a,b){var c=b||angular.noop;return d.save(a,function(b){return e.put("token",b.token),g=d.get(),c(a)},function(a){return this.logout(),c(a)}.bind(this)).$promise},changePassword:function(a,b,c){var e=c||angular.noop;return d.changePassword({id:g._id},{oldPassword:a,newPassword:b},function(a){return e(a)},function(a){return e(a)}).$promise},getCurrentUser:function(){return g},isLoggedIn:function(){return g.hasOwnProperty("role")},isLoggedInAsync:function(a){g.hasOwnProperty("$promise")?g.$promise.then(function(){a(!0)})["catch"](function(){a(!1)}):a(g.hasOwnProperty("role")?!0:!1)},isAdmin:function(){return"admin"===g.role},getToken:function(){return e.get("token")}}}]),angular.module("tikrApp").factory("User",["$resource",function(a){return a("/api/users/:id/:controller",{id:"@_id"},{changePassword:{method:"PUT",params:{controller:"password"}},get:{method:"GET",params:{id:"me"}},search:{method:"POST",isArray:!0,params:{id:"me",controller:"search"}}})}]),angular.module("tikrApp").factory("messageService",["$http","$q","$state","Auth",function(a,b,c,d){return{inbox:function(){var c=b.defer();return a.get("/api/messages/inbox").success(function(a){c.resolve(a)}).error(function(a){c.reject(a)}),c.promise},update:function(c,d){var e=b.defer();return a.put("/api/messages/update",{message:c,property:d}).success(function(a){e.resolve(a)}).error(function(){e.reject(!1)}),e.promise},create:function(c){var e=b.defer(),f={to:c.userGithubID,from:d.getCurrentUser().github.id,title:c.title,content:c.message.replace(/\n/g,"<br />")};return a.post("/api/messages/create",f).success(function(a){e.resolve(a)}).error(function(){e.reject(!1)}),e.promise}}}]),angular.module("tikrApp").factory("Modal",["$rootScope","$modal",function(a,b){function c(c,d){var e=a.$new();return c=c||{},d=d||"modal-default",angular.extend(e,c),b.open({templateUrl:"components/modal/modal.html",windowClass:d,scope:e})}return{confirm:{"delete":function(a){return a=a||angular.noop,function(){var b,d=Array.prototype.slice.call(arguments),e=d.shift();b=c({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+e+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(a){b.close(a)}},{classes:"btn-default",text:"Cancel",click:function(a){b.dismiss(a)}}]}},"modal-danger"),b.result.then(function(b){a.apply(b,d)})}}}}}]),angular.module("tikrApp").directive("mongooseError",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){b.on("keydown",function(){return d.$setValidity("mongoose",!0)})}}}),angular.module("tikrApp").controller("NavbarCtrl",["$scope","$location","Auth","$stateParams","User",function(a,b,c){a.menu=[{title:"Home",link:"/"},{title:"Search",link:"/search"}],a.isCollapsed=!0,a.isLoggedIn=c.isLoggedIn,a.isAdmin=c.isAdmin,a.getCurrentUser=c.getCurrentUser,a.logout=function(){c.logout(),b.path("/login")},a.isActive=function(a){return a===b.path()}}]),angular.module("tikrApp").run(["$templateCache",function(a){a.put("app/404/error404.html","<div ng-include=\"'components/navbar/navbar.html'\"></div><header class=hero-unit id=banner><div class=container><h1>Page Not Found :-(</h1></div></header><footer class=footer></footer>"),a.put("app/account/login/login.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container style=text-align:center><div><a class="btn btn-github" style=background-color:black href="" ng-click="loginOauth(\'github\')"><i class="fa fa-5x fa-github"></i> Connect with Github</a></div></div>'),a.put("app/account/settings/settings.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Change Password</h1></div><div class=col-sm-12><form class=form name=form ng-submit=changePassword(form) novalidate><div class=form-group><label>Current Password</label><input type=password name=password class=form-control ng-model=user.oldPassword mongoose-error><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.other }}</p></div><div class=form-group><label>New Password</label><input type=password name=newPassword class=form-control ng-model=user.newPassword ng-minlength=3 required><p class=help-block ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || submitted)">Password must be at least 3 characters.</p></div><p class=help-block>{{ message }}</p><button class="btn btn-lg btn-primary" type=submit>Save changes</button></form></div></div></div>'),a.put("app/account/signup/signup.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container style=text-align:center><div><a class="btn btn-github" href="" ng-click="loginOauth(\'github\')"><i class="fa fa-github"></i> Connect with Github</a></div></div>'),a.put("app/admin/admin.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p><ul class=list-group><li class=list-group-item ng-repeat="user in users"><strong>{{user.name}}</strong><br><span class=text-muted>{{user.email}}</span> <a ng-click=delete(user) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></li></ul></div>'),a.put("app/main/main.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><header class=hero-unit id=banner><div class=container><h1>Welcome to tikr!</h1><p class=lead>A social network by developers, for developers.</p><div><a ng-hide=isLoggedIn() class="btn btn-github" style=background-color:black href="" ng-click="loginOauth(\'github\')"><i class="fa fa-5x fa-github"></i> Connect with Github</a></div></div></header>'),a.put("app/message/message.create.html",'<button id=inbox-back type=button class="btn btn-default btn-sm" ui-sref=inbox.messages><span class="glyphicon glyphicon-backward" aria-hidden=true></span> Back to Inbox</button><div class=well><form name=newMessage ng-submit=create(newMessage) novalidate><div class=form-group><label for=to>To</label><input ng-model=newMessage.to class=form-control placeholder="MVP stage. Always set to send a private message to Richard VanBreemen." disabled></div><div class=form-group><label for=title>Title</label><input ng-model=newMessage.title class=form-control placeholder="Give a title to your private message"></div><div class=form-group><label for=message>Message</label><textarea ng-model=newMessage.message class=form-control rows=10 placeholder="Enter your message here to the user">\n      </textarea></div><button class="btn btn-danger" type=submit>Send</button></form></div>'),a.put("app/message/message.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container-fluid><div id=messages class=row><div class=col-md-2><button id=inbox-back type=button class="btn btn-default btn-md" ui-sref=inbox.messages.create><span class="glyphicon glyphicon-envelope" aria-hidden=true></span> Compose</button><div ui-view=sidebar></div></div><div class=col-md-10><div ui-view=messages></div></div></div></div>'),a.put("app/message/message.inbox.html",'<div ng-repeat="message in messages" ng-hide="$state.includes(\'inbox.messages.show\') || $state.includes(\'inbox.messages.create\')"><div class="panel panel-default"><div class=panel-heading><h3 class=panel-title><a ui-sref="inbox.messages.show({id: message._id})" ng-click=show(message)>{{message.title}}</a> <span class="label label-danger" ng-if=!message.read>New</span> <span ng-if=!message.starred class="pull-right glyphicon glyphicon-star-empty" aria-hidden=true ng-click=starred(message)></span> <span ng-if=message.starred class="pull-right glyphicon glyphicon-star" aria-hidden=true></span></h3></div><div ng-bind-html=message.content.substr(0,100) class=panel-body></div></div></div><div ui-view></div>'),a.put("app/message/message.show.html",'<button id=inbox-back type=button class="btn btn-default btn-sm" ui-sref=inbox.messages><span class="glyphicon glyphicon-backward" aria-hidden=true></span> Back to Inbox</button><div class="panel panel-default"><div class=panel-heading><h3 class=panel-title>{{message.title}}</h3></div><div ng-bind-html=message.content class=panel-body>{{message.content}}</div></div>'),a.put("app/message/message.sidebar.html",'<div class=list-group><a href=# class="list-group-item active">Inbox <span class=badge>{{messages.length}}</span></a> <a href=# class=list-group-item>Sent</a> <a href=# class=list-group-item>Starred <span class=badge>{{starred}}</span></a></div>'),a.put("app/profile-page/messageDialog.html",'<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body>(subject) <input ng-model=$parent.messageTitle style="width: 100%; margin-bottom: 8px"><textarea ng-model=$parent.messageText style="width: 100%; height:200px"></textarea></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>'),a.put("app/profile-page/profile.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><header class=hero-unit id=banner><div class=container><h1>{{\'@\'+userProfile.github.login}}</h1></div></header><div class=container><img id=profilePic ng-src={{userProfile.github.avatar_url}}> <button class="btn btn-default" ng-click=sendMessageModal(userProfile);>Send Message</button><div class=row><div class=col-lg-12><h1 ng-show=hasSkills() class=page-header>Skills</h1><button ng-show=isLoggedInAsCurrentUser() class="btn btn-default" ng-click=showAddSkillsForm()>Add a Skill</button><!--TODO: fix this behavior when user is not logged in --><h1 ng-show="!hasSkills() && isLoggedInAsCurrentUser" class=page-header>You haven\'t added any skills yet :-(</h1><h1 ng-show="!hasSkills() && !isLoggedInAsCurrentUser" class=page-header>{{currentUsername}} hasn\'t added any skills yet :-(</h1><form ng-show=showFormToAddSkills class=form name=form ng-submit=addASkill(form) novalidate><div class=form-group><label>Name of Skill</label><input name=skillname ng-model=skillname class=form-control required></div><div class=form-group><label>Github Link Demonstrating Your Skill</label><input type=url name=githublink ng-model=githublink class=form-control required></div><div class="form-group has-error"><p class=help-block ng-show="form.skillname.$error.required && form.githublink.$error.required && submitted">Please enter a skill and a link to Github that shows it off.</p></div><div><button class="btn btn-inverse btn-lg btn-login" type=submit>Add Skill</button></div><hr></form><ul class="nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6" ng-repeat="skill in userProfile.skills"><li><a ng-href={{skill.githublink}}>{{skill.skillname}}</a></li></ul></div></div></div><footer class=footer><!--\n  <div class="container">\n      <p>Angular Fullstack v2.0.13 |\n        <a href="https://twitter.com/tyhenkel">@tyhenkel</a> |\n         <a href="https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open">Issues</a></p>\n  </div>\n--></footer>'),a.put("app/search/search.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div style="text-align: center"><input type=radio ng-model=hasAllSkills ng-value=true>has all skills<input type=radio ng-model=hasAllSkills ng-value=false>has at least one of the following skills<br>search by skills (comma seperated list) <input ng-model=skills ng-list><button ng-click=fetchUsers()>search</button><div><div ng-repeat="user in users">{{ user.name }}</div></div></div>'),a.put("app/skills/skills.html","<!-- Note: This is a template copied from main --><div ng-include=\"'components/navbar/navbar.html'\"></div><div ng-controller=SkillsCtrl><div><h1>{{ getCurrentUser().name }}'s Skill Details:</h1></div></div>"),a.put("components/modal/modal.html",'<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>'),a.put("components/navbar/navbar.html",'<div class="navbar navbar-default navbar-static-top" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click="isCollapsed = !isCollapsed"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href="/" class=navbar-brand>tikr</a></div><div collapse=isCollapsed class="navbar-collapse collapse" id=navbar-main><ul class="nav navbar-nav"><li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}"><a ng-href={{item.link}}>{{item.title}}</a></li><li ng-show=isLoggedIn()><a ng-href="/profiles/{{ getCurrentUser().github.login }}">Profile</a></li><li ng-show=isLoggedIn()><a ng-href=/messages>Messages</a></li><li ng-show=isAdmin() ng-class="{active: isActive(\'/admin\')}"><a href=/admin>Admin</a></li></ul><ul class="nav navbar-nav navbar-right"><li ng-show=isLoggedIn()><p class=navbar-text>Hello {{ getCurrentUser().name }}</p></li><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/settings\')}"><a href=/settings><span class="glyphicon glyphicon-cog"></span></a></li><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/logout\')}"><a href="" ng-click=logout()>Logout</a></li></ul></div></div></div>')}]);
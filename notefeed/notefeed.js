classes = new Meteor.Collection("classes");

Meteor.methods({
  addClass: function (name, user, startDate, endDate, freq) {

    classes.insert({'name':name, 'user':user, 'startDate':startDate,
        'endDate':endDate, 'freq':freq, 'notes':[]});
    //check(arg1, String);
    //check(arg2, [Number]);
    // .. do stuff ..
    // if (you want to throw an error)
    //   throw new Meteor.Error(404, "Can't find my pants");
    // return "some return value";
  }
});

if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Meteor.subscribe('userData');
  Meteor.subscribe('classes');
  
  Meteor.startup(function () {
    $("#newClassForm").hide();
  });

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      console.log("clicked");
      $("#ohno").show();
    }
  });

  Template.menubar.events({
    'click #newClass' : function () {
      $("#newClassForm").show();
    }
  })

  Template.newClass.events({
    'click #newClass_submit' : function () {
      var name = $("#newClass_name").val();
      var user = Meteor.user().username;
      var startDate = $("#newClass_startDate").val();
      var endDate = $("#newClass_endDate").val();
      var freq = $("#newClass_freq").val();

      Meteor.call('addClass', name, user, startDate, endDate, freq);
    }
  });

  Template.class.classes = function() {
    return classes.find();
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });


  Accounts.onCreateUser(function(options, user) {
    user.own_classes = [];
    user.sub_classes = [];
    user.compositeRating = 0;
    return user;
  });

  Meteor.publish("classes", function () {
    return classes.find();
  });

  Meteor.publish("userData", function () {
    return Meteor.users.find();
  });

}
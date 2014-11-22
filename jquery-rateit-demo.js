"use strict";

var Ratings = new Mongo.Collection("ratings");

if (Meteor.isClient) {
  Template.ratingBoard.helpers({
    ratings: function () {
      return Ratings.find({});
    },
    ratingsLoaded: function () {
      return Session.get('ratingsLoaded');
    }
  });

  // .rateit elements need to be progressively enhanced after they're created
  Template.rating.rendered = function () {
    // at .created() time, it's too early to run rateit(), so run it at rendered()
    this.$('.rateit').rateit();
  }

  Template.ratingBoard.events({
    'submit form' : function (event, template) {
      Ratings.insert({
        what: template.find('input').value,
        rating: template.$('#add-rating').rateit('value')  // that's how you fetch the rating
      });
      return false;  // don't submit the form
    }
  });

  Meteor.subscribe('ratings', function onReady() {
    Session.set('ratingsLoaded', true);
  });


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (!Ratings.find({}).count()) {
      console.log("creating some ratings");
      Ratings.insert({what: 'meteor', rating: 5});
      Ratings.insert({what: 'php', rating: 2});
    }
  });
  Meteor.publish("ratings", function () {
    return Ratings.find({});
  });
}

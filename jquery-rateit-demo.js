"use strict";

var Ratings = new Meteor.Collection("ratings");

if (Meteor.isClient) {
  Template.ratingboard.ratings = function () {
    return Ratings.find({});
  }

  // .rateit elements need to be progressively enhanced after they're created
  Template.ratingboard.rendered = function () {
    // at .created() time, it's too early to run rateit(), so run it at rendered()
    $(this.findAll('.rateit')).rateit();
  }

  Template.ratingboard.events({
    'click #add-button' : function () {
      Ratings.insert({
        what: $('#add-what').val(),
        rating: $('#add-rating').rateit('value')  // that's how you fetch the rating
      });
    }
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
}

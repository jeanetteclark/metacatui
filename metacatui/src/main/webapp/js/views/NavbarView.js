/*global define */

define(['jquery', 'underscore', 'backbone', 'text!templates/navbar.html'], 				
	function($, _, Backbone, NavbarTemplate) {
	'use strict';
	
	// Build the navbar view of the application
	var NavbarView = Backbone.View.extend({

		el: '#Navbar',
		
		template: _.template(NavbarTemplate),
		
		events: {
			'click #search_btn': 'triggerSearch'
		},
		
		initialize: function () {
			// listen to the appModel for changes in username
			//this.listenTo(appModel, 'change:username', this.render);
			this.listenTo(appModel, 'change:fullName', this.render);
			this.listenTo(appModel, 'change:searchTerm', this.render);
			this.listenTo(appModel, 'change:navbarPosition', this.render);
		},
				
		render: function () {
			console.log('Rendering the navbar');
			
			// set the davbar positioning based on what the page requested
			var navbarPosition = appModel.get('navbarPosition');
			if ( navbarPosition ) {
				$(this.$el).css('position', navbarPosition);
				
			} else {
				$(this.$el).css('position', 'fixed'); // default to fixed
				
			}
			
			// set the username in the template (can be null if not logged in)
			this.$el.html(
					this.template( 
							{
								username: appModel.get('username'),
								fullName: appModel.get('fullName'),
								searchTerm: appModel.get('searchTerm')
							} 
					)
			);
		},
		
		triggerSearch: function() {
			// alert the model that a search should be performed
			var searchTerm = $("#search_txt").val();
			appModel.set('searchTerm', searchTerm);
			appModel.trigger('search');
			
			// make sure the browser knows where we are
			uiRouter.navigate("data", {trigger: true});
			
			// ...but don't want to follow links
			return false;
			
		}
				
	});
	return NavbarView;		
});

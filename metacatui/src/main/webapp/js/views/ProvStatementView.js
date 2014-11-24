define(['jquery', 'underscore', 'backbone', 'views/ExpandCollapseListView', 'text!templates/provStatement.html'], 				
	function($, _, Backbone, ExpandCollapseList, ProvTemplate) {
	'use strict';

	
	var ProvStatementView = Backbone.View.extend({
		
		initialize: function(options){
			if((options === undefined) || (!options)) var options = {};
			
			this.id   		= options.id	 	 || null;
			this.attributes = options.attributes || null;
			this.className += options.className  || "";
		},
		
		template: _.template(ProvTemplate),
		
		tagName : "div",
		
		className : "provenance alert alert-info",
		
		events: {
			
		},
		
		/*
		 * Creates a provenance statement and inserts it into the template
		 * param doc = SolrResult model representing one object from the index. All provenance retrieved is in relation to this object.
		 */
		render: function(doc){
			if((doc === undefined) || !doc) return false;
			
			var view 	= this,
				hasProv = true;
			
			//Add the provenance statement HTML from the template
			this.$el.html(view.template());
			
			//Support an array of documents or a single doc
			if(!Array.isArray(doc)) doc = [doc];

			_.each(doc, function(thisDoc){
				
				//Get the provenance for this document
				var lists = view.getProvenance(thisDoc);
				
				if(!lists.length){
					view.$el.remove();
					hasProv = false;
					return;
				}
				
				//We will get an array of ID lists back.
				_.each(lists, function(list){
					//Render each ID list
					var html = list.render().el;
					//Insert the list element into the DOM
					view.$el.find(".provenance-statement").append(html);
				});
			});
				
			if(!hasProv) return false;
			
			return this;
		},
		
		getProvenance: function(doc){
			var statements = [],
				formatId = doc.get('formatId'),
				formatType = doc.get('formatType'),
				wasDerivedFrom = doc.get('wasDerivedFrom'),
				wasGeneratedBy = doc.get('wasGeneratedBy'),
				used = doc.get('used'),
				wasInformedBy = doc.get('wasInformedBy');
			
			// Get the type of object this is
			var noun = "";
			
			//Check for images 
			if(formatId.substring(0, 5) == "image")
				noun = "image";
			
			//Check for data tables
			switch(formatId){
				case "text/csv": 
					noun = "table";
					break;
				case "application/vnd.ms-excel":
					noun = "table";
					break;
				case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
					noun = "table";
					break;
			}
			
			//Default to more generic terms
			if(!noun){
				if(formatType == "DATA") noun = "data";
				else if(formatType == "METADATA") noun = "metadata";
				else noun = "object";
			}

			//Create the provenance statement(s)
			if(wasDerivedFrom && wasGeneratedBy){
				var wasGeneratedByText = new ExpandCollapseList({
					list 		: wasGeneratedBy,
					prependText : "This " + noun + " was generated by the program(s) ",
					appendText  : " which used "
				});
				
				var wasDerivedFromText = new ExpandCollapseList({
					list 		: wasDerivedFrom,
					appendText : ". "
				});
				
				statements.push(wasGeneratedByText, wasDerivedFromText);
				
				/*prov += "This " + noun + " was derived from " +
						wasDerivedFrom.render().$el.html() +
						"and was generated by " +
						wasGeneratedBy.render().$el.html() +
						". ";*/
			}
			else if(wasDerivedFrom){
				var wasDerivedFromText = new ExpandCollapseList({
					list 		: wasDerivedFrom,
					prependText : "This " + noun + " was derived from ",
					appendText  : ". "
				});
				
				statements.push(wasDerivedFromText);
			}
			else if(wasGeneratedBy){
				var wasGeneratedByText = new ExpandCollapseList({
					list 		: wasGeneratedBy,
					prependText : "This " + noun + " was generated by ",
					appendText  : ". "
				});
				
				statements.push(wasGeneratedByText);
			}

			//If there is a used statement we can assume this object is a "program" or prov:Plan
			if(used){
				var usedText = new ExpandCollapseList({
					list	    : used,
					prependText : "This program used ",
					appendText  : ". "
				});
				
				statements.push(usedText);
			}
			
			//If there is a wasInformedBy statement we can assume this object is a "program" or prov:Plan
			if(wasInformedBy){
				var wasInformedByText = new ExpandCollapseList({
					list 		: wasInformedBy,
					prependText : "This program was generated by ",
					appendText  : ". "
				});
				
				statements.push(wasInformedByText);
			}
			
			return statements;
		}
	});
	
	return ProvStatementView;		
});
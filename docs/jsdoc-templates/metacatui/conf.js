'use strict';

module.exports = {
  "source": {
    "excludePattern": "js/themes/|components/|config/|css/|font/|img/",
    "include": ["docs/other/addtlDocs.jsdoc"]
  },
  "templates": {
    "default": {
      "outputSourceFiles" : true,
      "layoutFile" : "./docs/jsdoc-templates/metacatui/tmpl/layout.tmpl",
      "staticFiles": {
        "include": [
            "./docs/jsdoc-templates/metacatui/static/styles/style.css"
        ]
      }
    }
  },
  "opts": {
    "template": "./docs/jsdoc-templates/metacatui"
  }
}

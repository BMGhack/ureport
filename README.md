# uReport
Link: [uReport](http://ella.ils.indiana.edu/~jeffravi/uReport/)

## Directory
```
ureport
│   index.html
│   api.php
│   
└───lib 
│
└───images
│
└───js 
│
└───css
```
    - index.html 
        - Loads all the categories & services dynamically on pageload through HTTP Get
        - Similarly on click of each service the service definitions are loaded dynmaically using underscore.js templates
        - Templates can be found within script tags in index.html
    - api.php
        - has endpoints such as loadServices, getServiceDefinition & postRequest
    - js & css directory has custom scripts
    - lib has third party libraries

## Dependency
### PHP 
    - For routing and warping open311 api
    - Holding encapsulating API key 
### SCSS
    - Preprocessor for CSS 
    - Increases the manageability of CSS 
### Javascript Plugins
    - Jquery
    - Underscore js 
        - For Templating html snippets
        - Can be migrated to Vue.js or Angular in future
    - Bootstrap 4 - For responsive layout
    - Google Map API
    - blockUI - Can be replaced with JQuery/Plain Javascript
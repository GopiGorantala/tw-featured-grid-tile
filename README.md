##Featured-Items-With-Images:

The tile is designed to share the information with images.
You can add images as the background to the featured links/items to make the links more intuitive.

Tech Stack(primary) being used:

1. React Js
2. Jive-sdk
3. JQuery
4. Webpack


How to install and run:

1. clone the repo
2. run npm-install # installing required node packages
3. generate the uuid for the app using:
```
   var jive = require('jive-sdk');
   jive.util.guid()
   save the generated uuid into jiveclienconfiguration.json
   {
       "clientUrl": "http://localhost",
       "port": "8090",
       "development" : true,
       "extensionInfo" : {
           "uuid": "" # <- place the generated uuid here
       }
   }
```
4. run webpack command to compile the jsx files # this refers to webpack.config.js
5. run " jive-sdk build add-on --apphosting="jive" " # creation of extension.zip to be uploaded to jive.

How to use the tile:

1. Add links with the background image urls and save
2. View the configured data on Tile View.


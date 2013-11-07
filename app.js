
//-----------------------------------------------------------------------------------------------
// Module dependencies.
//-----------------------------------------------------------------------------------------------

var express   = require('express')
  , routes    = require('./routes')
  , http      = require('http')
  , fs        = require('fs')
  , phantom   = require('phantom')
  , os        = require('os').networkInterfaces()
  , path      = require('path')
  , app       = express()
  , server    = http.createServer(app); 


//-----------------------------------------------------------------------------------------------
//Configurations
//-----------------------------------------------------------------------------------------------
app.configure(function(){
  app.use(express.favicon(__dirname + '/public/image/favicon.ico')); 
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.logger('dev'));
  app.use(express.methodOverride());
  app.use(express.bodyParser());

  
  
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure( 'development', function (){
  app.use( express.errorHandler({ dumpExceptions : true, showStack : true }));
});
 
//app.configure( 'production', function (){
//  app.use( express.errorHandler());
//});

//-----------------------------------------------------------------------------------------------
//Navigations routes
//-----------------------------------------------------------------------------------------------
app.get('/', routes.index);



//-----------------------------------------------------------------------------------------------
//Web Service
//-----------------------------------------------------------------------------------------------

app.post('/services', function (req, res){
    console.log(req.body);
    switch(req.body.type)
    {
      case 'convertToPDF':
        phantom.create(function(ph){
          ph.createPage(function(page) {
            page.open(req.body.URLText, function(status) {
              page.render('document.pdf', function(){
                ph.exit();
                res.contentType('json');
                var result={
                    "status": '1',
                     "outputName": 'document.pdf' 
                };
                res.write(JSON.stringify(result));
                res.end();

              });
            });
          });
        });
      break;

    }
 });

// Start server
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


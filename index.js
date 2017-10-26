let express 	= require('express');
let app 		= express();
let port		= process.env.PORT || 3000;
let router		= express.Router();

app.listen(port);

let express 	= require('express');
let app 		= express();
let port		= process.env.PORT || 3000;

let bodyParser	= require('body-parser');
let calculator	= require('./calculator');

app.use(express.static('static'));
app.use(bodyParser.json());
app.set('trust proxy', true);


app.get('/', function(req, res) {
	res.sendFile('static/index.html');
});

app.get('/option2', function(req, res) {
	res.sendFile('static/option2.html', {
		root: __dirname
	});
});
app.get('/option3', function (req, res) {
	res.sendFile('static/option3.html', {
		root: __dirname
	});
});

app.post('/calculate', function(req, res) {

	let args = [req.body.termLength, req.body.remitRate100M, req.body.remitRate10M, req.body.remitRate1M, req.body.remitRate100K, req.body.remitRate75K, req.body.remitRate50K];
	let rate = calculator.calculatePayment(...args);
	res.status(rate.status).json(rate);
});

app.listen(port);

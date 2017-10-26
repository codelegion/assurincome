var assert = require('assert');
var calculator = require('../calculator');

describe('Core Calculations', function() {
	describe('#getRateFactor()', function() {
		it('Should return 0.2 for 30 year term length', function() {
			assert.equal(0.20, calculator.getRateFactor(30));
		});
		it('Should return 0.253 for 10 year term length', function() {
			assert.equal(0.253, calculator.getRateFactor(10).toFixed(3));
		});
		it('Should return 0.90 for a 1 year term length', function() {
			assert.equal(0.90, calculator.getRateFactor(1));
		})
	});

	describe('#getRateComponent1()', function() {
		it('Should return 235 for 40% remitRate100M', function() {
			assert.equal(235, calculator.getRateComponent1(0.40).toFixed(0));
		})
		it('Should return 265 for 45% remitRate100M', function () {
			assert.equal(265, calculator.getRateComponent1(0.45).toFixed(0));
		})
		it('Should return 59 for 10% remitRate100M', function () {
			assert.equal(59, calculator.getRateComponent1(0.10).toFixed(0));
		})
	});

	describe('#getRateComponent2()', function() {
		it('Should return 590 for 45% remitRate100M and 40% remitRate10M', function() {
			assert.equal(590, calculator.getRateComponent2(0.45, 0.40).toFixed(0));
		})
		it('Should return 95 for 45% remitRate100M and 0% remitRate10M', function () {
			assert.equal(95, calculator.getRateComponent2(0.45, 0.00).toFixed(0));
		})
		it('Should return 208 for 40% remitRate100M and 10% remitRate10M', function () {
			assert.equal(208, calculator.getRateComponent2(0.40, 0.10).toFixed(0));
		})
	});

	describe('#getRateComponent3()', function() {
		it('Should return 1156 for 35% remitRate1M and 20% remitRate100K', function() {
			assert.equal(1156, calculator.getRateComponent3(0.35, 0.20).toFixed(0));
		})
		it('Should return 1156 for 40% remitRate1M and 0% remitRate100K', function () {
			assert.equal(1415, calculator.getRateComponent3(0.40, 0.00).toFixed(0));
		})
		it('Should return 1156 for 40% remitRate1M and -10% remitRate100K', function () {
			assert.equal(1456, calculator.getRateComponent3(0.40, -0.10).toFixed(0));
		})
	});

	describe('#getRateComponent4()', function() {
		it('Should return 2904 for 35% remitRate1M and 20% remitRate100K', function () {
			assert.equal(2904, calculator.getRateComponent4(0.35, 0.20).toFixed(0));
		})
		it('Should return 520 for 40% remitRate1M and 0% remitRate100K', function () {
			assert.equal(520, calculator.getRateComponent4(0.40, 0.00).toFixed(0));
		})
		it('Should return -705 for 40% remitRate1M and -10% remitRate100K', function () {
			assert.equal(-705, calculator.getRateComponent4(0.40, -0.10).toFixed(0));
		})
	});

	describe('#getRateComponent5()', function () {
		it('Should return -13 for 20% remitRate100K and -20% remitRate75K', function () {
			assert.equal(-13, calculator.getRateComponent5(0.20, -0.20).toFixed(0));
		})
		it('Should return 94 for 20% remitRate100K and 0% remitRate75K', function () {
			assert.equal(94, calculator.getRateComponent5(0.20, 0.00).toFixed(0));
		})
		it('Should return -161 for 0% remitRate100K and -30% remitRate75K', function () {
			assert.equal(-161, calculator.getRateComponent5(0.00, -0.30).toFixed(0));
		})
	});

	describe('#getRateComponent6()', function () {
		it('Should return -12 for 10% remitRate75K and -10% remitRate50K', function () {
			assert.equal(-12, calculator.getRateComponent6(0.10, -0.10).toFixed(0));
		})
		it('Should return -461 for -20% remitRate75K and -40% remitRate50K', function () {
			assert.equal(-461, calculator.getRateComponent6(-0.20, -0.40).toFixed(0));
		})
		it('Should return -137 for 0% remitRate75K and 0% remitRate50K', function () {
			assert.equal(-137, calculator.getRateComponent6(-0.20, 0.00).toFixed(0));
		})
	});

	describe('#getRate()', function() {
		it('Should return 2223 for [0.40, 0.40, 0.35, 0, -0.10, -0.20] remit rates', function() {
			assert.equal(2223, calculator.getRate(0.40, 0.40, 0.35, 0, -0.10, -0.20).toFixed(0));
		})
		it('Should return 2763 for [0.45, 0.40, 0.35, 0.10, -0.30, -0.80] remit rates', function () {
			assert.equal(2763, calculator.getRate(0.45, 0.40, 0.35, 0.10, -0.30, -0.80).toFixed(0));
		})
	});
});

describe('Data Validation', function() {
	describe('Check data types', function() {
		it('Should return status 200 for all numeric values', function() {
			assert.equal(200, calculator.calculatePayment(30, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10).status);
		})
		it('Should return status 400 for missing values', function () {
			assert.equal(400, calculator.calculatePayment(30).status);
		})
		it('Should return status 400 for all non-numeric values', function () {
			assert.equal(400, calculator.calculatePayment(30, 'abc', 0.10, 0.10, true, 0.10, null).status);
		})
	})
	describe('Check data ranges', function() {
		it('Should return status 400 for term length > 30', function() {
			assert.equal(400, calculator.calculatePayment(45, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10).status);
		})
		it('Should return status 400 for term length < 1', function () {
			assert.equal(400, calculator.calculatePayment(0, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10).status);
		})
		it('Should return status 400 for remitRate100M > 0.45', function() {
			assert.equal(400, calculator.calculatePayment(30, 0.50, 0.10, 0.10, 0.10, 0.10, 0.10).status);
		})
		it('Should return status 400 for remitRate100M < 0.00', function () {
			assert.equal(400, calculator.calculatePayment(30, -0.10, 0.10, 0.10, 0.10, 0.10, 0.10).status);
		})
		it('Should return status 400 for remitRate10M > 0.45', function () {
			assert.equal(400, calculator.calculatePayment(30, 0.40, 0.50, 0.10, 0.10, 0.10, 0.10).status);
		})
		it('Should return status 400 for remitRate10M < 0.00', function () {
			assert.equal(400, calculator.calculatePayment(30, 0.40, -0.10, 0.10, 0.10, 0.10, 0.10).status);
		})
		it('Should return status 400 for remitRate1M > 0.45', function () {
			assert.equal(400, calculator.calculatePayment(30, 0.40, 0.40, 0.50, 0.10, 0.10, 0.10).status);
		})
		it('Should return status 400 for remitRate1M < -0.01', function () {
			assert.equal(400, calculator.calculatePayment(30, 0.40, 0.40, -0.10, 0.10, 0.10, 0.10).status);
		})
		it('Should return status 400 for remitRate100K > 0.45', function () {
			assert.equal(400, calculator.calculatePayment(30, 0.40, 0.40, 0.40, 0.50, 0.10, 0.10).status);
		})
		it('Should return status 400 for remitRate100K < -1', function () {
			assert.equal(400, calculator.calculatePayment(30, 0.40, 0.40, 0.40, -2, 0.10, 0.10).status);
		})
		it('Should return status 400 for remitRate75K > 0.60', function () {
			assert.equal(400, calculator.calculatePayment(30, 0.40, 0.40, 0.40, 0.40, 1, 0.10).status);
		})
		it('Should return status 400 for remitRate75K < -1', function () {
			assert.equal(400, calculator.calculatePayment(30, 0.40, 0.40, 0.40, 0.40, -2, 0.10).status);
		})
		it('Should return status 400 for remitRate50K > 0.60', function () {
			assert.equal(400, calculator.calculatePayment(30, 0.40, 0.40, 0.40, 0.40, 0.40, 1).status);
		})
		it('Should return status 400 for remitRate50K < -1', function () {
			assert.equal(400, calculator.calculatePayment(30, 0.40, 0.40, 0.40, 0.40, 0.40, -2).status);
		})
	})
});

describe('Integrating Testing', function() {
	describe('#calculatePayment()', function() {
		it('Should return 2211 for 30 year w/ [0.45, 0.40, 0.35, 0.10, -0.30, -0.80] remit rates', function() {
			assert.equal(2211, calculator.calculatePayment(30, 0.45, 0.40, 0.35, 0.10, -0.30, -0.80).price.toFixed(0));
		})
		it('Should return 2065 for 10 year w/ [0.45, 0.40, 0.35, 0.10, -0.30, -0.80] remit rates', function () {
			assert.equal(2065, calculator.calculatePayment(30, 0.45, 0.40, 0.35, 0.10, -0.30, -0.80).price.toFixed(0));
		})
	})
})
class Calculator {

	constructor() {

	}

	/**
	 * Calculate the payment received from the asset
	 * 
	 * @param {Number} termLength - number of years into the future when the asset matures
	 * @param {Number} RemitRate100M - percentage of income paid into the asset if total income exceeds 100M
	 * @param {any} remitRate10M - percentage of income paid into the asset if total income exceeds 10M
	 * @param {any} remitRate1M - percentage of income paid into the asset if total income exceeds 1M
	 * @param {any} remitRate100K - percentage of income paid into the asset if total income exceeds 100K
	 * @param {any} remitRate75K - percentage of income paid into the asset if total income exceeds 75K
	 * @param {any} remitRate50K - percentage of income paid into the asset if total income exceeds 50K
	 * @memberof Calculator
	 */
	calculatePayment(termLength, remitRate100M, remitRate10M, remitRate1M, remitRate100K, remitRate75K, remitRate50K) {
		
		const Joi = require('joi');
		const schema = Joi.object().keys({
			termLength: Joi.number().min(1).max(30).required(),
			remitRate100M: Joi.number().min(0).max(0.45).required(),
			remitRate10M: Joi.number().min(0).max(0.45).required(),
			remitRate1M: Joi.number().min(-0.01).max(0.45).required(),
			remitRate100K: Joi.number().min(-1).max(0.45).required(),
			remitRate75K: Joi.number().min(-1).max(0.60).required(),
			remitRate50K: Joi.number().min(-1).max(0.60).required()
		});

		const data = {
			termLength: termLength,
			remitRate100M: remitRate100M,
			remitRate10M: remitRate10M,
			remitRate1M: remitRate1M,
			remitRate100K: remitRate100K,
			remitRate75K: remitRate75K,
			remitRate50K: remitRate50K
		}

		const {error, value} = Joi.validate(data, schema);
		if (error) {
			return {
				status: 400,
				errors: error
			}
		} else {

			termLength = parseInt(termLength);
			remitRate100M = parseFloat(remitRate100M);
			remitRate10M = parseFloat(remitRate10M);
			remitRate1M = parseFloat(remitRate1M);
			remitRate100K = parseFloat(remitRate100K);
			remitRate75K = parseFloat(remitRate75K);
			remitRate50K = parseFloat(remitRate50K);

			let price = this.getRate(remitRate100M, remitRate10M, remitRate1M, remitRate100K, remitRate75K, remitRate50K) * (1 - this.getRateFactor(termLength));
			let roundedValue = Math.round(price);
			return {
				status: 200,
				price: roundedValue
			};
		}


	}

	getRateFactor(termLength) {
		let factors = Array(30);
		factors[0] = 0.90;
		factors[29] = 0.20;
		for (var i = 1; i < 28; i++) {
			factors[i] = factors[29] + (factors[i - 1] - factors[29]) * 0.75;
		}

		return factors[termLength - 1];
	}

	getRate(remitRate100M, remitRate10M, remitRate1M, remitRate100K, remitRate75K, remitRate50K) {
		let rateComponents = [];
		rateComponents.push(this.getRateComponent1(remitRate100M));
		rateComponents.push(this.getRateComponent2(remitRate100M, remitRate10M));
		rateComponents.push(this.getRateComponent3(remitRate1M, remitRate100K));
		rateComponents.push(this.getRateComponent4(remitRate1M, remitRate100K));
		rateComponents.push(this.getRateComponent5(remitRate100K, remitRate75K));
		rateComponents.push(this.getRateComponent6(remitRate75K, remitRate50K));

		let rate = rateComponents.reduce(function (a, b) {
			return a + b;
		});

		return rate;
	}

	getRateComponent1(remitRate100M) {
		let component = 0.0000027 * (217818000 * (remitRate100M + (217818000 / 900000000) * (remitRate100M - remitRate100M)));
		return component;
	}

	getRateComponent2(remitRate100M, remitRate10M) {
		let component = 0.0001099 * (13177237 * (remitRate10M + (13177237 / 90000000) * (remitRate100M - remitRate10M)));
		return component;
	}

	getRateComponent3(remitRate1M, remitRate100K) {
		let component = 0.0026484 * (1180949 * (remitRate1M + (1180949 / 9000000) * (remitRate1M - remitRate100K)));
		return component;
	}

	getRateComponent4(remitRate1M, remitRate100K) {
		let component = 0.1568892 * (86326 * (remitRate100K + (86326 / 900000) * (remitRate1M - remitRate100K)));
		return component;
	}

	getRateComponent5(remitRate100K, remitRate75K) {
		let component = 0.0863068 * (11671 * (remitRate75K + (11671 / 25000) * (remitRate100K - remitRate75K)));
		return component;
	}

	getRateComponent6(remitRate75K, remitRate50K) {
		let component = 0.13051 * (11458 * (remitRate50K + (11458 / 25000) * (remitRate75K - remitRate50K)));
		return component;
	}

}

module.exports = new Calculator;
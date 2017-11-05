var Vue = require('vue/dist/vue');
import VueResource from 'vue-resource';
Vue.use(VueResource);

Vue.config.devtools = true;
var app = new Vue({
	el: '#app',
	data: {
		termLength: 30,
		remitRate100M: "0.30",
		remitRate10M: "0.30",
		remitRate1M: "0.30",
		remitRate100K: "0.30",
		remitRate75K: "0.30",
		remitRate50K: "0.30",
		status: null,
		price: null,
		errorMsg: null
	},
	mounted: function() {
		this.getRate();
	},
	methods: {
		getRate: function() {
			this.price = null;
			this.$http.post('/calculate', {
				termLength: this.termLength,
				remitRate100M: this.remitRate100M,
				remitRate10M: this.remitRate10M,
				remitRate1M: this.remitRate1M,
				remitRate100K: this.remitRate100K,
				remitRate75K: this.remitRate75K,
				remitRate50K: this.remitRate50K
			})
			.then(function(response) {
				// success callback
				this.status = response.status;
				this.price = response.body.price;
			}, function(response) {
				// error callback
				this.status = 400;
			})
		}
	},
	computed: {
		yearInFuture: function() {
			var year = new Date().getFullYear();
			return year + parseInt(this.termLength);
		},
		yearSettled: function() {
			return this.yearInFuture + 1;
		},
		formattedRate: function() {
			if (this.price == null)
			{
				return '$--'
			}
			return '$' + parseFloat(this.price).toLocaleString();
		}
	},
	watch: {
		termLength: function () {
			this.getRate();
		},
		remitRate100M: function() {
			this.getRate();
		},
		remitRate10M: function () {
			this.getRate();
		},
		remitRate1M: function () {
			this.getRate();
		},
		remitRate100K: function () {
			this.getRate();
		},
		remitRate75K: function () {
			this.getRate();
		},
		remitRate50K: function () {
			this.getRate();
		},
	}
});
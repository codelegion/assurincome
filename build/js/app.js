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
		errorMsg: null,
		percentageTooLowWarning: false
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
				this.price = parseFloat(response.body.price);
				if (this.price < 0)
				{
					this.percentageTooLowWarning = true;
				} else {
					this.percentageTooLowWarning = false;
				}
				
			}, function(response) {
				// error callback
				this.status = 400;
				this.price = null;
				this.percentageTooLowWarning = false;
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
				return '';
			}
			if (this.price < 0)
			{
				return '';
			}
			return '$' + parseFloat(this.price).toLocaleString();
		},
		successResponse: function() {
			if (this.status != null)
			{
				if (this.status != 200)
				{
					return false;
				}
			}
			return true;
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

document.addEventListener('DOMContentLoaded', function () {

	// Get all "navbar-burger" elements
	var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

	// Check if there are any navbar burgers
	if ($navbarBurgers.length > 0) {

		// Add a click event on each of them
		$navbarBurgers.forEach(function ($el) {
			$el.addEventListener('click', function () {

				// Get the target from the "data-target" attribute
				var target = $el.dataset.target;
				var $target = document.getElementById(target);

				// Toggle the class on both the "navbar-burger" and the "navbar-menu"
				$el.classList.toggle('is-active');
				$target.classList.toggle('is-active');

			});
		});
	}

});
const env = require('../utils/ENV');
// const Connector = require('../helpers/Connector');
const ScrollHelper = require('../helpers/ScrollHelper');
const Inputmask = require('inputmask');

function Validations() {
	if (!env.isMobile) {
		const $phone = $('input[type="phone"]');
		const phone = new Inputmask({ mask: '+9{1,3} (999) 999-99-99', greedy: true });
		phone.mask($phone);
	}

	this.$allInput = $('input[data-input]');

	// this.$parent = '[data-form-group]';
	this.$allInput.on('focusout', e => {
		const $this = $(e.currentTarget);
		const $form = $this.closest('[data-form-validation]');

		const willSubmit = this.test($form);
		if (willSubmit) {
			$form.find('[data-form-submit]').attr('disabled', false);
		} else {
			$form.find('[data-form-submit]').attr('disabled', true);
		}
	});

	this.$allInput.on('focus', e => {
		const $this = $(e.currentTarget);
		$this.parent('[data-form-group]').removeClass('_error');
		$this.parent('[data-form-group]').removeClass('_valid');
	});

	$('form[data-form-validation]').on('submit', e => {
		e.preventDefault();
		const $form = $(e.currentTarget);
		const willSubmit = this.test($form);

		if (willSubmit) {
			//const $data = $form.serialize();
			this.send($form /*, $data*/);
		} else {
			ScrollHelper.scrollTo($form);
		}
	});
}

Validations.prototype = {
	isName: function(string) {
		// eslint-disable-next-line
		const re = /^[а-яё]|[a-z]$/;
		return re.test(string);
	},
	isEmail: function(string) {
		// eslint-disable-next-line
		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(string);
	},
	isPhone: function(string) {
		// eslint-disable-next-line
		const re = /[0-9]/;
		return re.test(string);
	},
	isSite: function(string) {
		// eslint-disable-next-line
		const re = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/;
		return re.test(string);
	},
	testInput: function($input, lightMode) {
		$input.parent('[data-form-group]').removeClass('_error');
		$input.parent('[data-form-group]').removeClass('_valid');

		const value = $.trim($input.val());

		const isRequired = typeof $input.attr('data-required') != 'undefined';
		if (!isRequired) {
			if (value.length == 0) {
				// !lightMode && $input.closest('[data-form-group]').addClass('_error');
				return true;
			}
		}

		var isName = typeof $input.attr('data-name') != 'undefined';
		if (isName) {
			if (!this.isName(value)) {
				!lightMode && $input.parent('[data-form-group]').addClass('_error');
				return false;
			} else {
				!lightMode && $input.parent('[data-form-group]').addClass('_valid');
				return true;
			}
		}

		var isEmail = typeof $input.attr('data-email') != 'undefined';
		if (isEmail) {
			if (!this.isEmail(value)) {
				!lightMode && $input.parent('[data-form-group]').addClass('_error');
				return false;
			} else {
				!lightMode && $input.parent('[data-form-group]').addClass('_valid');
				return true;
			}
		}

		var isPhone = typeof $input.attr('data-phone') != 'undefined';
		if (isPhone) {
			var testPhone = this.isPhone(value);
			if (!this.isPhone(value) || !testPhone) {
				!lightMode && $input.parent('[data-form-group]').addClass('_error');
				return false;
			} else {
				!lightMode && $input.parent('[data-form-group]').addClass('_valid');
				return true;
			}
		}

		var isSite = typeof $input.attr('data-site') != 'undefined';
		if (isSite) {
			var testSite = this.isSite(value);
			if (!this.isSite(value) || !testSite) {
				!lightMode && $input.parent('[data-form-group]').addClass('_error');
				return false;
			} else {
				!lightMode && $input.parent('[data-form-group]').addClass('_valid');
				return true;
			}
		}
	},

	test: function($form, lightMode) {
		const $inputs = $form.find('input,textarea'); // .outline( false );
		let willSubmit = true;
		const totalInputs = $inputs.length;
		for (let k = 0; k < totalInputs; k++) {
			const inputCheck = this.testInput($inputs.eq(k), lightMode);
			if (inputCheck == false) {
				// $inputs.eq(k).outline()
				willSubmit = false;
			}
		}
		// console.log(willSubmit)
		return willSubmit;
	},
	error($form) {
		ScrollHelper.scrollTo($form);
	},
	send($form /*, $data*/) {
		let action = $form.attr('action');
		if (!action || action == '') {
			console.error('No form action attribute!');
			return;
		}

		$form.addClass('_loading');

		let formData = new FormData($form[0]);

		$form.trigger('beforeSend', [formData]);

		let $formMain = $form.find('[data-form-main]');
		let $formComplete = $form.find('[data-form-complete]');
		let $formError = $form.find('[data-form-error]');
		let $formReset = $form.find('[data-form-reset]');

		let request = new XMLHttpRequest();
		request.open('POST', action, true);
		request.onload = function(e) {
			// TweenMax.to($formMain.nope(), 0.15, { alpha: 0.5 });

			if (request.status == 200) {
				$formComplete.slideDown();
			} else {
				$formError.slideDown();
			}

			$formReset.slideDown();

			$form.removeClass('_loading');
			$formMain.slideUp();
			console.log(request.response);
		};

		request.send(formData);

		$formReset.on('click', e => {
			e.preventDefault();
			$formReset.slideUp();
			// TweenMax.to($formMain.nope(false), 0.15, { alpha: 1 });
			$formMain.slideDown('fast').nope(false);
			TweenMax.set($formMain, { alpha: 1 });

			$formComplete.slideUp('fast');

			$form.find('input:not([type="submit"]), textarea').val('');
		});

		TweenMax.to($formMain.nope(), 0.15, { alpha: 0 });
	},
};

module.exports = new Validations();

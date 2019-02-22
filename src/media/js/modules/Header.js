let dom = require('../utils/DOM');
let env = require('../utils/ENV');

let $header = $('.header');

function HeaderHelper() {
	dom.$window.on('scroll', () => {
		this._initStickyHeader();
		this._initProgress();
	});

	dom.$window.on('load', () => {
		this._initFadeText();
	});
}

HeaderHelper.prototype = {
	_initStickyHeader() {
		let $target = $('[data-hide-on-scroll]');

		if (dom.$window.scrollTop() > $header.outerHeight()) {
			$target.addClass('_active');
		} else {
			$target.removeClass('_active');
		}
	},

	_initProgress() {
		let $progress = $('.progress');
		let width = dom.$window.scrollTop() / (dom.$document.height() - dom.$window.height());

		$progress.width(0);

		$progress.css({
			width: ((100 * width) | 0) + '%',
		});
	},

	_initFadeText() {
		let $el = $('[data-text]:first');
		fadeText($el, 200, 2);

		function fadeText(element, delay, accentWords) {
			let text = $.trim(element.text()),
				words = text.split(' '),
				html = '',
				height = element.height();

			if (!env.isMobile) {
				if (dom.$body.width() > 768) {
					element.css({ height: height });

					for (let i = 0; i < words.length; i++) {
						if (i < accentWords) {
							html += `<span class='_light'>${words[i]}${i + 1 === words.length ? '' : ' '}</span>`;
						} else {
							html += `<span>${words[i]}${i + 1 === words.length ? '' : ' '}</span>`;
						}
					}
					element.css({ opacity: 1 });
					element
						.html(html)
						.children()
						.hide()
						.each(function(i) {
							$(this)
								.delay(i * delay)
								.fadeIn(words[i].length > 3 ? words[i].length * 85 : 250);
						});
				}
			} else {
				$header.css({ height: dom.$window.height() });
			}
		}

		function updateHeight(element) {
			element.css({ height: 'auto' });
		}

		dom.$window.on('resize', () => {
			updateHeight($el);
		});
	},
};

var instance = (module.exports = new HeaderHelper());
instance.version = 1;

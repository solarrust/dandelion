var dom = require('../utils/DOM');
var env = require('../utils/ENV');

var $header = $('.header');
var $target = $('[data-hide-on-scroll]');
var $progress = $('.progress');
var $el = $('[data-text]:first'),
	text = $.trim($el.text()),
	words = text.split(' '),
	html = '';
var height = $el.height();
$progress.width(0);

function HeaderHelper() {
	dom.$window.on('scroll', () => {
		// if (!env.isMobile) {
		// 	if (dom.$window.scrollTop() > $header.outerHeight() - 35) {
		// 		$target.children().addClass('_visible');
		// 	} else {
		// 		$target.children().removeClass('_visible');
		// 	}
		// }

		if (dom.$window.scrollTop() > $header.outerHeight() - 35) {
			$target.children().addClass('_visible');
		} else {
			$target.children().removeClass('_visible');
		}

		if (dom.$window.scrollTop() > $header.outerHeight()) {
			$target.addClass('_active');
		} else {
			$target.removeClass('_active');
		}

		var width = dom.$window.scrollTop() / (dom.$document.height() - dom.$window.height());

		$progress.css({
			width: ((100 * width) | 0) + '%',
		});
	});

	dom.$window.on('load', function() {
		if (!env.isMobile) {
			if (dom.$body.width() > 768) {
				$el.css({ height: height });

				for (var i = 0; i < words.length; i++) {
					if (i == 0 || i == 1) {
						html += "<span class='_light'>" + words[i] + (i + 1 === words.length ? '' : ' ') + '</span>';
					} else {
						html += '<span>' + words[i] + (i + 1 === words.length ? '' : ' ') + '</span>';
					}
				}
				$el.css({ opacity: 1 });
				$el
					.html(html)
					.children()
					.hide()
					.each(function(i) {
						$(this)
							.delay(i * 200)
							.fadeIn(words[i].length > 3 ? words[i].length * 85 : 250);
					});
			}
		}

		if (env.isMobile) {
			$header.css({ height: dom.$window.height() });
		}
	});
	dom.$window.on('resize', () => {
		$el.css({ height: 'auto' });
	});
}

var instance = (module.exports = new HeaderHelper());
instance.version = 1;

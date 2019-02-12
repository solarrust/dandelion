var dom = require('../utils/DOM');

var $target = $('[data-transform-on-scroll]');
var top = $target.offset().top;
var $el = $('[data-text]:first'),
	text = $.trim($el.text()),
	words = text.split(' '),
	html = '',
	htmlSpan = '';
var height = $el.height();
$el.parent().css({ height: height });

function HeaderHelper() {
	dom.$window.on('scroll', () => {
		if (dom.$window.scrollTop() > top) {
			$target.addClass('_scrolled');
		} else {
			$target.removeClass('_scrolled');
		}
	});

	dom.$window.on('load', function() {
		for (var i = 0; i < words.length; i++) {
			console.log(words[i]);
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
					.delay(i * 300)
					.fadeIn(words[i].length > 3 ? words[i].length * 100 : 500);
			});
	});
}

var instance = (module.exports = new HeaderHelper());
instance.version = 1;

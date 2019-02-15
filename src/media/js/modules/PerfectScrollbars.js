const dom = require('../utils/DOM');
import PerfectScrollbar from 'perfect-scrollbar';

// https://github.com/noraesae/perfect-scrollbar

function PerfectScrollbars() {
	const $container = $('[data-ps]');
	if ($container.length) {
		for (let k = 0; k < $container.length; k++) {
			this.init($container[k]);
		}
	}
}

PerfectScrollbars.prototype = {
	init: function($container) {
		const ps = new PerfectScrollbar($container);

		dom.$body.on('click', '[data-ps-scroll-to]', function(e) {
			var $this = $(this);
			var $ps = $this.parents('[data-ps]').first();
			if (!$ps.length) {
				return;
			}

			var offset = $this.offset();
			var width = $this.outerWidth();

			var left = offset.left;
			var right = offset.left + width;

			var psOffset = $ps.offset();
			var psRight = psOffset.left + $ps.width();

			var needScroll = false;
			var newScrollLeft;

			if (left < psOffset.left) {
				needScroll = true;
				newScrollLeft = $ps.scrollLeft() - (psOffset.left - left) - 10;
			} else if (right > psRight) {
				needScroll = true;
				newScrollLeft = $ps.scrollLeft() + (right - psRight) + 10;
			}

			if (needScroll) {
				// console.log(newScrollLeft);
				TweenMax.to($ps, 0.25, { scrollTo: { x: newScrollLeft } });
			}
		});
	},
	update: function() {
		$('[data-ps]').perfectScrollbar('update');
	},
};

module.exports = new PerfectScrollbars();

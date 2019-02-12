var dom = require('../utils/DOM');
var env = require('../utils/ENV');

function BodyLocker() {
	this.$widthTestElements = dom.$html.add(dom.$body);

	this.$wrapper = $('.wrapper').add($('.anchor-menu'));
	//this.$scrollFixTarget = dom.$body;

	this.$widthTestElements.css({
		overflow: 'visible',
	});
	var realWidth = dom.$html.width();

	this.$widthTestElements.css({
		overflow: 'hidden',
	});
	var hiddenWidth = dom.$html.width();

	this.$widthTestElements.css({
		overflow: '',
	});

	this.scrollWidth = hiddenWidth - realWidth;
}

BodyLocker.prototype = {
	lock: function() {
		if (env.isMobile) {
			return;
		}

		if (!this.locked) {
			this.locked = true;

			this.$wrapper.css({
				marginRight: this.scrollWidth,
			});

			//dom.$body.width(dom.$window.width() - this.scrollWidth);

			/*let scrollTop = this.$scrollFixTarget.scrollTop();
			this.$scrollFixTarget.css({
				overflow: 'hidden'
			});
			this.$scrollFixTarget.scrollTop(scrollTop)*/
		}
	},
	unlock: function() {
		if (env.isMobile) {
			return;
		}

		if (this.locked) {
			this.$wrapper.css({
				marginRight: '',
			});

			this.locked = false;

			/*dom.$body.css({
				width: '',
			});*/
		}

		/*this.$scrollFixTarget.css({
			overflow: ''
		});*/
	},
};

var instance = (module.exports = new BodyLocker());
instance.version = 1;

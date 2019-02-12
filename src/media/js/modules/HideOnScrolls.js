var Ticker = require('../helpers/Ticker');
var dom = require('../utils/DOM');

var SCROLLED = '_scrolled';

function HideOnScrolls() {
	this.initializing = true;
	this.totalTargets = 0;
	this.direction = 0;

	this.updateTargets();
	this.setScrollDispatcher(dom.$window);

	this.initializing = false;

	Ticker.onTick.add(function() {
		this.update();
	}, this);

	this.update(true);
}

HideOnScrolls.prototype = {
	setScrollDispatcher: function($scrollDispatcher) {
		this.$scrollDispatcher = $scrollDispatcher;
		this.scrollTop = this._getScrollTop();

		!this.initializing && this.update(true);
	},

	updateTargets: function() {
		this.$targets = $('[data-hide-on-scroll]');
		this.targetStates = {};
		this.totalTargets = this.$targets.length;

		!this.initializing && this.update(true);
	},

	update: function(forced) {
		var oldScrollTop = this.scrollTop;
		this.scrollTop = this._getScrollTop();

		this.direction = oldScrollTop < this.scrollTop ? 1 : oldScrollTop > this.scrollTop ? -1 : 0;

		var testProps = this.scrollTop;
		if (testProps == this.testedProps && !forced) {
			return;
		}

		this.testedProps = testProps;

		for (var k = 0; k < this.totalTargets; k++) {
			this._testTarget(this.$targets.eq(k), k, forced);
		}
	},

	_getScrollTop: function() {
		var scrollTop = this.$scrollDispatcher.scrollTop();
		return scrollTop < 0 ? 0 : scrollTop;
	},

	_testTarget: function($target, targetIndex, forced) {
		var targetHeight = $target.height();
		var needHide = this.scrollTop > targetHeight && this.direction == 1;

		if (this.targetStates[targetIndex] == needHide && !forced) {
			return;
		}

		this.targetStates[targetIndex] = needHide;

		if (needHide) {
			$target.addClass(SCROLLED);
		} else {
			$target.removeClass(SCROLLED);
		}
	},
};

var instance = (module.exports = new HideOnScrolls());
instance.version = 1;

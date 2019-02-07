const utils = require('../utils/Utils');

function ShowHelper2() {
	this.listeners = [];
	this.viewportScale = 1;
	this.started = false;

	// eslint-disable-line no-unused-vars
	/* eslint-disable */
	window.addEventListener(
		'resize',
		e => {
			this.update(true);
		},
		true
	);

	window.addEventListener(
		'scroll',
		e => {
			this.update();
		},
		true
	);
	/* eslint-enable */
}

ShowHelper2.prototype = {
	start() {
		this.started = true;
		this.update(true);
	},
	stop() {
		this.started = false;
	},
	watch(target, handler, hitFlag, alwaysUpdate) {
		let $target = $(target);
		let targetLength = $target.length;
		for (let k = 0; k < targetLength; k++) {
			this.watchSingle($target[k], handler, hitFlag, alwaysUpdate);
		}
	},
	staggerWatch(target, handler, hitFlag, alwaysUpdate, staggerTime) {
		if (!staggerTime || staggerTime == 0) {
			return this.watch(target, handler, hitFlag, alwaysUpdate);
		}

		if (staggerTime <= 16) {
			console.warn('staggerTime in ms!');
		}
		let prevTime = 0;
		let $target = $(target);
		let targetLength = $target.length;
		for (let k = 0; k < targetLength; k++) {
			this.watchSingle(
				$target[k],
				(state, target) => {
					if (state) {
						let delay = 0;
						let now = utils.now();
						let timeDistance = now - prevTime;

						if (timeDistance < staggerTime) {
							delay = staggerTime - timeDistance;
						}

						prevTime = now + delay;

						setTimeout(() => {
							handler.apply(target, [true, target]);
						}, delay);
					} else {
						handler.apply(target, [false, target]);
						// TODO: Add clearTimeout somehow here
					}
				},
				hitFlag,
				alwaysUpdate
			);
		}
	},
	unwatch(target) {
		let $target = $(target);
		let targetLength = $target.length;
		for (let k = 0; k < targetLength; k++) {
			this.unwatchSingle($target[k]);
		}
	},
	watchSingle(target, handler, hitFlag, alwaysUpdate) {
		// this.unwatchSingle( target );

		let listener = {
			target: target,
			handler: handler,
			hitFlag: hitFlag,
			alwaysUpdate: !!alwaysUpdate,
		};

		this.listeners.push(listener);

		this._checkListener(listener, true);
	},
	unwatchSingle(target) {
		let totalListeners = this.listeners.length;
		for (let k = 0; k < totalListeners; k++) {
			if (this.listeners[k].target === target) {
				this.listeners.splice(k, 1);
				this.hasUnwatchAction = true;
				return;
			}
		}
	},
	requestUpdate() {
		this.waitedUpdate();
	},
	update(forced) {
		if (!this.started) {
			return;
		}

		if (forced) {
			let width = window.innerWidth;
			let height = window.innerHeight;
			let viewWidth = width * this.viewportScale;
			let viewHeight = height * this.viewportScale;

			this.viewportLeft = (width - viewWidth) / 2;
			this.viewportRight = width - this.viewportLeft;
			this.viewportTop = (height - viewHeight) / 2;
			this.viewportBottom = height - this.viewportTop;
		}

		this.pageX = Math.max(window.pageXOffset, document.body.scrollLeft);
		this.pageY = Math.max(window.pageYOffset, document.body.scrollTop);

		this.hasUnwatchAction = false;
		let testedListener;
		let totalListeners = this.listeners.length;
		for (let k = 0; k < totalListeners; k++) {
			let listener = this.listeners[k];
			if (listener && listener != testedListener) {
				this._checkListener(this.listeners[k], forced);
				testedListener = listener;
			}
			if (this.hasUnwatchAction) {
				k--;
				this.hasUnwatchAction = false;
			}
		}
		this.hasUnwatchAction = false;
	},
	setViewpostScale(scale) {
		this.viewportScale = scale;
		this.update(true);
	},
	_checkListener(listener, forced) {
		if (!this.started) {
			return;
		}

		if (forced || !listener.boundingRect || listener.alwaysUpdate) {
			let boundingClientRect = listener.target.getBoundingClientRect();
			listener.boundingRect = {
				top: boundingClientRect.top + this.pageY,
				bottom: boundingClientRect.bottom + this.pageY,
				left: boundingClientRect.left + this.pageX,
				right: boundingClientRect.right + this.pageX,
			};
		}
		let bBox = listener.boundingRect;

		let visibleState = false;
		if (listener.hitFlag) {
			visibleState =
				bBox.left < this.viewportRight + this.pageX &&
				bBox.right > this.viewportLeft + this.pageX &&
				bBox.top < this.viewportBottom + this.pageY &&
				bBox.bottom > this.viewportTop + this.pageY;
		} else {
			visibleState =
				bBox.left >= this.viewportLeft + this.pageX &&
				bBox.right <= this.viewportRight + this.pageX &&
				bBox.top >= this.viewportTop + this.pageY &&
				bBox.bottom <= this.viewportBottom + this.pageY;
		}
		if (listener.state != visibleState) {
			listener.state = visibleState;
			listener.handler.apply(listener.target, [visibleState, listener.target]);
		}
	},
};

module.exports = new ShowHelper2();

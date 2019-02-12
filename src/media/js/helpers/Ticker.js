const Callback = require('../classes/Callback');
const utils = require('../utils/Utils');

function Ticker() {
	this.onTick = new Callback();

	let activeState = true;
	let prevTime = utils.now();
	let elapsedTime = 0;
	let timeScale = 1;

	let skippedFrames = 0;
	let maxSkipFrames = 3;

	this.stop = this.pause = this.sleep = function() {
		activeState = false;
		return this;
	};

	this.start = this.wake = function() {
		activeState = true;
		return this;
	};

	this.reset = function() {
		elapsedTime = 0;
	};

	this.timeScale = function(value) {
		if (typeof value != 'undefined') {
			timeScale = value;
		}

		return timeScale;
	};

	this.toggle = function() {
		return activeState ? this.stop() : this.start();
	};

	this.isActive = function() {
		return activeState;
	};

	this.getTime = function() {
		return elapsedTime;
	};

	TweenMax.ticker.addEventListener('tick', () => {
		let nowTime = utils.now();
		let delta = (nowTime - prevTime) * timeScale;
		prevTime = nowTime;

		if (skippedFrames < maxSkipFrames) {
			skippedFrames++;
		} else {
			if (activeState) {
				elapsedTime += delta;
				this.onTick.call(delta, elapsedTime);
			}
		}
	});
}

const instance = (module.exports = new Ticker());
instance.version = 1;

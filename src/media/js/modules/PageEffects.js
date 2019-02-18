const dom = require('../utils/DOM');
const ShowHelper2 = require('../helpers/ShowHelper2');
const utils = require('../utils/Utils');

function PageEffects() {
	this._initParallax();
	this._initAutoShows();
	this._initNumberAnimations();

	ShowHelper2.start();
}
PageEffects.prototype = {
	_initParallax() {
		let $containers = $('[data-parallax-container]');
		let totalContainers = $containers.length;

		let $containerTargets = [];
		for (let k = 0; k < totalContainers; k++) {
			$containerTargets.push($containers.eq(k).find('[data-parallax]'));
		}
		let appliedRatios = [];

		function updatePositions() {
			for (let k = 0; k < totalContainers; k++) {
				let $container = $containers.eq(k);

				let offset = $container.offset();
				let top = offset.top - window.pageYOffset;
				//let height = $container.outerHeight();
				//let bottom = top + height;

				let ratio = (window.pageYOffset - top) / window.innerHeight;
				ratio = ratio < 0 ? 0 : ratio;
				ratio = ratio > 1 ? 1 : ratio;

				// $container.attr('title', ratio);

				if (appliedRatios[k] != ratio) {
					appliedRatios[k] = ratio;

					let $targets = $containerTargets[k];
					let totalTargets = $targets.length;
					let targetStep = 1 / totalTargets;
					for (let j = 0; j < totalTargets; j++) {
						let localPower = (j + 1) * targetStep;
						TweenMax.set($targets[j], { y: ratio * 40 * localPower + '%' });
					}
				}
			}
		}
		dom.$window.on('scroll touchmove', e => {
			updatePositions();
		});

		updatePositions();
		/*let $target = $('[data-parallax]');
		let totalTargets = $target.length;

		if (!totalTargets) {
			return;
		}
		let appliedPower = -1;
		let targetStep = 1 / totalTargets;
		function updatePosition() {
			let power = window.pageYOffset / window.innerHeight;
			power = power < 0 ? 0 : power;
			power = power > 1 ? 1 : power;

			if (appliedPower != power) {
				appliedPower = power;

				for (let k = 0; k < totalTargets; k++) {
					let localPower = (k + 1) * targetStep;
					TweenMax.set($target[0], { y: power * 40 * localPower + '%' });
				}
			}
		}
		dom.$window.on('scroll touchmove', e => {
			updatePosition();
		});

		updatePosition();*/
	},
	_initAutoShows() {
		let $targets = $('[data-auto-show]');
		if ($targets.length) {
			TweenMax.set($targets, { alpha: 0 });
			ShowHelper2.staggerWatch(
				$targets,
				function(state, target) {
					if (state) {
						ShowHelper2.unwatch(target);
						TweenMax.fromTo(target, 0.75, { y: 25, alpha: 0 }, { y: 0, alpha: 1, delay: 0.15 });
					}
				},
				true,
				false,
				75
			);
		}
	},
	_initNumberAnimations() {
		let $targets = $('[data-numeric]');
		if (!$targets.length) {
			return;
		}

		ShowHelper2.staggerWatch(
			$targets,
			function(state, target) {
				if (state) {
					ShowHelper2.unwatch(target);
					tweenNumeric($(target), 0.15);
				}
			},
			true,
			false,
			75
		);

		function tweenNumeric($element, delay) {
			var text = $element.text();

			$element.width($element.width()).css({
				display: 'inline-block',
				'will-change': 'transform',
			});
			$element.text('0');

			var hasSpaces = text.split(' ').length > 1;
			var value = parseFloat(text.split(' ').join(''));

			var controller = {
				value: 0,
			};

			var tweenTime = (value + '').length / 3;
			tweenTime = tweenTime < 0.25 ? 0.25 : tweenTime;
			tweenTime = tweenTime > 2 ? 2 : tweenTime;

			TweenMax.to(controller, tweenTime, {
				value: value,
				onUpdate: function() {
					var newText = controller.value << 0;
					if (hasSpaces) {
						newText = utils.formatNumber(newText);
					}

					$element.text(newText);
				},
				onComplete: function() {
					$element.text(text);

					TweenMax.fromTo($element, 0.35, { scale: 0.95, alpha: 0 }, { scale: 1, alpha: 1, force3D: true });
				},
				delay: delay,
				ease: Circ.easeInOut,
			});
		}
	},
};

module.exports = new PageEffects();

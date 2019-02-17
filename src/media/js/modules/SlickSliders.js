const dom = require('../utils/DOM');

var $tablet = 1024;
var $mobile = 767;

const ACTIVE = '_active';

const OPTIONS_BY_TYPE = {
	clients: {
		settings: 'unslick',
		responsive: [
			{
				breakpoint: $mobile,
				settings: {
					infinite: false,
					slidesToShow: 3,
					slidesToScroll: 1,
					draggable: true,
					variableWidth: true,
					centerMode: true,
				},
			},
		],
	},
	tariff: {
		settings: 'unslick',
		responsive: [
			{
				breakpoint: $tablet,
				settings: {
					infinite: false,
					slidesToShow: 1,
					slidesToScroll: 1,
					draggable: true,
					variableWidth: true,
					centerMode: true,
				},
			},
		],
	},
	team: {
		settings: 'unslick',
		responsive: [
			{
				breakpoint: $tablet,
				settings: {
					dots: true,
					infinite: false,
					slidesToShow: 1,
					slidesToScroll: 1,
					draggable: true,
					variableWidth: true,
					centerMode: false,
				},
			},
		],
	},
};

const CUSTOM_SETTINGS_BY_TYPE = {
	exhibition: {
		moveSliderOnArrowHover: true,
	},
};

function SlickSliders() {
	const $sliders = $('[data-slider]');
	const totalSliders = $sliders.length;

	dom.$window.on('load', () => {
		if (dom.$window.outerWidth() < $tablet) {
			for (let k = 0; k < totalSliders; k++) {
				this._initSlider($sliders.eq(k));
			}

			dom.$window.on('resize orientationchange', () => {
				setTimeout(() => {
					this.update();
				}, 300);
			});
		}
	});
}

SlickSliders.prototype = {
	_initSlider: function($container) {
		var type = $container.attr('data-slider');
		this.$slides = $container.find('[data-slider-slides]');

		var totalSlides = this.$slides.children().length;
		var $total = $container.find('[data-slider-total]');
		var $prev = $container.find('[data-slider-prev]');
		var $next = $container.find('[data-slider-next]');
		var $whenActives = $container.find('[data-slider-when-active]');
		var $dotsContainer = $container.find('[data-slider-dots]');
		var currentSlideId = 0;

		var $subSlides = $container.find('[data-slider-sub-slides]').children();
		var $previews = $container.find('[data-slider-previews]').children();

		if ($total) {
			$total.text(totalSlides + 1);
		}

		if (totalSlides > 0) {
			$container.find('[data-slider-total]').text(totalSlides);

			var options = {
				nextArrow: $next,
				prevArrow: $prev,
			};
			var typeOptions = OPTIONS_BY_TYPE[type];
			if (typeof typeOptions != 'undefined') {
				for (var i in typeOptions) {
					options[i] = typeOptions[i];

					if (i == 'asNavFor') {
						if (typeOptions[i] == 'data-nav-for-popup') {
							this.nav = $container.attr('data-nav-for-popup');
							options[i] = $('[data-nav-for-page="' + this.nav + '"]').find('[data-slider-slides]');
						} else {
							this.nav = $container.attr('data-nav-for-page');
							options[i] = $('[data-nav-for-popup="' + this.nav + '"]').find('[data-slider-slides]');
						}
					}
				}
			}

			var customSettings = CUSTOM_SETTINGS_BY_TYPE[type] || {};

			this.$slides.slick(options);

			if ($dotsContainer.length) {
				var $dotModel = $dotsContainer
					.children()
					.first()
					.removeClass(ACTIVE);
				$dotsContainer.empty();

				for (var k = 0; k < totalSlides; k++) {
					if (k < 9) {
						$dotsContainer.append($dotModel.clone().text(`0${k + 1}`));
					} else {
						$dotsContainer.append($dotModel.clone().text(k + 1));
					}
				}

				var $dots = $dotsContainer.children();
				$dots.click(e => {
					e.preventDefault();
					this.$slides.slick('slickGoTo', $(e.currentTarget).index());
				});

				dom.$document.keydown(e => {
					const code = e.keyCode;
					if (code === 39) {
						this.$slides.slick('slickGoTo', currentSlideId + 1);
					} else if (code === 37) {
						this.$slides.slick('slickGoTo', currentSlideId - 1);
					}
				});

				this.$slides.on('beforeChange', function(e, slick, currentSlide, nextSlide) {
					currentSlideId = nextSlide;
					$dots.removeClass('_active');
					for (let k = 0; k < $dotsContainer.length; k++) {
						let $currentDotsContainer = $dotsContainer.eq(k);
						let $currentDot = $currentDotsContainer
							.children()
							.eq(nextSlide)
							.addClass(ACTIVE);

						let $scrollTarget = $currentDotsContainer.parent();
						let scrollLeft = $scrollTarget.scrollLeft();

						let dotWidth = $currentDot.outerWidth(true);
						let x = $currentDot.position().left;
						let containerWidth = $currentDotsContainer.width();

						if (x > containerWidth - dotWidth * 2) {
							TweenMax.to($scrollTarget, 0.35, {
								scrollTo: { x: dotWidth + scrollLeft + (x - (containerWidth - dotWidth)) },
							});
						} else if (x < dotWidth) {
							TweenMax.to($scrollTarget, 0.35, { scrollTo: { x: scrollLeft - Math.abs(x) - dotWidth } });
						}
					}
				});

				// $('[data-slider-dots]').on('scroll', e => {
				//   const progress = $( e.currentTarget ).scrollLeft();
				// $('[data-slider-dots]').scrollLeft(progress);
				// console.log(progress);
				// });

				for (let k = 0; $dotsContainer.length > k; k++) {
					$dotsContainer
						.eq(k)
						.children()
						.first()
						.addClass(ACTIVE);
				}
			}

			var $current = $container.find('[data-slider-current]');
			if ($current.length) {
				this.$slides.on('beforeChange', function(e, slick, currentSlide, nextSlide) {
					$current.text(nextSlide + 1);
					TweenMax.fromTo($current, 0.35, { alpha: 0 }, { alpha: 1 });
				});

				$current.text(1);
			}

			if ($subSlides.length) {
				var index = 0;
				this.$slides.on('beforeChange', function(e, slick, currentSlide, nextSlide) {
					if (index != nextSlide) {
						index = nextSlide;
						$subSlides
							.stop()
							.hide()
							.eq(nextSlide)
							.fadeIn();
					}
				});

				$subSlides
					.hide()
					.first()
					.show();
			}

			if ($previews.length) {
				$previews.click(e => {
					e.preventDefault();
					this.$slides.slick('slickGoTo', $(e.currentTarget).index());
				});

				this.$slides.on('beforeChange', function(e, slick, currentSlide, nextSlide) {
					$previews
						.removeClass(ACTIVE)
						.eq(nextSlide)
						.addClass(ACTIVE);
				});
			}

			TweenMax.to($whenActives, 0.35, { alpha: 1 });

			if (customSettings.moveSliderOnArrowHover) {
				this.movePower = 50;

				// function moveSlider(direction) {
				// 	TweenMax.to($slides, 0.35, {x: direction * movePower});
				// }

				this.$slides.on('beforeChange', function(e, slick, currentSlide, nextSlide) {
					// eslint-disable-line
					this.moveSlider(0);
				});

				$prev
					.mouseenter(function() {
						this.moveSlider(1);
					})
					.mouseleave(function() {
						this.moveSlider(0);
					});
				$next
					.mouseenter(function() {
						this.moveSlider(-1);
					})
					.mouseleave(function() {
						this.moveSlider(0);
					});
			}
		} else {
			$whenActives.remove();
		}
	},
	moveSlider: function(direction) {
		TweenMax.to(this.$slides, 0.35, { x: direction * this.movePower });
	},
	update: function() {
		$('[data-slider-slides]').slick('setPosition');
	},
	scrollTo: function(slider, position) {
		$(slider).slick('setPosition');
		$(slider).slick('slickGoTo', parseInt(position));
	},
	add: function(slider, template) {
		$(slider).slick('slickAdd', template);
	},
	remove: function(slider) {
		var length = slider.find('.slick-slide').length + 3;
		for (var k = 0; k < length; k++) {
			var i = slider.find('.slick-slide').attr('data-slick-index');
			slider.slick('slickRemove', i);
			var j = 0;
			slider.find('.slick-slide').each(function() {
				$(this).attr('data-slick-index', j);
				j++;
			});
		}
	},
};

module.exports = new SlickSliders();

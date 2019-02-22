let $more = $('[data-more]');
let $less = $('[data-less]');
let $block = $('.more-clients');
let active = false;

$more.on('click', function(e) {
	e.preventDefault();
	click(this, $block);
});

$less.on('click', function(e) {
	e.preventDefault();
	click($more, $block);
});

function click(more, shownTarget) {
	if (active) {
		TweenMax.to(more, 0.25, { y: 0, alpha: 1 });
	} else {
		TweenMax.to(more, 0.3, { y: 200, alpha: 0 });
	}

	shownTarget.slideToggle();
	active = !active;
}

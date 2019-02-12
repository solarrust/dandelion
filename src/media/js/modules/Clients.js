var $more = $('[data-more]');
var $less = $('[data-less]');
var $block = $('.more-clients');
$block.slideUp();

$more.on('click', function(e) {
	TweenMax.to($more, 0.3, { y: 200, alpha: 0 });
	$block.slideDown();
	e.preventDefault();
});

$less.on('click', function(e) {
	TweenMax.to($more, 0.25, { y: 0, alpha: 1 });
	$block.slideUp();
	e.preventDefault();
});

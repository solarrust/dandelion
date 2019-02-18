import { TweenMax } from 'gsap';
global.TweenMax = TweenMax;
global.$ = global.jQuery = require('jquery');
require('./utils/jqExtensions');
require('slick-carousel');

// prettier-ignore
global.ProjectName = new function ProjectName() { // eslint-disable-line
	this.env = require('./utils/ENV');
	this.dom = require('./utils/DOM');
	this.utils = require('./utils/Utils');

	this.classes = {
		Callback: require('./classes/Callback')
	};

	this.helpers = {
		ScrollHelper: require('./helpers/ScrollHelper')
	};
	this.modules = {
		Switchers: require('./modules/Switchers'),
		LazyLoad: require('./modules/LazyLoad'),
		Popups: require('./modules/Popups'),
		Validations: require('./modules/Validations'),
		Header: require('./modules/Header'),
		Clients: require('./modules/Clients'),
		HideOnScrolls: require('./modules/HideOnScrolls'),
		SlickSliders: require('./modules/SlickSliders'),
		PageEffects: require('./modules/PageEffects'),
	};

	// Startup
	$(() => {
		this.modules.LazyLoad.start();
	});
}();

if (module.hot) {
	module.hot.accept();
}

$(document).ready(function () {
	new WOW().init();

	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('.navbar').addClass('header-scrolled');
		} else {
			$('.navbar').removeClass('header-scrolled');
		}
	});
	if ($(window).scrollTop() > 100) {
		$('.navbar').addClass('header-scrolled');
	}

	$('.scrollto, .navbar-nav a').on('click', function () {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);

			if (target.length) {
				var top_space = 0;

				if ($('.navbar').length) {
					top_space = $('.navbar').outerHeight();
					if (!$('.navbar').hasClass('header-scrolled')) {
						top_space = top_space - 16;
					}
				}

				$('html, body').animate(
					{
						scrollTop: target.offset().top - top_space,
					},
					1200,
					'easeInOutQuad'
				);

				if ($(this).parents('.navbar-nav').length) {
					$('.navbar-nav .active').removeClass('active');
					$(this).closest('li').addClass('active');
				}

				return false;
			}
		}
	});

	var nav_sections = $('section');
	var main_nav = $('.navbar-nav');
	var main_nav_height = $('.navbar').outerHeight();
	$(window).on('scroll', function () {
		var cur_pos = $(this).scrollTop();

		nav_sections.each(function () {
			var top = $(this).offset().top - main_nav_height,
				bottom = top + $(this).outerHeight() - 16;

			if (cur_pos >= top && cur_pos <= bottom) {
				main_nav.find('li').removeClass('active');
				main_nav
					.find('a[href="#' + $(this).attr('id') + '"]')
					.parent('li')
					.addClass('active');
			}
		});
	});

	$('a[data-rel^=lightcase]').lightcase();

	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('.gototop').fadeIn('slow');
		} else {
			$('.gototop').fadeOut('slow');
		}
	});
	$('.gototop').click(function () {
		$('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
		return false;
	});
});

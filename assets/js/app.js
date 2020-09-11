$(function () {
	const lineIndicator = $(".yellow-line");
	const lineIndicatorImg = $(".yellow-line img");
	const percentDisplay = $(".percent");
	const percentVal = [10, 45, 63, 75, 100];

	let i = 0;
	let t = setInterval(function () {
		percentDisplay.text(percentVal[i]);
		lineIndicator.css("width", percentVal[i] + "%");
		i++;
		if (i >= percentVal.length) {
			clearInterval(t);
			lineIndicator.on("transitionend", function () {
				lineIndicatorImg.addClass("hide");
				lineIndicatorImg.on("transitionend", function () {
					$(".preloader-layout").addClass("hidden");
				});
			});
		}
	}, 1000);
});

$(document).ready(function () {
	/**
	 * Scroll Sections
	 */
	$(".main-nav, .promo-section__btn").on("click", "a", function (e) {
		e.preventDefault();
		const anchor = $(this).attr("href");
		const elPos = $(anchor).offset().top;

		$("html, body").animate(
			{
				scrollTop: elPos + "px",
			},
			350
		);
	});

	/**
	 * Mobile menu toggle
	 */

	$(".menu-btn").on("click", function (e) {
		e.preventDefault();
		$(this).toggleClass("active");
		$(".main-nav").slideToggle(300);
	});

	$(".slider").slick({
		dots: true,
		arrows: false,
		slideToShow: 1,
		fade: true,
		lazyLoad: "progressive",
	});

	/**
	 * Mobile footer menu toggle
	 */

	$(".js__toggle-menu").on("click", function () {
		$(this).toggleClass("active").siblings(".menu-list").slideToggle(300);
	});

	/**
	 * Select2
	 */

	$.each($(".js__custom-select"), function (i, el) {
		$(el).select2({
			minimumResultsForSearch: -1,
			dropdownPosition: "below",
			theme: $(el).attr("theme"),
			placeholder: $(el).data("placeholder"),
		});
	});

	/**
	 * Mask phone
	 */

	$(".js__mask-input")
		.mask("+7 999 999-99-99", { clearIfNotMatch: true })
		.focus(function (e) {
			if (!$(this).val()) {
				$(this).val("+7 ");
			}
		});

	/**
	 *  Tabs
	 */

	$(".tab").on("click", "li", function (e) {
		e.preventDefault();
		let idx = $(".tab li").index($(this));
		$(this).addClass("active").siblings("li").removeClass("active");
		$(".tab-content>li")
			.eq(idx)
			.addClass("active")
			.siblings()
			.removeClass("active");
	});

	/**
	 * Map modal
	 */

	$(".modal-btn").on("click", function (e) {
		e.preventDefault();
		const id = $(this).attr("href");
		$(this).toggleClass("active");
		$(".map__box-canvas").toggleClass("dark");
		$(id).toggleClass("showed");
	});

	/**
	 * Form validate
	 */

	$(".default-form").validate({
		rules: {
			userName: {
				required: true,
				minlength: 3,
			},
			tel: {
				minlength: 6,
			},
		},
		messages: {
			userName: "Обязательноe поле",
		},
	});

	$(".default-form input").on("keyup blur click", function () {
		if ($(".default-form").validate().checkForm()) {
			$(".default-form .btn").prop("disabled", false);
		} else {
			$(".default-form .btn").prop("disabled", true);
		}
	});

	/**
	 * Send Form
	 */

	$(".default-form").on("submit", function (e) {
		e.preventDefault();
	});
});

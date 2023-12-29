import Swiper from "swiper";
import { Navigation, Pagination, Autoplay, Parallax, Controller } from "swiper/modules";

import "swiper/css/bundle";

const progressCircle = document.querySelector(".autoplay-progress svg");
const progressContent = document.querySelector(".autoplay-progress span");
let bannerSlider;
let loop = false;
let autoplay = {
	enabled: false,
	disableOnInteraction: false,
};
let videoPrev = null;
let videoActive = null;

if (progressCircle) {
	progressCircle.closest(".autoplay-progress").style.display = "none";
}

const initSlider = (num = 0, loop) => {
	bannerSlider = new Swiper('.banner-slider', {
		modules: [Navigation, Pagination, Autoplay, Parallax],
		loop,
		autoHeight: true,
		speed: 1000,
		parallax: {
			enabled: true,
		},
		autoplay,
		pagination: {
			el: ".swiper-pagination",
			clickable: true,
		},
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		on: {
			autoplayTimeLeft(s, time, progress) {
				progressCircle.style.setProperty("--progress", 1 - progress);
				progressContent.textContent = `${Math.ceil(time / 1000)}с.`;
			},
			slideChange(s) {
				const prevIdx = this.activeIndex - 1 < 0 ? 0 : this.activeIndex - 1;
				videoPrev = this.slides[prevIdx].querySelector("video");
				if (videoPrev) {
					videoPrev.pause();
				}
				videoActive = this.slides[this.activeIndex].querySelector("video");
				if (videoActive) {
					this.params.autoplay.delay = Math.ceil(videoActive.duration) * 1000;
				}
				progressCircle.closest(".autoplay-progress").style.display = "none";
			},
			slideChangeTransitionEnd(s) {
				if (videoPrev) {
					videoPrev.currentTime = 0;
				}
				if (videoActive) {
					videoActive.play();
				}
				progressCircle.closest(".autoplay-progress").style.display = "flex";
			},
		},
	})
}

const slides = document.querySelectorAll('.banner-slide');

if (slides.length > 1) {
	loop = true;
	autoplay.enabled = true;
	if (progressCircle) {
		progressCircle.closest(".autoplay-progress").style.display = "flex";
	}
}

initSlider(0, loop);

// bannerSlider.on('lazyImageReady', function (swiper, slideEl, imageEl) {
// 	setTimeout(() => {
// 		const parent = document.querySelector('.banner-slider');
// 		const active = parent.querySelector('.swiper-slide-active');
// 		const slides = parent.querySelectorAll('.banner-slide');
// 		const height = active.clientHeight;
// 		slides.forEach(slide => {
// 			// slide.style.minHeight = `${height}px`;
// 			slide.style.height = `100%`;
// 		})
// 	}, 100)
// });
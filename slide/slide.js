const track = document.querySelector('.carousel__track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel__button--right');
const prevButton = document.querySelector('.carousel__button--left');
const dotsNav = document.querySelector('.carousel__nav');
populateNavDots (slides, dotsNav);
const dots = Array.from(dotsNav.children);

const slideWidth = slides[0].getBoundingClientRect().width;

const setSlidePosition = (slide, index) => {
	slide.style.left = slideWidth * index + 'px';
}
slides.forEach(setSlidePosition);

// botón siguiente
nextButton.addEventListener('click', e => {
	let currentSlide = track.querySelector('.current-slide');
	let targetSlide = currentSlide.nextElementSibling;
	if (!targetSlide) {
		targetSlide = track.children[0];
	}
	moveSlide (currentSlide, targetSlide, track);
	const targetIndex = slides.findIndex(slide => slide === targetSlide);
	updateDots (dots, targetIndex);
});

// botón anterior
prevButton.addEventListener('click', e => {
	let currentSlide = track.querySelector('.current-slide');
	let targetSlide = currentSlide.previousElementSibling;
	if (!targetSlide) {
		targetSlide = track.children[track.children.length - 1];
	}
	moveSlide (currentSlide, targetSlide, track);
	const targetIndex = slides.findIndex(slide => slide === targetSlide);
	updateDots (dots, targetIndex);
});

function moveSlide (currentSlide, targetSlide, track) {
	let amountToMove = targetSlide.style.left;
	track.style.transform = 'translateX(-' + amountToMove + ')';
	currentSlide.classList.remove('current-slide');
	targetSlide.classList.add('current-slide');
}

function updateDots (dots, targetIndex) {
	const targetDot = dots[targetIndex];
	const currentDot = dotsNav.querySelector(".current-slide");
	if (currentDot) {
		currentDot.classList.remove('current-slide');
	}
	targetDot.classList.add('current-slide');
}

dotsNav.addEventListener('click', e => {
	let targetDot = e.target.closest('button');
	if (!targetDot) {
		return;
	}
	const currentSlide = track.querySelector(".current-slide");
	const currentDot = dotsNav.querySelector(".current-slide");
	if (targetDot === currentDot) {
		return;
	}
	const targetIndex = dots.findIndex(dot => dot === targetDot);
	const targetSlide = track.children[targetIndex];
	moveSlide (currentSlide, targetSlide, track);
	updateDots (dots, targetIndex);
})

function populateNavDots (slides, dotsNav) {
	// <button class="carousel__indicator current-slide"></button>
	slides.forEach ((slide, index) => {
		dot = document.createElement('button');
		dot.classList.add('carousel__indicator');
		if (index === 0) {
			dot.classList.add('current-slide');
		}
		dotsNav.appendChild(dot);
	});
}
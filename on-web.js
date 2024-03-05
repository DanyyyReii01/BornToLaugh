const slides = document.querySelectorAll('.tn-img')
let slideIndex = 0;
let intervalId;

document.addEventListener('DOMContentLoaded', initializeSlider);

function initializeSlider() {
    if(slides.length > 0) {
        slides[slideIndex].classList.add('display-slide');
        intervalId = setInterval(nextSlide, 2000);
    }
}

function showSlide(index) {
    if(slideIndex >= slides.length) {
        slideIndex = 0;
    } else if(index < 0) {
        slideIndex = slides.length - 1;
    }

    slides.forEach((slide) => {
        slide.classList.remove('display-slide')
    });
    slides[slideIndex].classList.add('display-slide');
}

function nextSlide() {
    slideIndex++;
    showSlide(slideIndex);
}
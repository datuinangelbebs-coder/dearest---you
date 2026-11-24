
// =====================================
// PIN SETTINGS
// =====================================

const correctPIN = "121225";

const lockScreen = document.getElementById("lockScreen");
const pinForm = document.getElementById("pinForm");
const pinInput = document.getElementById("pinInput");
const pinError = document.getElementById("pinError");

const mainContainer = document.getElementById("mainContainer");

// =====================================
// NOTEBOOK ELEMENTS
// =====================================

const slides = document.querySelectorAll(".slide");
const dotsContainer = document.getElementById("dots");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const progressFill = document.getElementById("progressFill");
const pageNumber = document.getElementById("pageNumber");
const totalPages = document.getElementById("totalPages");

let currentSlide = 0;
const totalSlides = slides.length;

// Display the total number of pages
totalPages.textContent = ` / ${String(totalSlides).padStart(2, "0")}`;

// =====================================
// CREATE NAVIGATION DOTS
// =====================================

slides.forEach((slide, index) => {

    const dot = document.createElement("button");

    dot.classList.add("dot");
    dot.setAttribute("aria-label", `Page ${index + 1}`);

    dot.addEventListener("click", () => {
        showSlide(index);
    });

    dotsContainer.appendChild(dot);

});

const dots = document.querySelectorAll(".dot");

// =====================================
// PIN VERIFICATION
// =====================================

pinForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const enteredPIN = pinInput.value;

    if (enteredPIN === correctPIN) {

        pinError.classList.remove("show");

        pinInput.disabled = true;

        const unlockButton = pinForm.querySelector("button");
        unlockButton.disabled = true;
        unlockButton.textContent = "Opening your notebook...";

        lockScreen.classList.add("unlocking");

        setTimeout(() => {

            lockScreen.style.display = "none";

            mainContainer.classList.add("unlocked");

            showSlide(0);

        }, 800);

    } else {

        pinError.classList.add("show");

        pinInput.value = "";
        pinInput.focus();

        // Shake effect
        pinInput.animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(-6px)" },
                { transform: "translateX(6px)" },
                { transform: "translateX(-6px)" },
                { transform: "translateX(0)" }
            ],
            {
                duration: 300
            }
        );

    }

});

// Only allow numbers in the PIN field
pinInput.addEventListener("input", () => {

    pinInput.value = pinInput.value.replace(/\D/g, "");

    pinError.classList.remove("show");

});

// =====================================
// SHOW NOTEBOOK PAGE
// =====================================

function showSlide(index) {

    if (index < 0 || index >= totalSlides) {
        return;
    }

    currentSlide = index;

    // Show selected page
    slides.forEach((slide, i) => {

        slide.classList.toggle(
            "active",
            i === currentSlide
        );

    });

    // Update navigation dots
    dots.forEach((dot, i) => {

        dot.classList.toggle(
            "active",
            i === currentSlide
        );

    });

    // Update page number
    pageNumber.textContent = String(currentSlide + 1).padStart(2, "0");

    // Update progress bar
    const progress = ((currentSlide + 1) / totalSlides) * 100;

    progressFill.style.width = `${progress}%`;

    // Disable Back on first page
    prevBtn.disabled = currentSlide === 0;

    // Update Next button on last page
    if (currentSlide === totalSlides - 1) {

        nextBtn.textContent = "Read Again ↻";

    } else {

        nextBtn.textContent = "Next →";

    }

}

// =====================================
// NEXT BUTTON
// =====================================

nextBtn.addEventListener("click", () => {

    if (currentSlide === totalSlides - 1) {

        showSlide(0);

    } else {

        showSlide(currentSlide + 1);

    }

});

// =====================================
// BACK BUTTON
// =====================================

prevBtn.addEventListener("click", () => {

    showSlide(currentSlide - 1);

});

// =====================================
// KEYBOARD NAVIGATION
// =====================================

document.addEventListener("keydown", (event) => {

    if (lockScreen.style.display !== "none") {
        return;
    }

    if (
        event.key === "ArrowRight" &&
        currentSlide < totalSlides - 1
    ) {

        showSlide(currentSlide + 1);

    }

    if (
        event.key === "ArrowLeft" &&
        currentSlide > 0
    ) {

        showSlide(currentSlide - 1);

    }

});

// =====================================
// MOBILE SWIPE NAVIGATION
// =====================================

let touchStartX = 0;
let touchEndX = 0;

const slidesContainer = document.querySelector(".slides-container");

slidesContainer.addEventListener("touchstart", (event) => {

    touchStartX = event.changedTouches[0].screenX;

}, { passive: true });

slidesContainer.addEventListener("touchend", (event) => {

    touchEndX = event.changedTouches[0].screenX;

    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) < 60) {
        return;
    }

    if (
        distance < 0 &&
        currentSlide < totalSlides - 1
    ) {

        showSlide(currentSlide + 1);

    }

    if (
        distance > 0 &&
        currentSlide > 0
    ) {

        showSlide(currentSlide - 1);

    }

}, { passive: true });

// =====================================
// INITIALIZE NOTEBOOK
// =====================================

showSlide(0);

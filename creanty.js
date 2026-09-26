function initializeSlider(container) {
    const tabs = container.querySelectorAll("button[data-i]");
    const nums = container.querySelectorAll("span[data-i]");
    const ruleFill = container.querySelector(".rule-fill");
    const isAboutSlider = container.classList.contains(
        "about-home-content__left__bottom",
    );
    const activeTabClass = isAboutSlider ? "tab-about-active" : "tab-active";
    const activePaginationClass = isAboutSlider
        ? "pagination-about-active"
        : "pagination-active";

    function setActive(index) {
        tabs.forEach((tab) => {
            tab.classList.toggle(
                activeTabClass,
                tab.dataset.i === String(index),
            );
        });

        nums.forEach((num) => {
            num.classList.toggle(
                activePaginationClass,
                num.dataset.i === String(index),
            );
        });

        if (ruleFill && tabs.length) {
            ruleFill.style.width = ((index + 1) / tabs.length) * 100 + "%";
        }

        const target = tabs[index];
        if (!target) return;

        target.classList.remove("bump");
        void target.offsetWidth;
        target.classList.add("bump");
        target.addEventListener(
            "animationend",
            () => target.classList.remove("bump"),
            { once: true },
        );
    }

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            setActive(Number(tab.dataset.i));
        });
    });

    nums.forEach((num) => {
        num.addEventListener("click", () => {
            setActive(Number(num.dataset.i));
        });
    });

    if (tabs.length) {
        setActive(0);
    }
}
document
    .querySelectorAll(
        ".header-hero-content__left__bottom, .about-home-content__left__bottom",
    )
    .forEach(initializeSlider);

// Card List Featured Property
const cardList = document.querySelector(".featured-property__bottom__cards");
const toggleButton = document.querySelector("#toggleFeaturedExplore");
const featuredPropertyBottom = cardList.closest(".featured-property__bottom");

toggleButton.addEventListener("click", () => {
    const isExpanded = cardList.classList.toggle("show-all");
    featuredPropertyBottom.style.maxHeight = isExpanded
        ? `${cardList.scrollHeight}px`
        : "386px";
    toggleButton.textContent = isExpanded ? "Collapse" : "Explore Property";
});

window.addEventListener("resize", () => {
    if (cardList.classList.contains("show-all")) {
        featuredPropertyBottom.style.maxHeight = `${cardList.scrollHeight}px`;
    }
});

// Testimonial image carousel
const testimonial = document.querySelector(".testimonial");
const testimonialImages = testimonial?.querySelectorAll(
    ".testimonial__content__wrapper__image1, .testimonial__content__wrapper__image2",
);
const testimonialPrevious = testimonial?.querySelector(
    ".testimonial__content__prev",
);
const testimonialNext = testimonial?.querySelector(
    ".testimonial__content__next",
);

if (testimonialImages?.length === 2 && testimonialPrevious && testimonialNext) {
    const testimonialSlides = [
        ["./assets/images/image.png", "./assets/images/image2.png"],
        ["./assets/images/image2.png", "./assets/images/image.png"],
    ];
    let currentTestimonialSlide = 0;
    let isTestimonialAnimating = false;

    async function showTestimonialSlide(index, direction) {
        if (isTestimonialAnimating) return;

        isTestimonialAnimating = true;
        const nextSlide =
            (index + testimonialSlides.length) % testimonialSlides.length;
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (reducedMotion) {
            currentTestimonialSlide = nextSlide;
            testimonialImages.forEach((image, imageIndex) => {
                image.src =
                    testimonialSlides[currentTestimonialSlide][imageIndex];
            });
            isTestimonialAnimating = false;
            return;
        }

        const offset = direction > 0 ? -24 : 24;
        const exitAnimations = Array.from(testimonialImages, (image) =>
            image.animate(
                [
                    { opacity: 1, transform: "translateX(0)" },
                    { opacity: 0, transform: `translateX(${offset}px)` },
                ],
                { duration: 180, easing: "ease-in", fill: "forwards" },
            ),
        );

        await Promise.all(
            exitAnimations.map((animation) => animation.finished),
        );
        currentTestimonialSlide = nextSlide;
        testimonialImages.forEach((image, imageIndex) => {
            image.src = testimonialSlides[currentTestimonialSlide][imageIndex];
            image.alt = "Customer testimonial photo";
        });
        exitAnimations.forEach((animation) => animation.cancel());

        const enterAnimations = Array.from(testimonialImages, (image) =>
            image.animate(
                [
                    { opacity: 0, transform: `translateX(${-offset}px)` },
                    { opacity: 1, transform: "translateX(0)" },
                ],
                { duration: 240, easing: "ease-out" },
            ),
        );

        await Promise.all(
            enterAnimations.map((animation) => animation.finished),
        );
        enterAnimations.forEach((animation) => animation.cancel());
        isTestimonialAnimating = false;
    }

    function moveTestimonialSlide(direction) {
        showTestimonialSlide(currentTestimonialSlide + direction, direction);
    }

    testimonialPrevious.addEventListener("click", () => {
        moveTestimonialSlide(-1);
    });
    testimonialNext.addEventListener("click", () => {
        moveTestimonialSlide(1);
    });

    [testimonialPrevious, testimonialNext].forEach((control, controlIndex) => {
        control.setAttribute("role", "button");
        control.setAttribute("tabindex", "0");
        control.setAttribute(
            "aria-label",
            controlIndex === 0
                ? "Previous testimonial photos"
                : "Next testimonial photos",
        );

        control.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                moveTestimonialSlide(controlIndex === 0 ? -1 : 1);
            }
        });
    });
}

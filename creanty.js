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

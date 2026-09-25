const tabs = document.querySelectorAll(".header-hero-content__left__tab");
const nums = document.querySelectorAll(
    ".header-hero-content__left__paginations .header-hero-content__left__pagination",
);

const ruleFill = document.getElementById("ruleFill");

function setActive(i) {
    tabs.forEach((t) =>
        t.classList.toggle("tab-active", t.dataset.i === String(i)),
    );
    nums.forEach((n) =>
        n.classList.toggle("pagination-active", n.dataset.i === String(i)),
    );

    const percent = ((Number(i) + 1) / tabs.length) * 100;
    if (ruleFill) {
        ruleFill.style.width = percent + "%";
    }

    playBump(i);
}

function playBump(i) {
    const target = document.querySelector(
        `.header-hero-content__left__tab[data-i="${i}"]`,
    );
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

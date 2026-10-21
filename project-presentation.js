const presentationSlides = {
  joustice: [
    "id.p",
    "id.g3f322718137_0_0",
    "id.g3f43ea5e269_6_0",
    "id.g3f3254a85f1_0_23",
    "id.g3f3254a85f1_0_9",
    "id.g3f432f98822_1_5",
    "id.g3f32989d8b3_0_0",
    "id.g3f3254a85f1_2_15",
    "id.g3f3254a85f1_0_48",
    "id.g3f4257dc387_3_4",
    "id.g3f3254a85f1_0_58",
    "id.g3f432f98822_1_22",
    "id.g3f3254a85f1_1_52",
    "id.g3f3254a85f1_1_57",
    "id.g3f3254a85f1_1_76",
    "id.g3f3254a85f1_0_13",
    "id.g3f3254a85f1_2_9",
    "id.g3f333b9c253_1_5",
    "id.g3f333b9c253_0_4",
    "id.g3f43ea5e269_5_1",
    "id.g3f333b9c253_0_11",
    "id.g3f4638c12db_0_1",
    "id.g3f322718137_2_42"
  ],
  solstice: [
    "id.p",
    "id.g3f5e19e7b9e_0_24",
    "id.g3f5e19e7b9e_0_306",
    "id.g3f5e19e7b9e_0_30",
    "id.g3f5e19e7b9e_0_35",
    "id.g3f5e19e7b9e_0_39",
    "id.g3f5e19e7b9e_0_47",
    "id.g3f5e19e7b9e_0_54",
    "id.g3f5e19e7b9e_0_67",
    "id.g3f5ed7f9508_2_152",
    "id.g3f5ed7f9508_2_24",
    "id.g3f5ed7f9508_2_113",
    "id.g3f5ed7f9508_2_1",
    "id.g3f5ed7f9508_0_0",
    "id.g3f5ed7f9508_2_64",
    "id.g3f5e19e7b9e_0_169",
    "id.g3f5fc21f137_0_0",
    "id.g3f5fc21f137_0_18",
    "id.g3f5f1b45eb2_1_5",
    "id.g3f5f1b45eb2_1_33",
    "id.g3f5f1b45eb2_1_48",
    "id.g3f5f1b45eb2_1_59",
    "id.g3f5f1b45eb2_1_79",
    "id.g3f5f1b45eb2_1_91",
    "id.g3f5f1b45eb2_1_42",
    "id.g3f5f1b45eb2_1_143",
    "id.g3f5f1b45eb2_1_133",
    "id.g3f5f1b45eb2_1_165",
    "id.g3f5e19e7b9e_0_174",
    "id.g3f5e19e7b9e_0_150",
    "id.g3f5e19e7b9e_0_230",
    "id.g3f5e19e7b9e_0_199",
    "id.g3f5e19e7b9e_0_317"
  ]
};

const presentationName = document.body.dataset.presentation;
const slides = presentationSlides[presentationName];
const presentation = document.querySelector(".detail-presentation");
const frame = presentation?.querySelector("iframe");
const previous = document.querySelector(".detail-arrow-prev");
const next = document.querySelector(".detail-arrow-next");

if (slides && presentation && frame && previous && next) {
  const frameBase = frame.getAttribute("src").replace(/&slide=[^&#]*/, "");
  const originalPrevious = {
    href: previous.getAttribute("href"),
    label: previous.getAttribute("aria-label")
  };
  const originalNext = {
    href: next.getAttribute("href"),
    label: next.getAttribute("aria-label")
  };
  let currentSlide = 0;
  let showingPresentation = false;

  function presentationIsVisible() {
    const bounds = presentation.getBoundingClientRect();
    const viewportMiddle = window.innerHeight / 2;
    return bounds.top <= viewportMiddle && bounds.bottom > viewportMiddle;
  }

  function updateArrows() {
    const visible = presentationIsVisible();
    if (visible === showingPresentation && !visible) return;
    showingPresentation = visible;
    document.body.classList.toggle("presentation-active", visible);

    for (const [arrow, original, label, disabled] of [
      [previous, originalPrevious, "Previous slide", currentSlide === 0],
      [next, originalNext, "Next slide", currentSlide === slides.length - 1]
    ]) {
      arrow.setAttribute("href", visible ? "#presentation" : original.href);
      arrow.setAttribute("aria-label", visible ? label : original.label);
      if (visible && disabled) {
        arrow.setAttribute("aria-disabled", "true");
      } else {
        arrow.removeAttribute("aria-disabled");
      }
    }
  }

  function showSlide(index) {
    if (index < 0 || index >= slides.length) return;
    const currentId = slides[currentSlide];
    const nextId = slides[index];
    const slideUrl = `${frameBase}&slide=${encodeURIComponent(currentId)}#slide=${encodeURIComponent(nextId)}`;
    // A fragment change keeps the already loaded Google Slides viewer in place.
    try {
      frame.contentWindow.location.href = slideUrl;
    } catch {
      frame.setAttribute("src", `${frameBase}&slide=${encodeURIComponent(nextId)}`);
    }
    currentSlide = index;
    frame.setAttribute("title", `${presentationName.toUpperCase()} presentation — slide ${index + 1} of ${slides.length}`);
    updateArrows();
  }

  previous.addEventListener("click", (event) => {
    if (!presentationIsVisible()) return;
    event.preventDefault();
    showSlide(currentSlide - 1);
  });

  next.addEventListener("click", (event) => {
    if (!presentationIsVisible()) return;
    event.preventDefault();
    showSlide(currentSlide + 1);
  });

  window.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows);
  updateArrows();
}

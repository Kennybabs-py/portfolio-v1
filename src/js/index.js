import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Flip from "gsap/dist/Flip";

import { clock } from "./utils/clock";
import { BlurScrollEffect } from "./animations/blur-scroll-effect";
import { TextRevealEffect } from "./animations/text-reveal-effect";
import { preloadImages } from "./utils/preload-images";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger, Flip);

// ----------- Elements -------------------//
//Lines
const longLines = document.querySelectorAll("hr");
// Flip Images
// Select the element that will be animated with Flip and its parent
const heroImg = document.querySelector(".hero__img");
const flipStartNode = document.querySelector(".hero__section");

// ----------- Lenis -------------------//
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ----------- Animations -------------------//
// Lines
function animateLines() {
  longLines.forEach((el) => {
    gsap.fromTo(
      el,
      {
        width: "0%",
        willChange: "width",
      },
      {
        width: "100%",
        ease: "power3.in", // Animation easing.
        stagger: 0.1,
        duration: 3,
        scrollTrigger: {
          trigger: el, // Element that triggers the animation.
          start: "top bottom",
          end: "bottom center+=15%",
          scrub: true,
        },
      }
    );
  });
}

// Flip
// Select all elements with a `data-step` attribute for the Flip animation steps
const stepElements = [...document.querySelectorAll("[data-step]")];

let flipCtx;
// Function to create a Flip animation tied to scroll events
const createFlipOnScrollAnimation = () => {
  // Revert any previous animation context
  flipCtx && flipCtx.revert();

  flipCtx = gsap.context(() => {
    const flipConfig = {
      duration: 1,
      ease: "sine.inOut",
    };

    // Store Flip states for each step element
    const states = stepElements.map((stepElement) =>
      Flip.getState(stepElement)
    );

    // Create a GSAP timeline with ScrollTrigger for the Flip animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: flipStartNode, // Trigger animation based on the parent element
        start: "clamp(center center)", // Start animation when parent is in the center of the viewport
        endTrigger: stepElements[stepElements.length - 1], // End at the last step element
        end: "clamp(center center)", // End animation when the last step is centered
        scrub: true, // Synchronize animation with scroll
        immediateRender: false,
      },
    });

    // Add Flip animations to the timeline for each state
    states.forEach((state, index) => {
      const customFlipConfig = {
        ...flipConfig,
        ease: index === 0 ? "none" : flipConfig.ease, // Use 'none' easing for the first step
      };
      tl.add(Flip.fit(heroImg, state, customFlipConfig), index ? "+=0.5" : 0);
    });
  });
};

const heroTitle = new SplitType(".hero__title h1", { types: "chars" });
const heroSpans = new SplitType(".hero__section span", { types: "words" });
const contactTitle = new SplitType(".contact__title", { types: "chars" });

function heroTimeLine() {
  const timeline = gsap.timeline();
  timeline
    .fromTo(
      heroSpans.words,
      {
        x: "100px",
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        ease: "power3.inOut", // Animation easing.
        stagger: 0.1,
        duration: 0.8,
      }
    )

    .fromTo(
      heroTitle.chars,
      {
        x: "100px",
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        ease: "power3.inOut", // Animation easing.
        stagger: 0.1,
        duration: 0.5,
      },
      "-=1"
    )
    .fromTo(
      ".hero__img",
      {
        width: "0",
        opacity: 0,
      },
      {
        width: "auto",
        opacity: 1,
        ease: "power3.inOut", // Animation easing.
        duration: 0.8,
      },
      "-=1"
    );
}

function contactTimeLine() {
  contactTitle.chars.forEach((char, index) => {
    let xdirection =
      index < Math.ceil(contactTitle.chars.length / 2) ? -200 : 200;
    let ydirection = index % 2 === 0 ? -50 : 50;

    gsap.fromTo(
      char,
      {
        x: `${xdirection}px`,
        y: `${ydirection}px`,
        opacity: 0,
        rotate: xdirection - 110,
      },
      {
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
        ease: "power3.inOut",
        stagger: 0.1,
        duration: 0.8,
        scrollTrigger: {
          trigger: char,
          start: "top bottom-=10%",
          end: "bottom bottom-=50px",
          scrub: true,
        },
      }
    );
  });
}

// Init all animations
const init = () => {
  heroTimeLine();
  contactTimeLine();
  createFlipOnScrollAnimation();

  const blureffects = [
    { selector: "[data-effect-blur]", effect: BlurScrollEffect },
  ];
  // Iterate over each effect configuration and apply the effect to all matching elements
  blureffects.forEach(({ selector, effect }) => {
    document.querySelectorAll(selector).forEach((el) => {
      new effect(el, "chars");
    });
  });

  const titleffects = [{ selector: "[data-title]", effect: TextRevealEffect }];
  // Iterate over each effect configuration and apply the effect to all matching elements
  titleffects.forEach(({ selector, effect }) => {
    document.querySelectorAll(selector).forEach((el) => {
      new effect(el, "words");
    });
  });

  animateLines();
  setInterval(() => {
    clock();
  }, 1000);
  window.addEventListener("resize", createFlipOnScrollAnimation);
};

preloadImages(".hero__img").then(() => {
  document.body.classList.remove("loading");
  init();
});

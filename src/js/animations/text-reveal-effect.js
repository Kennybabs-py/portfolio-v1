import { TextSplitter } from "../utils/text-splitter";
import gsap from "gsap";

// Defines a class to create scroll-triggered animation effects on text.
export class TextRevealEffect {
  constructor(textElement, splitType = "chars") {
    // Check if the provided element is valid.
    if (!textElement || !(textElement instanceof HTMLElement)) {
      throw new Error("Invalid text element provided.");
    }

    this.textElement = textElement;
    this.splitType = splitType;

    // Set up the effect for the provided text element.
    this.initializeEffect();
  }

  // Sets up the initial text effect on the provided element.
  initializeEffect() {
    // Callback to re-trigger animations on resize.
    const textResizeCallback = () => this.scroll();

    // Split text for animation and store the reference.
    this.splitter = new TextSplitter(this.textElement, {
      resizeCallback: textResizeCallback,
      splitTypeTypes: this.splitType,
    });

    // Trigger the initial scroll effect.
    this.scroll();
  }

  // Animates text based on the scroll position.
  scroll() {
    let elements;
    if (this.splitType === "chars") {
      elements = this.splitter.getChars();
    } else if (this.splitType === "words") {
      elements = this.splitter.getWords();
    } else {
      elements = this.splitter.getLines();
    }
    gsap.fromTo(
      elements,
      {
        y: "150px",
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        ease: "power3.in", // Animation easing.
        stagger: 0.1,
        duration: 0.8,
        scrollTrigger: {
          trigger: this.textElement, // Element that triggers the animation.
          start: "top bottom-=0%", // Animation starts when element hits bottom of viewport.
          end: "bottom center+=15%", // Animation ends in the center of the viewport.
          scrub: true, // Animation progress tied to scroll position.
        },
      }
    );
  }
}

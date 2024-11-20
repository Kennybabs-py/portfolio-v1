import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { clock } from "./utils/clock";

gsap.registerPlugin(ScrollTrigger);

// ----------- Lenis -------------------//
const lenis = new Lenis();
lenis.on("scroll", (e) => {
  console.log(e);
});
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

setInterval(() => {
  clock();
}, 1000);

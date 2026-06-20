"use client";

import { useEffect, useRef, useState } from 'react';
import './LandingAnimation.css';

const TOTAL_FRAMES_1 = 142;
const TOTAL_FRAMES_2 = 123;
const TOTAL_FRAMES_3 = 144;
const TOTAL_FRAMES_4 = 202;
const TOTAL_FRAMES = TOTAL_FRAMES_1 + TOTAL_FRAMES_2 + TOTAL_FRAMES_3 + TOTAL_FRAMES_4;

export default function LandingAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [images1, setImages1] = useState<HTMLImageElement[]>([]);
  const [images2, setImages2] = useState<HTMLImageElement[]>([]);
  const [images3, setImages3] = useState<HTMLImageElement[]>([]);
  const [images4, setImages4] = useState<HTMLImageElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [canvasPosition, setCanvasPosition] = useState<'fixed' | 'absolute'>('fixed');
  const [canvasTop, setCanvasTop] = useState(0);

  // Scroll to top on fresh mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Preload all four animation frame sets
  useEffect(() => {
    const loadedImages1: HTMLImageElement[] = [];
    const loadedImages2: HTMLImageElement[] = [];
    const loadedImages3: HTMLImageElement[] = [];
    const loadedImages4: HTMLImageElement[] = [];
    let loadedNum = 0;

    const handleImgLoad = () => {
      loadedNum++;
      setLoadedCount(loadedNum);
      if (loadedNum === TOTAL_FRAMES) {
        setImages1(loadedImages1);
        setImages2(loadedImages2);
        setImages3(loadedImages3);
        setImages4(loadedImages4);
        setLoading(false);
      }
    };

    const handleImgError = () => {
      loadedNum++;
      setLoadedCount(loadedNum);
      if (loadedNum === TOTAL_FRAMES) {
        setImages1(loadedImages1);
        setImages2(loadedImages2);
        setImages3(loadedImages3);
        setImages4(loadedImages4);
        setLoading(false);
      }
    };

    // Load first set
    for (let i = 1; i <= TOTAL_FRAMES_1; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/firstanimation/ezgif-frame-${frameNum}.jpg`;
      img.onload = handleImgLoad;
      img.onerror = handleImgError;
      loadedImages1.push(img);
    }

    // Load second set
    for (let i = 1; i <= TOTAL_FRAMES_2; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/secondanimation/ezgif-frame-${frameNum}.jpg`;
      img.onload = handleImgLoad;
      img.onerror = handleImgError;
      loadedImages2.push(img);
    }

    // Load third set
    for (let i = 1; i <= TOTAL_FRAMES_3; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/thirdanimation/ezgif-frame-${frameNum}.jpg`;
      img.onload = handleImgLoad;
      img.onerror = handleImgError;
      loadedImages3.push(img);
    }

    // Load fourth set
    for (let i = 1; i <= TOTAL_FRAMES_4; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/fourthanimation/ezgif-frame-${frameNum}.jpg`;
      img.onload = handleImgLoad;
      img.onerror = handleImgError;
      loadedImages4.push(img);
    }
  }, []);

  // Disable body overflow scroll while loading images
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  // Handle canvas rendering and scroll interaction
  useEffect(() => {
    if (loading || images1.length === 0 || images2.length === 0 || images3.length === 0 || images4.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = document.documentElement.clientWidth;
      canvas.height = document.documentElement.clientHeight;
      renderFrame();
    };

    const drawCoverImage = (img: HTMLImageElement, xOffset = 0, yOffset = 0) => {
      const w = canvas.width;
      const h = canvas.height;

      // Calculate ratio to scale the image to cover the canvas
      const ratio = Math.max(w / img.width, h / img.height);

      const nw = img.width * ratio;
      const nh = img.height * ratio;

      // Center the image, offset by xOffset and yOffset for slide transitions
      const x = (w - nw) / 2 + xOffset;
      const y = (h - nh) / 2 + yOffset;

      ctx.drawImage(img, 0, 0, img.width, img.height, x, y, nw, nh);
    };

    const renderFrame = () => {
      const currentScrollTop = window.scrollY;
      const vh = window.innerHeight;
      // Maximum scrollable distance for the starting animation is 15 screen heights
      const animHeight = 15 * vh;
      const scrollFraction = animHeight > 0 ? Math.min(1, Math.max(0, currentScrollTop / animHeight)) : 0;

      setScrollTop(currentScrollTop);
      setScrollProgress(scrollFraction);

      // Canvas positioning logic (switches from fixed to absolute at 14vh to scroll up naturally)
      const threshold = 14 * vh;
      if (currentScrollTop < threshold) {
        setCanvasPosition('fixed');
        setCanvasTop(0);
      } else {
        setCanvasPosition('absolute');
        setCanvasTop(threshold);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Partition the scroll progress:
      // 0.00 - 0.20: First scroll animation (plays frames 0 to 141)
      // 0.20 - 0.25: Slide up transition (First last frame slides up, Second first frame slides up from bottom)
      // 0.25 - 0.45: Second scroll animation (plays frames 0 to 122)
      // 0.45 - 0.50: Slide left transition (Second last frame slides left, Third first frame slides left from right)
      // 0.50 - 0.70: Third scroll animation (plays frames 0 to 143)
      // 0.70 - 0.75: Slide down transition (Third last frame slides down, Fourth first frame slides down from top)
      // 0.75 - 0.95: Fourth scroll animation (plays frames 0 to 201)
      // 0.95 - 1.00: Slide up transition of canvas container (handled via CSS translateY transform)

      if (scrollFraction <= 0.20) {
        const progress1 = Math.min(1, scrollFraction / 0.20);
        const frameIndex1 = Math.min(
          TOTAL_FRAMES_1 - 1,
          Math.max(0, Math.floor(progress1 * TOTAL_FRAMES_1))
        );
        const activeImage = images1[frameIndex1];
        if (activeImage && activeImage.complete) {
          drawCoverImage(activeImage, 0, 0);
        }
      } else if (scrollFraction > 0.20 && scrollFraction <= 0.25) {
        const transitionProgress = (scrollFraction - 0.20) / 0.05;
        const yOffset1 = -transitionProgress * canvas.height;
        const yOffset2 = (1 - transitionProgress) * canvas.height;

        const img1 = images1[TOTAL_FRAMES_1 - 1];
        const img2 = images2[0];

        if (img1 && img1.complete) {
          drawCoverImage(img1, 0, yOffset1);
        }
        if (img2 && img2.complete) {
          drawCoverImage(img2, 0, yOffset2);
        }
      } else if (scrollFraction > 0.25 && scrollFraction <= 0.45) {
        const progress2 = Math.min(1, (scrollFraction - 0.25) / 0.20);
        const frameIndex2 = Math.min(
          TOTAL_FRAMES_2 - 1,
          Math.max(0, Math.floor(progress2 * TOTAL_FRAMES_2))
        );
        const activeImage = images2[frameIndex2];
        if (activeImage && activeImage.complete) {
          drawCoverImage(activeImage, 0, 0);
        }
      } else if (scrollFraction > 0.45 && scrollFraction <= 0.50) {
        const transitionProgress = (scrollFraction - 0.45) / 0.05;
        const xOffset2 = -transitionProgress * canvas.width;
        const xOffset3 = (1 - transitionProgress) * canvas.width;

        const img2 = images2[TOTAL_FRAMES_2 - 1];
        const img3 = images3[0];

        if (img2 && img2.complete) {
          drawCoverImage(img2, xOffset2, 0);
        }
        if (img3 && img3.complete) {
          drawCoverImage(img3, xOffset3, 0);
        }
      } else if (scrollFraction > 0.50 && scrollFraction <= 0.70) {
        const progress3 = Math.min(1, (scrollFraction - 0.50) / 0.20);
        const frameIndex3 = Math.min(
          TOTAL_FRAMES_3 - 1,
          Math.max(0, Math.floor(progress3 * TOTAL_FRAMES_3))
        );
        const activeImage = images3[frameIndex3];
        if (activeImage && activeImage.complete) {
          drawCoverImage(activeImage, 0, 0);
        }
      } else if (scrollFraction > 0.70 && scrollFraction <= 0.75) {
        const transitionProgress = (scrollFraction - 0.70) / 0.05;
        const yOffset3 = transitionProgress * canvas.height;
        const yOffset4 = (-1 + transitionProgress) * canvas.height;

        const img3 = images3[TOTAL_FRAMES_3 - 1];
        const img4 = images4[0];

        if (img3 && img3.complete) {
          drawCoverImage(img3, 0, yOffset3);
        }
        if (img4 && img4.complete) {
          drawCoverImage(img4, 0, yOffset4);
        }
      } else {
        // From 0.75 to 1.00: The fourth animation plays and completes by 0.92,
        // stays static from 0.92 onwards, and translates up via CSS from 0.95 to 1.00
        const progress4 = Math.min(1, (scrollFraction - 0.75) / 0.17);
        const frameIndex4 = Math.min(
          TOTAL_FRAMES_4 - 1,
          Math.max(0, Math.floor(progress4 * TOTAL_FRAMES_4))
        );
        const activeImage = images4[frameIndex4];
        if (activeImage && activeImage.complete) {
          drawCoverImage(activeImage, 0, 0);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', renderFrame);

    // Initial load and render
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', renderFrame);
    };
  }, [loading, images1, images2, images3, images4]);

  const percentLoaded = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  // Fade out calculations for the landing page overlay
  const landingOpacity = Math.max(0, 1 - scrollTop / 300);
  const showLanding = landingOpacity > 0;

  // Slide up translation for the fixed canvas container is computed inside renderFrame

  // Calculate scroll indicator opacity:
  // Fades out completely as user scrolls close to the hero section (starting at 92% and complete by 95%)
  const scrollIndicatorOpacity = scrollProgress >= 0.92 ? Math.max(0, 1 - (scrollProgress - 0.92) / 0.03) : 1;

  // Calculate first animation text overlay opacity
  let firstOverlayOpacity = 0;
  if (scrollProgress > 0.02 && scrollProgress <= 0.20) {
    if (scrollProgress <= 0.06) {
      firstOverlayOpacity = (scrollProgress - 0.02) / 0.04;
    } else if (scrollProgress > 0.06 && scrollProgress <= 0.15) {
      firstOverlayOpacity = 1;
    } else {
      firstOverlayOpacity = Math.max(0, 1 - (scrollProgress - 0.15) / 0.05);
    }
  }
  const showFirstOverlay = firstOverlayOpacity > 0;

  // Calculate second animation text overlay opacity
  let secondOverlayOpacity = 0;
  if (scrollProgress > 0.25 && scrollProgress <= 0.45) {
    if (scrollProgress <= 0.29) {
      secondOverlayOpacity = (scrollProgress - 0.25) / 0.04;
    } else if (scrollProgress > 0.29 && scrollProgress <= 0.40) {
      secondOverlayOpacity = 1;
    } else {
      secondOverlayOpacity = Math.max(0, 1 - (scrollProgress - 0.40) / 0.05);
    }
  }
  const showSecondOverlay = secondOverlayOpacity > 0;

  // Calculate third animation text overlay opacity
  let thirdOverlayOpacity = 0;
  if (scrollProgress > 0.50 && scrollProgress <= 0.70) {
    if (scrollProgress <= 0.54) {
      thirdOverlayOpacity = (scrollProgress - 0.50) / 0.04;
    } else if (scrollProgress > 0.54 && scrollProgress <= 0.65) {
      thirdOverlayOpacity = 1;
    } else {
      thirdOverlayOpacity = Math.max(0, 1 - (scrollProgress - 0.65) / 0.05);
    }
  }
  const showThirdOverlay = thirdOverlayOpacity > 0;

  // Calculate fourth animation text overlay opacity (first phase)
  let fourthOverlayOpacity = 0;
  if (scrollProgress > 0.75 && scrollProgress <= 0.92) {
    const progress4 = Math.min(1, (scrollProgress - 0.75) / 0.17);
    const frameIndex4 = Math.min(
      TOTAL_FRAMES_4 - 1,
      Math.max(0, Math.floor(progress4 * TOTAL_FRAMES_4))
    );

    if (frameIndex4 <= 44) {
      if (frameIndex4 <= 10) {
        fourthOverlayOpacity = frameIndex4 / 10;
      } else if (frameIndex4 > 10 && frameIndex4 <= 34) {
        fourthOverlayOpacity = 1;
      } else {
        fourthOverlayOpacity = Math.max(0, 1 - (frameIndex4 - 34) / 10);
      }
    }
  }
  const showFourthOverlay = fourthOverlayOpacity > 0;

  // Calculate fourth animation second phase text overlay opacity
  let fourthOverlayPhase2Opacity = 0;
  if (scrollProgress > 0.75 && scrollProgress <= 0.95) {
    const progress4 = Math.min(1, (scrollProgress - 0.75) / 0.17);
    const frameIndex4 = Math.min(
      TOTAL_FRAMES_4 - 1,
      Math.max(0, Math.floor(progress4 * TOTAL_FRAMES_4))
    );

    if (scrollProgress <= 0.92) {
      if (frameIndex4 >= 45) {
        if (frameIndex4 <= 55) {
          fourthOverlayPhase2Opacity = (frameIndex4 - 45) / 10;
        } else {
          fourthOverlayPhase2Opacity = 1;
        }
      }
    } else {
      if (scrollProgress <= 0.94) {
        fourthOverlayPhase2Opacity = 1;
      } else {
        fourthOverlayPhase2Opacity = Math.max(0, 1 - (scrollProgress - 0.94) / 0.01);
      }
    }
  }
  const showFourthOverlayPhase2 = fourthOverlayPhase2Opacity > 0;



  return (
    <>
      {loading ? (
        <div className="loader-container">
          <div className="loader-content">
            <h1 className="loader-brand">Loavia</h1>
            <div className="loader-track">
              <div
                className="loader-fill"
                style={{ width: `${percentLoaded}%` }}
              ></div>
            </div>
            <p className="loader-percentage">{percentLoaded}%</p>
            <p className="loader-subtitle">Preparing healthy goodness...</p>
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="scroll-animation-wrapper">
          {/* Sticky Animation Canvas and Overlays Container */}
          <div
            className="canvas-container"
            style={{
              position: canvasPosition,
              top: canvasPosition === 'fixed' ? 0 : `${canvasTop}px`,
            }}
          >
            <canvas ref={canvasRef} className="animation-canvas"></canvas>

            {/* Global Vignette Overlay */}
            <div className="global-vignette"></div>

            {/* Landing Logo Page (Overlays the animation) */}
            {showLanding && (
              <div
                className="landing-container"
                style={{
                  opacity: landingOpacity,
                  pointerEvents: landingOpacity < 0.2 ? 'none' : 'auto'
                }}
              >
                <div className="background-image"></div>
                <div className="background-overlay"></div>
                <div className="logo-wrapper">
                  <img src="/logo.png" alt="Loavia Logo" className="logo-img" />
                </div>
              </div>
            )}

            {/* First Animation Text & Shadow Overlay */}
            {showFirstOverlay && (
              <div
                className="first-anim-overlay"
                style={{ opacity: firstOverlayOpacity }}
              >
                <div className="dust-shadow"></div>
                <div className="overlay-text-content">
                  <h1 className="overlay-heading">
                    <span className="heading-white">From a</span>
                    <br />
                    <span className="heading-gold">Baker's Passion</span>
                  </h1>
                  <div className="heading-underline"></div>
                  <h2 className="overlay-subheading">
                    Every journey begins with passion
                    <br />
                    made with love, baked for you.
                  </h2>
                </div>
              </div>
            )}

            {/* Second Animation Text & Shadow Overlay */}
            {showSecondOverlay && (
              <div
                className="second-anim-overlay"
                style={{ opacity: secondOverlayOpacity }}
              >
                <div className="bottom-shadow"></div>
                <div className="overlay-text-content-center">
                  <h1 className="overlay-heading">
                    <span className="heading-white">Rolled with</span>
                    <br />
                    <span className="heading-gold">Care</span>
                  </h1>
                  <div className="heading-underline"></div>
                  <h2 className="overlay-subheading">
                    Gently shaping the basis
                    <br />
                    of every great recipe.
                  </h2>
                </div>
              </div>
            )}

            {/* Third Animation Text & Shadow Overlay */}
            {showThirdOverlay && (
              <div
                className="third-anim-overlay"
                style={{ opacity: thirdOverlayOpacity }}
              >
                <div className="bottom-left-shadow"></div>
                <div className="overlay-text-content-bottom-left">
                  <h1 className="overlay-heading">
                    <span className="heading-white">Crafted with</span>
                    <br />
                    <span className="heading-gold">Care</span>
                  </h1>
                  <div className="heading-underline"></div>
                  <h2 className="overlay-subheading">
                    Wholesome ingredients,
                    <br />
                    thoughtfully chosen.
                  </h2>
                </div>
              </div>
            )}

            {/* Fourth Animation Text & Shadow Overlay */}
            {showFourthOverlay && (
              <div
                className="fourth-anim-overlay"
                style={{ opacity: fourthOverlayOpacity }}
              >
                <div className="top-center-shadow"></div>
                <div className="overlay-text-content-top-center">
                  <h1 className="overlay-heading">
                    <span className="heading-white">Baked to</span>
                    <br />
                    <span className="heading-gold">Bring Joy</span>
                  </h1>
                  <div className="heading-underline"></div>
                  <h2 className="overlay-subheading">
                    Nourishing cookies
                    <br />
                    that delight in every bite.
                  </h2>
                </div>
              </div>
            )}

            {/* Fourth Animation Second Phase Text & Shadow Overlay */}
            {showFourthOverlayPhase2 && (
              <div 
                className="fourth-anim-phase2-overlay" 
                style={{ opacity: fourthOverlayPhase2Opacity }}
              >
                <div className="bottom-left-shadow"></div>
                <div className="overlay-text-content-bottom-left">
                  <h1 className="overlay-heading">
                    <span className="heading-white">Packed with</span>
                    <br />
                    <span className="heading-gold">Love</span>
                  </h1>
                  <div className="heading-underline"></div>
                  <h2 className="overlay-subheading">
                    For moments
                    <br />
                    that matter.
                  </h2>
                </div>
              </div>
            )}

            {/* Vertical Scroll Down Indicator */}
            <div
              className={`scroll-indicator ${(showFirstOverlay || showSecondOverlay || showThirdOverlay || showFourthOverlay || showFourthOverlayPhase2) ? 'off-white' : ''}`}
              style={{ opacity: scrollIndicatorOpacity }}
            >
              <span className="scroll-text">SCROLL DOWN</span>
              <div className="scroll-line">
                <div className="scroll-dot"></div>
              </div>
            </div>


          </div>

          {/* Spacer to allow scrolling - matches 1600vh height */}
          <div className="scroll-spacer"></div>
        </div>
      )}
    </>
  );
}

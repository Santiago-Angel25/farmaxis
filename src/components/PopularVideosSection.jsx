import { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogSurface,
} from "@fluentui/react-components";
import {
  ArrowLeftRegular,
  ArrowRightRegular,
  Cart24Regular,
  DismissRegular,
  PlayRegular,
} from "@fluentui/react-icons";
import gsap from "gsap";
import POPULAR_VIDEOS from "../data/POPULAR_VIDEOS,js";
import "../styles/PopularVideosSection.css";

function PopularVideosSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const activeVideo = activeIndex === null ? null : POPULAR_VIDEOS[activeIndex];
  const carouselVideos = [...POPULAR_VIDEOS, ...POPULAR_VIDEOS, ...POPULAR_VIDEOS];

  const moveTrack = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector(".popular-video-card");
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    const cardStep = (firstCard?.clientWidth || track.clientWidth * 0.75) + gap;

    track.scrollBy({
      left: direction * cardStep,
      behavior: "smooth",
    });
  };

  const moveStory = (direction) => {
    setQuantity(0);
    setActiveIndex((current) =>
      (current + direction + POPULAR_VIDEOS.length) % POPULAR_VIDEOS.length,
    );
  };

  const animateCard = (event, entering) => {
    gsap.to(event.currentTarget, {
      scale: entering ? 1.07 : 1,
      y: entering ? -7 : 0,
      zIndex: entering ? 2 : 0,
      duration: entering ? 0.38 : 0.3,
      ease: entering ? "power3.out" : "power2.inOut",
      overwrite: "auto",
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let context;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.disconnect();
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        context = gsap.context(() => {
          const entrance = gsap.timeline();

          if (reduceMotion) {
            entrance.fromTo(
              [".popular-videos__heading", ".popular-video-card"],
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.2, stagger: 0.02 },
            );
            return;
          }

          entrance
            .fromTo(
              ".popular-videos__heading",
              { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" },
              {
                autoAlpha: 1,
                clipPath: "inset(0 0% 0 0)",
                duration: 0.65,
                ease: "power3.out",
              },
            )
            .fromTo(
              ".popular-video-card",
              {
                autoAlpha: 0,
                scale: 0.88,
                rotateY: 12,
                filter: "blur(8px)",
              },
              {
                autoAlpha: 1,
                scale: 1,
                rotateY: 0,
                filter: "blur(0px)",
                duration: 0.7,
                stagger: 0.09,
                ease: "back.out(1.25)",
              },
              "-=0.2",
            );
        }, section);
      },
      { threshold: 0.12 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      context?.revert();
    };
  }, []);

  useEffect(() => {
    if (activeVideo?.videoSrc) videoRef.current?.play().catch(() => {});
  }, [activeVideo]);

  useEffect(() => {
    document.body.classList.toggle("popular-video-dialog-is-open", activeIndex !== null);
    return () => document.body.classList.remove("popular-video-dialog-is-open");
  }, [activeIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const frame = requestAnimationFrame(() => {
      track.scrollLeft = track.scrollWidth / 3;
    });

    const keepInfinite = () => {
      const segmentWidth = track.scrollWidth / 3;
      if (track.scrollLeft < segmentWidth * 0.25) {
        track.scrollLeft += segmentWidth;
      } else if (track.scrollLeft > segmentWidth * 1.75) {
        track.scrollLeft -= segmentWidth;
      }
    };

    track.addEventListener("scroll", keepInfinite, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", keepInfinite);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="lo-mas-popular"
      className="popular-videos"
      aria-labelledby="popular-videos-title"
    >
      <div className="popular-videos__heading">
        <h2 id="popular-videos-title">Conoce lo más popular</h2>
      </div>

      <div className="popular-videos__carousel">
        <Button
          className="popular-videos__arrow"
          appearance="subtle"
          shape="circular"
          icon={<ArrowLeftRegular />}
          aria-label="Ver promociones anteriores"
          onClick={() => moveTrack(-1)}
        />

        <div className="popular-videos__track" ref={trackRef}>
          {carouselVideos.map((video, index) => {
            const videoIndex = index % POPULAR_VIDEOS.length;
            return (
            <button
              className="popular-video-card"
              key={`${Math.floor(index / POPULAR_VIDEOS.length)}-${video.id}`}
              type="button"
              aria-label={`Reproducir: ${video.title}`}
              onClick={() => {
                setQuantity(0);
                setActiveIndex(videoIndex);
              }}
              onMouseEnter={(event) => animateCard(event, true)}
              onMouseLeave={(event) => animateCard(event, false)}
              onFocus={(event) => animateCard(event, true)}
              onBlur={(event) => animateCard(event, false)}
            >
              <video
                className="popular-video-card__media"
                src={video.videoSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              <span className="popular-video-card__scrim" />
              <span className="popular-video-card__play" aria-hidden="true">
                <PlayRegular />
              </span>
              <span className="popular-video-card__caption">{video.title}</span>
            </button>
            );
          })}
        </div>

        <Button
          className="popular-videos__arrow"
          appearance="subtle"
          shape="circular"
          icon={<ArrowRightRegular />}
          aria-label="Ver más promociones"
          onClick={() => moveTrack(1)}
        />
      </div>

      <Dialog
        open={activeVideo !== null}
        onOpenChange={(_, data) => {
          if (!data.open) setActiveIndex(null);
        }}
        modalType="modal"
      >
        <DialogSurface
          className="popular-video-dialog"
          style={{
            width: "auto",
            minWidth: 0,
            maxWidth: "none",
            padding: 0,
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          {activeVideo && (
            <div className="popular-video-dialog__player">
              <video
                key={activeVideo.id}
                ref={videoRef}
                src={activeVideo.videoSrc}
                controls
                autoPlay
                loop
                playsInline
              />
              <Button
                className="popular-video-dialog__close"
                appearance="subtle"
                icon={<DismissRegular />}
                aria-label="Cerrar video"
                onClick={() => setActiveIndex(null)}
              />
              <Button
                className="popular-video-dialog__story-arrow popular-video-dialog__story-arrow--previous"
                appearance="subtle"
                icon={<ArrowLeftRegular />}
                aria-label="Video anterior"
                onClick={() => moveStory(-1)}
              />
              <Button
                className="popular-video-dialog__story-arrow popular-video-dialog__story-arrow--next"
                appearance="subtle"
                icon={<ArrowRightRegular />}
                aria-label="Siguiente video"
                onClick={() => moveStory(1)}
              />
              {quantity === 0 ? (
                <Button
                  className="popular-video-dialog__add-cart"
                  appearance="primary"
                  icon={<Cart24Regular />}
                  aria-label="Agregar al carrito"
                  onClick={() => setQuantity(1)}
                >
                  Agregar al carrito
                </Button>
              ) : (
                <div
                  className="popular-video-dialog__quantity"
                  aria-label={`${quantity} productos agregados al carrito`}
                >
                  <Button
                    appearance="transparent"
                    aria-label="Quitar una unidad"
                    onClick={() => setQuantity((current) => current - 1)}
                  >
                    −
                  </Button>
                  <span>
                    <strong>Agregado</strong>
                    <b>{quantity}</b>
                  </span>
                  <Button
                    appearance="transparent"
                    aria-label="Agregar una unidad"
                    onClick={() => setQuantity((current) => current + 1)}
                  >
                    +
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogSurface>
      </Dialog>
    </section>
  );
}

export default PopularVideosSection;



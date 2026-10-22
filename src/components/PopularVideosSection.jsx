import { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from "@fluentui/react-components";
import {
  ArrowLeftRegular,
  ArrowRightRegular,
  DismissRegular,
  PlayRegular,
  ShoppingBagAddRegular,
} from "@fluentui/react-icons";
import gsap from "gsap";
import POPULAR_VIDEOS from "../data/POPULAR_VIDEOS,js";
import "../styles/PopularVideosSection.css";

function PopularVideosSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [addedProduct, setAddedProduct] = useState(false);
  const activeVideo = activeIndex === null ? null : POPULAR_VIDEOS[activeIndex];

  const moveTrack = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * track.clientWidth * 0.75,
      behavior: "smooth",
    });
  };

  const moveStory = (direction) => {
    setAddedProduct(false);
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
          {POPULAR_VIDEOS.map((video, index) => (
            <button
              className="popular-video-card"
              key={video.id}
              type="button"
              aria-label={`Reproducir: ${video.title}`}
              onClick={() => {
                setAddedProduct(false);
                setActiveIndex(index);
              }}
              onMouseEnter={(event) => animateCard(event, true)}
              onMouseLeave={(event) => animateCard(event, false)}
              onFocus={(event) => animateCard(event, true)}
              onBlur={(event) => animateCard(event, false)}
            >
              {video.videoSrc ? (
                <video
                  className="popular-video-card__media"
                  src={video.videoSrc}
                  poster={video.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  className="popular-video-card__media"
                  src={video.poster}
                  alt=""
                />
              )}
              <span className="popular-video-card__scrim" />
              <span className="popular-video-card__play" aria-hidden="true">
                <PlayRegular />
              </span>
              <span className="popular-video-card__caption">{video.title}</span>
            </button>
          ))}
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
        <DialogSurface className="popular-video-dialog">
          {activeVideo && (
            <>
              <div className="popular-video-dialog__header">
                <DialogTitle>{activeVideo.title}</DialogTitle>
                <Button
                  appearance="subtle"
                  icon={<DismissRegular />}
                  aria-label="Cerrar video"
                  onClick={() => setActiveIndex(null)}
                />
              </div>
              <DialogBody>
                <DialogContent>
                  <div className="popular-video-dialog__layout">
                    <div className="popular-video-dialog__player">
                      {activeVideo.videoSrc ? (
                        <video
                          ref={videoRef}
                          src={activeVideo.videoSrc}
                          poster={activeVideo.poster}
                          controls
                          autoPlay
                          playsInline
                        />
                      ) : (
                        <img src={activeVideo.poster} alt={activeVideo.title} />
                      )}
                      <Button
                        className="popular-video-dialog__story-arrow popular-video-dialog__story-arrow--previous"
                        appearance="subtle"
                        icon={<ArrowLeftRegular />}
                        aria-label="Promoción anterior"
                        onClick={() => moveStory(-1)}
                      />
                      <Button
                        className="popular-video-dialog__story-arrow popular-video-dialog__story-arrow--next"
                        appearance="subtle"
                        icon={<ArrowRightRegular />}
                        aria-label="Siguiente promoción"
                        onClick={() => moveStory(1)}
                      />
                    </div>

                    <div className="popular-video-product">
                      <img src={activeVideo.poster} alt="" />
                      <div className="popular-video-product__details">
                        <strong>{activeVideo.product}</strong>
                        <span>Producto destacado en esta promoción</span>
                      </div>
                      <Button
                        appearance="primary"
                        icon={<ShoppingBagAddRegular />}
                        onClick={() => setAddedProduct(true)}
                      >
                        {addedProduct ? "Agregado" : "Agregar al carrito"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </DialogBody>
            </>
          )}
        </DialogSurface>
      </Dialog>
    </section>
  );
}

export default PopularVideosSection;



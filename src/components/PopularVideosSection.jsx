import { useEffect, useRef, useState } from "react";
import { Button, Dialog, DialogSurface } from "@fluentui/react-components";
import {
  AddRegular,
  ArrowLeftRegular,
  ArrowRightRegular,
  Cart24Regular,
  DismissRegular,
  PlayRegular,
  SubtractRegular,
} from "@fluentui/react-icons";
import gsap from "gsap";
import POPULAR_VIDEOS from "../data/POPULAR_VIDEOS,js";
import { useStore } from "../context/StoreContext";
import "../styles/PopularVideosSection.css";

function PopularVideosSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const focusFrameRef = useRef(null);
  const activeIndexRef = useRef(null);
  const carouselReadyRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const { cartItems, addToCart, updateCartQuantity, removeFromCart } = useStore();
  const activeVideo = activeIndex === null ? null : POPULAR_VIDEOS[activeIndex];
  const carouselVideos = [...POPULAR_VIDEOS, ...POPULAR_VIDEOS, ...POPULAR_VIDEOS];

  const getCenteredCard = () => {
    const track = trackRef.current;
    if (!track) return null;
    const trackBounds = track.getBoundingClientRect();
    const center = trackBounds.left + trackBounds.width / 2;
    let closestCard = null;
    let closestDistance = Infinity;

    track.querySelectorAll(".popular-video-card").forEach((card) => {
      const bounds = card.getBoundingClientRect();
      const distance = Math.abs(bounds.left + bounds.width / 2 - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
      }
    });
    return closestCard;
  };

  const updateCenteredCard = () => {
    const track = trackRef.current;
    if (!track) return null;
    const centeredCard = getCenteredCard();
    track.querySelectorAll(".popular-video-card").forEach((card) => {
      card.classList.toggle("is-centered", card === centeredCard);
    });
    return centeredCard;
  };

  const pauseCarouselVideos = () => {
    trackRef.current?.querySelectorAll(".popular-video-card__media").forEach((video) => video.pause());
  };

  const playCenteredVideo = () => {
    if (activeIndexRef.current !== null) return;
    const centeredCard = updateCenteredCard();
    if (!centeredCard) return;
    const centeredVideo = centeredCard.querySelector("video");
    trackRef.current?.querySelectorAll(".popular-video-card__media").forEach((video) => {
      if (video !== centeredVideo) video.pause();
    });
    centeredVideo?.play().catch(() => {});
  };

  const moveTrack = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector(".popular-video-card");
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    const cardStep = (firstCard?.clientWidth || track.clientWidth * 0.75) + gap;
    track.scrollBy({ left: direction * cardStep, behavior: "smooth" });
  };

  const moveStory = (direction) => {
    setActiveIndex((current) =>
      (current + direction + POPULAR_VIDEOS.length) % POPULAR_VIDEOS.length,
    );
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    let context;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
            { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", duration: 0.65, ease: "power3.out" },
          )
          .fromTo(
            ".popular-video-card",
            { autoAlpha: 0, scale: 0.88, rotateY: 12, filter: "blur(8px)" },
            {
              autoAlpha: 1,
              scale: 1,
              rotateY: 0,
              filter: "blur(0px)",
              duration: 0.7,
              stagger: 0.09,
              ease: "back.out(1.25)",
              clearProps: "transform,opacity,visibility,filter",
            },
            "-=0.2",
          );
      }, section);
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => {
      observer.disconnect();
      context?.revert();
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const keepInfinite = () => {
      const segmentWidth = track.scrollWidth / 3;
      if (track.scrollLeft < segmentWidth * 0.25) track.scrollLeft += segmentWidth;
      else if (track.scrollLeft > segmentWidth * 1.75) track.scrollLeft -= segmentWidth;
    };

    const handleScroll = () => {
      pauseCarouselVideos();
      if (focusFrameRef.current) cancelAnimationFrame(focusFrameRef.current);
      focusFrameRef.current = requestAnimationFrame(() => {
        focusFrameRef.current = null;
        updateCenteredCard();
      });
      window.clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = window.setTimeout(playCenteredVideo, 150);
    };

    const frame = requestAnimationFrame(() => {
      track.scrollLeft = track.scrollWidth / 3;
      updateCenteredCard();
      carouselReadyRef.current = true;
      autoPlayTimerRef.current = window.setTimeout(playCenteredVideo, 80);
    });
    track.addEventListener("scroll", keepInfinite, { passive: true });
    track.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      if (focusFrameRef.current) cancelAnimationFrame(focusFrameRef.current);
      window.clearTimeout(autoPlayTimerRef.current);
      track.removeEventListener("scroll", keepInfinite);
      track.removeEventListener("scroll", handleScroll);
      pauseCarouselVideos();
      carouselReadyRef.current = false;
    };
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    if (activeIndex !== null) {
      pauseCarouselVideos();
      return undefined;
    }
    if (carouselReadyRef.current) {
      window.clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = window.setTimeout(playCenteredVideo, 80);
    }
    return undefined;
  }, [activeIndex]);

  useEffect(() => {
    document.body.classList.toggle("popular-video-dialog-is-open", activeIndex !== null);
    return () => document.body.classList.remove("popular-video-dialog-is-open");
  }, [activeIndex]);

  useEffect(() => {
    if (activeVideo?.videoSrc) videoRef.current?.play().catch(() => {});
  }, [activeVideo]);

  const cartProduct = activeVideo
    ? {
        id: `popular-video-${activeVideo.id}`,
        name: activeVideo.product,
        price: Number(activeVideo.price) || 0,
        image: activeVideo.productImage || "",
        availability: "Producto promocionado",
      }
    : null;
  const cartQuantity = cartProduct
    ? cartItems.find((item) => item.product.id === cartProduct.id)?.quantity ?? 0
    : 0;

  const decreaseQuantity = () => {
    if (!cartProduct || cartQuantity < 1) return;
    if (cartQuantity === 1) removeFromCart(cartProduct.id);
    else updateCartQuantity(cartProduct.id, cartQuantity - 1);
  };

  const increaseQuantity = () => {
    if (!cartProduct) return;
    if (cartQuantity === 0) addToCart(cartProduct);
    else updateCartQuantity(cartProduct.id, cartQuantity + 1);
  };

  return (
    <section ref={sectionRef} id="lo-mas-popular" className="popular-videos" aria-labelledby="popular-videos-title">
      <div className="popular-videos__heading">
        <h2 id="popular-videos-title">Conoce lo más popular</h2>
      </div>
      <div className="popular-videos__carousel">
        <Button className="popular-videos__arrow" appearance="subtle" shape="circular" icon={<ArrowLeftRegular />} aria-label="Ver promociones anteriores" onClick={() => moveTrack(-1)} />
        <div className="popular-videos__track" ref={trackRef}>
          {carouselVideos.map((video, index) => {
            const videoIndex = index % POPULAR_VIDEOS.length;
            return (
              <button
                className="popular-video-card"
                key={`${Math.floor(index / POPULAR_VIDEOS.length)}-${video.id}`}
                type="button"
                aria-label={`Reproducir: ${video.title}`}
                onClick={() => setActiveIndex(videoIndex)}
              >
                <video className="popular-video-card__media" src={video.videoSrc} muted loop playsInline preload="metadata" />
                <span className="popular-video-card__scrim" />
                <span className="popular-video-card__play" aria-hidden="true"><PlayRegular /></span>
                <span className="popular-video-card__caption">{video.title}</span>
              </button>
            );
          })}
        </div>
        <Button className="popular-videos__arrow" appearance="subtle" shape="circular" icon={<ArrowRightRegular />} aria-label="Ver más promociones" onClick={() => moveTrack(1)} />
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
          style={{ width: "auto", minWidth: 0, maxWidth: "none", padding: 0, backgroundColor: "transparent", boxShadow: "none" }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null);
          }}
        >
          {activeVideo && (
            <div className="popular-video-dialog__player">
              <video key={activeVideo.id} ref={videoRef} src={activeVideo.videoSrc} controls autoPlay loop playsInline />
              <Button className="popular-video-dialog__close" appearance="subtle" icon={<DismissRegular />} aria-label="Cerrar video" onClick={() => setActiveIndex(null)} />
              <Button className="popular-video-dialog__story-arrow popular-video-dialog__story-arrow--previous" appearance="subtle" icon={<ArrowLeftRegular />} aria-label="Video anterior" onClick={() => moveStory(-1)} />
              <Button className="popular-video-dialog__story-arrow popular-video-dialog__story-arrow--next" appearance="subtle" icon={<ArrowRightRegular />} aria-label="Siguiente video" onClick={() => moveStory(1)} />
              {cartQuantity === 0 ? (
                <Button className="popular-video-dialog__add-cart" appearance="primary" icon={<Cart24Regular />} aria-label="Agregar al carrito" onClick={increaseQuantity}>
                  Agregar al carrito
                </Button>
              ) : (
                <div className="popular-video-dialog__quantity" aria-label={`${cartQuantity} unidades de ${activeVideo.product}`}>
                  <Button appearance="transparent" icon={<SubtractRegular />} aria-label="Quitar una unidad" onClick={decreaseQuantity} />
                  <span><strong>En el carrito</strong><b>{cartQuantity}</b></span>
                  <Button appearance="transparent" icon={<AddRegular />} aria-label="Agregar una unidad" onClick={increaseQuantity} />
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
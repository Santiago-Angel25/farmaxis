import {
  Carousel,
  CarouselButton,
  CarouselCard,
  CarouselSlider,
  CarouselViewport,
} from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRegular, ArrowRightRegular } from "@fluentui/react-icons";
import Banner from "../data/banner";
import "../styles/PromoCarousel.css";

function PromoCarousel() {
  const navigate = useNavigate();

  return (
    <Carousel
      className="promo-carousel"
      groupSize={1}
      circular
      aria-label="Promociones destacadas"
    >
      <CarouselViewport className="promo-carousel__viewport">
        <CarouselSlider className="promo-carousel__slider">
          {Banner.map((promo, index) => {
            const isClickable = Boolean(promo.target);

            return (
              <CarouselCard
                key={promo.id}
                className={`promo-carousel__slide promo-carousel__slide--${promo.fit}${isClickable ? " promo-carousel__slide--clickable" : ""}`}
                aria-label={isClickable ? `${index + 1} de ${Banner.length}; ver promoción` : `${index + 1} de ${Banner.length}`}
                role={isClickable ? "link" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onClick={isClickable ? () => navigate(promo.target) : undefined}
                onKeyDown={isClickable ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(promo.target);
                  }
                } : undefined}
              >
                <img
                  className="promo-carousel__image"
                  src={promo.image}
                  alt={promo.alt}
                />
              </CarouselCard>
            );
          })}
        </CarouselSlider>
      </CarouselViewport>

      <CarouselButton
        className="promo-carousel__arrow promo-carousel__arrow--previous"
        navType="prev"
        appearance="subtle"
        icon={<ArrowLeftRegular />}
        aria-label="Ver promoción anterior"
      />
      <CarouselButton
        className="promo-carousel__arrow promo-carousel__arrow--next"
        navType="next"
        appearance="subtle"
        icon={<ArrowRightRegular />}
        aria-label="Ver promoción siguiente"
      />
    </Carousel>
  );
}

export default PromoCarousel;

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
  const goToCatalog = () => navigate("/categories");

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
            const linksToCatalog = promo.id === "promocion-1";

            return (
              <CarouselCard
                key={promo.id}
                className={`promo-carousel__slide${linksToCatalog ? " promo-carousel__slide--clickable" : ""}`}
                aria-label={linksToCatalog ? `${index + 1} de ${Banner.length}; ir a todos los productos` : `${index + 1} de ${Banner.length}`}
                role={linksToCatalog ? "link" : undefined}
                tabIndex={linksToCatalog ? 0 : undefined}
                onClick={linksToCatalog ? goToCatalog : undefined}
                onKeyDown={linksToCatalog ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    goToCatalog();
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

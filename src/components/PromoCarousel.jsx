import {
  Carousel,
  CarouselButton,
  CarouselCard,
  CarouselSlider,
  CarouselViewport,
} from "@fluentui/react-components";
import { ArrowLeftRegular, ArrowRightRegular } from "@fluentui/react-icons";
import Banner from "../data/banner";
import "../styles/PromoCarousel.css";

function PromoCarousel() {
  return (
    <Carousel
      className="promo-carousel"
      groupSize={1}
      circular
      aria-label="Promociones destacadas"
    >
      <CarouselViewport className="promo-carousel__viewport">
        <CarouselSlider className="promo-carousel__slider">
          {Banner.map((promo, index) => (
            <CarouselCard
              key={promo.id}
              className="promo-carousel__slide"
              aria-label={`${index + 1} de ${Banner.length}`}
            >
              <img
                className="promo-carousel__image"
                src={promo.image}
                alt={promo.alt}
              />
            </CarouselCard>
          ))}
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

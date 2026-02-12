"use client";

import Image from "next/image";
import { Container, SectionWrapper } from "./primitives";

const galleryImages = [
  "/images/galeria1.jpg",
  "/images/galeria2.jpg",
  "/images/galeria3.jpg",
];

const repeatedGalleryImages = [
  ...galleryImages,
  ...galleryImages,
  ...galleryImages,
];

export function GallerySection() {
  return (
    <SectionWrapper bg="dark">
      <Container>
        <span className="section-label">Galeria</span>

        {/* Mobile: Infinite Scroll */}
        <div className="md:hidden mt-5 relative overflow-hidden">
          <div className="flex gap-2 animate-scroll">
            {repeatedGalleryImages.map((src, index) => (
              <div
                key={index}
                className="relative min-w-[220px] sm:min-w-[260px] h-[420px] rounded-lg overflow-hidden flex-shrink-0"
              >
                <Image
                  src={src}
                  alt={`Trabalho da Barbearia do Moura ${(index % 3) + 1}`}
                  fill
                  className="object-cover"
                  sizes="260px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:flex mt-5 gap-2 h-[560px]">
          {[...galleryImages, galleryImages[0], galleryImages[1]].map((src, index) => (
            <div
              key={index}
              className="relative flex-1 h-full rounded-lg overflow-hidden"
            >
              <Image
                src={src}
                alt={`Trabalho da Barbearia do Moura ${(index % 3) + 1}`}
                fill
                className="object-cover"
                sizes="20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </div>
          ))}
        </div>

        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-220px * 3 - 0.5rem * 3));
            }
          }

          @media (min-width: 640px) {
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-260px * 3 - 0.5rem * 3));
              }
            }
          }

          .animate-scroll {
            animation: scroll 15s linear infinite;
          }

          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </Container>
    </SectionWrapper>
  );
}

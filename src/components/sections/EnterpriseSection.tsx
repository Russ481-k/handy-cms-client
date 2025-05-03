"use client";

import {
  Box,
  Container,
  Heading,
  Highlight,
  Text,
  Image,
  Link,
} from "@chakra-ui/react";
import { useColors, useUserStyles } from "@/styles/theme";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { STYLES } from "@/styles/theme-tokens";
import { useState, useRef } from "react";

const enterprises = [
  {
    name: "오늘의 이야기",
    description: "AI 기반 스토리텔링 플랫폼",
    image: "/images/companies/todays_story.png",
  },
  {
    name: "유니마스",
    description: "해외 셀링지원 원스톱 솔루션",
    image: "/images/companies/unimas.png",
  },
  {
    name: "삼선택",
    description: "AI를 활용한 모바일 키패드",
    image: "/images/companies/samsunteck.png",
  },
  {
    name: "세로라",
    description: "실리카 나노 탈취 방향제",
    image: "/images/companies/serora.png",
  },
  {
    name: "미리네",
    description: "창업가꿈 4호점 1층 내부 카페",
    image: "/images/companies/bizmobility.png",
  },
  {
    name: "미리네",
    description: "창업가꿈 4호점 1층 내부 카페",
    image: "/images/companies/bizmobility.png",
  },
];

export function EnterpriseSection() {
  const colors = useColors();
  const styles = useUserStyles(STYLES);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef(null);

  const handlePlayPause = () => {
    if (swiperRef.current) {
      if (isPlaying) {
        swiperRef.current.swiper.autoplay.stop();
      } else {
        swiperRef.current.swiper.autoplay.start();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.autoplay.stop();
      swiperRef.current.swiper.slideTo(0);
      setIsPlaying(false);
    }
  };

  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.realIndex);
  };

  return (
    <Box
      as="section"
      id="enterpriseSection"
      bg="#F4F8FF"
      p="50px 0"
      fontFamily={styles.fonts.body}
    >
      <Container
        maxW="1600px"
        m="0 auto"
        pl={{
          base: "15px",
          md: "20px",
          lg: "30px",
        }}
        pr={{
          base: "15px",
          md: "20px",
          lg: "30px",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Heading
            as="h3"
            lineHeight="1"
            fontSize={{
              base: "1.25em",
              md: "1.3em",
              lg: "1.4em",
            }}
            color="#007ACD"
            fontWeight="700"
            fontFamily={styles.fonts.body}
          >
            <Highlight
              query="혁신을 만드는 창업가꿈 4호 입주기업"
              styles={{
                color: "#0D344E",
                display: "block",
                fontSize: {
                  base: "1.6em",
                  md: "2em",
                  lg: "2.4em",
                },
                marginTop: "10px",
                whiteSpace: "normal",
              }}
            >
              Introduction to Resident Enterprises 혁신을 만드는 창업가꿈 4호
              입주기업
            </Highlight>
          </Heading>

          <Box display="flex" alignItems="center" gap="20px">
            <Box display="flex" alignItems="center" gap="10px">
              <Text color="#2C65FD" fontWeight="600">
                {currentSlide + 1}
              </Text>
              <div
                className="swiper-pagination"
                style={{
                  width: "200px",
                  position: "relative",
                  height: "4px",
                  backgroundColor: "#E2E8F0",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              />
              <Text color="#2C65FD" fontWeight="600">
                {enterprises.length}
              </Text>
            </Box>
            <Box display="flex" gap="10px">
              <div className="swiper-button-prev" />
              <button
                className="swiper-play-pause"
                onClick={handlePlayPause}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#2C65FD",
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  {isPlaying ? (
                    <>
                      <rect
                        x="6"
                        y="6"
                        width="4"
                        height="12"
                        fill="currentColor"
                      />
                      <rect
                        x="14"
                        y="6"
                        width="4"
                        height="12"
                        fill="currentColor"
                      />
                    </>
                  ) : (
                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                  )}
                </svg>
              </button>
              <button
                className="swiper-stop"
                onClick={handleStop}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#2C65FD",
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="6"
                    y="6"
                    width="12"
                    height="12"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <div className="swiper-button-next" />
            </Box>
          </Box>
        </Box>

        <Swiper
          ref={swiperRef}
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            type: "progressbar",
            el: ".swiper-pagination",
            clickable: true,
          }}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          onSlideChange={handleSlideChange}
          breakpoints={{
            400: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            769: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            1000: {
              slidesPerView: 4,
              spaceBetween: 15,
            },
            1400: {
              slidesPerView: 5,
              spaceBetween: 25,
            },
          }}
          style={{
            "--swiper-pagination-color": "#2C65FD",
            "--swiper-pagination-bullet-size": "8px",
            "--swiper-pagination-bullet-horizontal-gap": "6px",
            "--swiper-navigation-color": "#2C65FD",
            "--swiper-navigation-size": "24px",
          }}
        >
          {enterprises.map((enterprise, index) => (
            <SwiperSlide key={index}>
              <Link
                href="#"
                style={{
                  textDecoration: "none",
                  display: "block",
                  width: "100%",
                }}
                _hover={{
                  "& > div > div:first-of-type": {
                    transform: "translateY(7px)",
                    transition: "transform 0.3s ease-out",
                  },
                }}
              >
                <Box
                  position="relative"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap="15px"
                  backgroundColor="#fff"
                  borderRadius="20px"
                  width="100%"
                  padding="25px"
                  fontFamily={styles.fonts.body}
                >
                  <Box position="absolute" top={4} right={4}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <path
                        d="M16.0826 9.98225L7.54951 18.6617L6.12334 17.2595L14.6565 8.58011L7.07098 8.64457L7.05399 6.64465L18.0536 6.55117L18.147 17.5508L16.1471 17.5678L16.0826 9.98225Z"
                        fill="#2C65FD"
                      />
                    </svg>
                  </Box>
                  <Image
                    src={enterprise.image}
                    alt={enterprise.name}
                    width={{
                      base: "65px",
                      md: "75px",
                      lg: "85px",
                    }}
                    height={{
                      base: "65px",
                      md: "75px",
                      lg: "85px",
                    }}
                    objectFit="contain"
                    borderRadius={50}
                  />
                  <Text
                    color="#666"
                    fontWeight="300"
                    fontSize={{
                      base: "0.9em",
                      md: "1em",
                      lg: "1.1em",
                    }}
                  >
                    {enterprise.description}
                  </Text>
                  <Text
                    color="#292E40"
                    fontSize={{
                      base: "1.2em",
                      md: "1.4em",
                      lg: "1.5625em",
                    }}
                    fontWeight="600"
                  >
                    {enterprise.name}
                  </Text>
                </Box>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  );
}

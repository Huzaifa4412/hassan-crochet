
import BestSeller from "@/components/home/best-seller";
import HeroBanner from "@/components/home/HeroBanner";
import OurProducts from "@/components/home/our-products";
import Personalized from "@/components/home/Personalized";
import TestimonialsSection from "@/components/home/Testimonials";

import React from "react";

const page = () => {
  return (
    <div>

      <HeroBanner />
      <BestSeller />

      {/* Page Divider */}
      <div className="relative">
        <svg
          className="absolute"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#ffff"
            fill-opacity="1"
            d="M0,128L30,133.3C60,139,120,149,180,138.7C240,128,300,96,360,106.7C420,117,480,171,540,165.3C600,160,660,96,720,64C780,32,840,32,900,48C960,64,1020,96,1080,133.3C1140,171,1200,213,1260,213.3C1320,213,1380,171,1410,149.3L1440,128L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"
          ></path>
        </svg>
        <img src="/banner2.jpg" alt="" />
      </div>

      <OurProducts />
      <Personalized />
      <TestimonialsSection />
    </div>
  );
};

export default page;

import React from "react";

const Personalized = () => {
  return (
    <div className="w-full px-4 md:px-20 bg-[#FAF2EF] py-12 min-h-[70vh] overflow-hidden flex items-center">
      <div className="container mx-auto w-full overflow-hidden h-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-5">
        <div className="image w-full md:w-1/2 flex items-center justify-center">
          <img
            src="/home1.webp"
            className="overflow-hidden w-[90%] sm:w-[75%] h-auto rounded-t-full bg-cover"
            alt=""
          />
        </div>
        <div className="text w-full md:w-1/2 max-w-[500px] flex items-center justify-center flex-col gap-5 text-center md:text-left">
          <div className="heading text-3xl sm:text-4xl md:text-5xl font-medium">
            Sweater the Moment with Personalized Knit Names!
          </div>
          <div className="para text-base md:text-lg">
            Personalized hand embroidered knits and more! Great for newborn or
            family events! Premium quality knitted names & decor to make your
            home and nursery unique..
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personalized;

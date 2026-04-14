import React from "react";

const ProductCard = () => {
  return (
    <div className="w-full max-w-[350px] flex flex-col gap-3 mx-auto">
      <div
        className="w-full aspect-square bg-cover bg-center bg-no-repeat rounded-lg"
        style={{ backgroundImage: "url('/products/sweater1.webp')" }}
      ></div>
      <div className="product-name text-lg font-medium text-left line-clamp-2">
        Personalized Baby Name Sweater – Hand Embroidered Knit Outfit, Newborn
        Gift, Baby Shower Gift
      </div>
    </div>
  );
};

export default ProductCard;

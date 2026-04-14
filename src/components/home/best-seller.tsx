import React from "react";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/sanity/queries";

const BestSeller = async () => {
  const products = await getFeaturedProducts(4);

  return (
    <div className="container mx-auto px-4">
      <div className="py-5">
        <h2 className="heading text-3xl md:text-5xl font-semibold text-center mb-6">
          Best Seller
        </h2>
        {products.length > 0 ? (
          <div className="products-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
            {products.map((product) => (
              <div key={product._id} className="text-left font-normal text-base">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSeller;

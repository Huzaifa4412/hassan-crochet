import { getProductBySlug } from './src/sanity/queries';

async function test() {
  const slug = 'hand-embroidered-kidz-name-sweater';
  const product = await getProductBySlug(slug);
  if (product) {
    console.log(`Product: ${product.title}`);
    console.log(`Total Variants: ${product.variants.length}`);
    product.variants.forEach((v, i) => {
      console.log(`[${i}] ${v.colorName}: ${v.imageUrl}`);
    });
  }
}

test().catch(console.error);

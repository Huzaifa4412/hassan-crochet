import { getProducts } from './src/sanity/queries';

async function scan() {
  const products = await getProducts(1000);
  const colorNames = new Set<string>();
  const matches: string[] = [];
  
  products.forEach(p => {
    p.variants?.forEach(v => {
      if (v.colorName) {
        colorNames.add(v.colorName);
        if (v.colorName.toLowerCase().includes('orange') || v.colorName.toLowerCase().includes('camel')) {
          matches.push(`${p.title}: ${v.colorName}`);
        }
      }
    });
  });
  
  console.log('Unique Color Names in Sanity:', Array.from(colorNames).sort());
  console.log('Matches for Orange or Camel:', matches);
}

scan().catch(console.error);

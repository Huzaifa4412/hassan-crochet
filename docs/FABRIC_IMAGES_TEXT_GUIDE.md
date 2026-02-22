# Fabric.js Detailed Guide: Images and Text (v6+)

In modern web applications (like customization platforms, t-shirt designers, or photo editors), handling text and images efficiently is critical. Fabric.js excels at this.

Here’s a deep dive into working with Text and Images in Fabric v6+.

---

## 1. Working with Text

Fabric.js has 3 different classes for text:
1. **`Text`**: Simple, non-editable text. Good for labels.
2. **`IText`** (Interactive Text): Allows users to double-click and type new text directly on the canvas.
3. **`Textbox`**: Extends `IText` but adds **word wrapping**. When the user resizes the bounding box, text automatically flows to the next line. (This is almost always what you want for user inputs).

### Adding a Textbox
```typescript
import { Textbox } from "fabric";

const myText = new Textbox("Double click to edit me!", {
  left: 100,
  top: 100,
  width: 300,        // Max width before text wraps to the next line
  fontSize: 32,
  fontFamily: "Arial", // Note: Ensure the font is loaded in the browser!
  fill: "#333333",     // Text color
  fontWeight: "bold",
  textAlign: "center", // left, center, right, justify
  
  // Interaction properties
  editable: true,
  lockRotation: false,
});

canvas.add(myText);
```

### Advanced Text Styling (Sub-string Styles)
One of Fabric.js's superpowers is styling specific words or characters inside a text block.

```typescript
const styledText = new Textbox("Hello Beautiful World", {
  left: 50,
  top: 250,
  width: 400,
  styles: {
    // 0 = the first line (lines are zero-indexed)
    0: {
      // Index of characters to style
      6: { fill: "red", fontWeight: "bold" }, // B
      7: { fill: "red", fontWeight: "bold" }, // e
      8: { fill: "red", fontWeight: "bold" }, // a
      9: { fill: "red", fontWeight: "bold" }, // u
      10: { fill: "red", fontWeight: "bold", fontStyle: "italic" }, // t
      // ... format letter by letter
    }
  }
});
canvas.add(styledText);
```

### Loading Custom Google Fonts
If you want to use Google Fonts (e.g., "Pacifico", "Roboto"), you must ensure the font file is fully loaded by the browser *before* Fabric attempts to render the text. 

Using the `document.fonts.ready` API or libraries like `webfontloader` is highly recommended.
```typescript
async function addTextWithCustomFont() {
  await document.fonts.ready; // Wait for CSS fonts to load

  const tf = new Textbox("Stylish Font Component", {
    fontFamily: "Pacifico", // Assuming this was included in your global CSS
    fontSize: 40
  });
  canvas.add(tf);
  canvas.renderAll();
}
```

---

## 2. Working with Images

In Fabric.js v6+, images are handled via the `FabricImage` class. Since image loading is asynchronous (the browser needs to download the file before it can be drawn), Fabric utilizes modern Promises to resolve image loads.

### Loading an Image from a URL (v6 Syntax)

```typescript
import { FabricImage } from "fabric";

async function addImageFromURL(url) {
  try {
    // FabricImage.fromURL returns a Promise in v6
    const img = await FabricImage.fromURL(url, { crossOrigin: "anonymous" });
    
    // Set initial properties after loading
    img.set({
      left: 100,
      top: 100,
      opacity: 0.9
    });

    // Scale it down if it's too large
    img.scaleToWidth(300); // Automatically scales height to maintain aspect ratio

    // Optionally center the image on the canvas
    canvas.centerObject(img);

    canvas.add(img);
    canvas.renderAll(); // Always render after adding
    
  } catch (error) {
    console.error("Failed to load image:", error);
  }
}

// Usage
addImageFromURL('https://picsum.photos/400/400');
```
> **Important Note:** When loading external images, always pass `{ crossOrigin: "anonymous" }`. If you do not do this, the canvas will become "tainted" by CORS rules, and you will not be able to export the canvas (using `toDataURL` or `toJSON`).

### Uploading a Local Image (via `<input type="file" />`)
In a React/Next.js app, users often upload their own images. You need to convert the `File` object to an ObjectURL, and then pass it to Fabric.

```tsx
import { FabricImage } from "fabric";

export default function ImageUploader({ fabricCanvas }) {
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a temporary URL for the file
    const url = URL.createObjectURL(file);

    try {
      const img = await FabricImage.fromURL(url);
      
      // Keep it centered and bounded inside the canvas
      img.scaleToWidth(300);
      fabricCanvas.centerObject(img);
      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      
    } finally {
      // Memory cleanup: Release the URL blob
      URL.revokeObjectURL(url);
    }
  };

  return <input type="file" accept="image/*" onChange={handleUpload} />;
}
```

### Image Clipping & Masking (Advanced)
You can mask an image inside another shape (like a circle or a star) using the `clipPath` property. This is very popular for profile picture avatars or custom design shapes.

```typescript
import { FabricImage, Circle } from "fabric";

async function addClippedImage() {
  const img = await FabricImage.fromURL('https://picsum.photos/400/400', { crossOrigin: "anonymous" });
  
  // Create a circle to use as a mask
  const mask = new Circle({
    radius: 100,
    originX: 'center', // The mask's origin must match the image's coordinate system
    originY: 'center',
    // The mask's left/top are relative to the center of the image
  });

  // Apply the clip path
  img.set({
    clipPath: mask,
    left: 200,
    top: 200
  });

  canvas.add(img);
}
```

### Image Filters (Grayscale, Blur, etc.)
Unlike standard CSS filters, Fabric actually modifies the pixel data of the image. This means when you export the canvas, the filters are burned into the final image.

```typescript
import { FabricImage, filters } from "fabric";

async function applyBlackAndWhite(imgObject) {
  // 1. Create a filter instance
  const grayscaleFilter = new filters.Grayscale();
  
  // 2. Add it to the image's filter array
  imgObject.filters.push(grayscaleFilter);
  
  // 3. Apply the filters (Required in v6 to update the pixel data)
  imgObject.applyFilters();
  
  // 4. Re-render the canvas to see changes
  canvas.renderAll();
}
```

Other available filters include: `Blur`, `Brightness`, `Contrast`, `HueRotation`, `Pixelate`, `Sepia`, `Noise`, `BlendColor`, and many more.

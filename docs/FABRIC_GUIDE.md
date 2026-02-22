# Fabric.js (v6+) Complete Guide: Basics to Advanced

Welcome to the comprehensive guide for using **Fabric.js** (version 6 and above) in a modern JavaScript/TypeScript environment (like React or Next.js). In v6+, Fabric adopted modern ES Modules, so naming imports is heavily utilized.

## Table of Contents
1. [Installation](#1-installation)
2. [Basic Setup](#2-basic-setup)
3. [Core Shapes & Objects](#3-core-shapes--objects)
4. [Object Properties & Manipulation](#4-object-properties--manipulation)
5. [Events & Interactivity](#5-events--interactivity)
6. [Grouping Objects](#6-grouping-objects)
7. [Working with Images](#7-working-with-images)
8. [Serialization (Save & Load)](#8-serialization-save--load)
9. [Free Drawing](#9-free-drawing)

---

## 1. Installation

Install Fabric using your preferred package manager.
```bash
npm install fabric
# or
yarn add fabric
# or
bun add fabric
```

**Importing (v6+ best practice):**
```typescript
// Named imports (Recommended for Tree Shaking)
import { Canvas, Rect, Circle, Text } from "fabric";

// OR Namespace import
import * as fabric from "fabric";
```

---

## 2. Basic Setup

To use Fabric.js, you need an HTML `<canvas>` element. Fabric serves as a wrapper around the native HTML5 Canvas API, providing an interactive object model.

### In Vanilla JS / HTML
```html
<canvas id="canvas" width="800" height="600"></canvas>
<script type="module">
  import { Canvas } from "fabric";
  const canvas = new Canvas("canvas");
</script>
```

### In React / Next.js
In React, pass a `ref` of the canvas element to Fabric.
```tsx
"use client";
import { useEffect, useRef } from "react";
import { Canvas } from "fabric";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize Fabric Canvas
    const canvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#f3f4f6"
    });

    // Cleanup on unmount
    return () => {
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
```

---

## 3. Core Shapes & Objects

Fabric provides primitive shapes that can be added to the canvas via `canvas.add()`.

### Rectangle
```typescript
import { Rect } from "fabric";

const rect = new Rect({
  left: 100, // X coordinate
  top: 100,  // Y coordinate
  fill: 'red',
  width: 150,
  height: 100,
  rx: 10,  // Border radius X
  ry: 10   // Border radius Y
});
canvas.add(rect);
```

### Circle
```typescript
import { Circle } from "fabric";

const circle = new Circle({
  left: 300,
  top: 100,
  radius: 50,
  fill: 'blue',
  stroke: 'black',
  strokeWidth: 5
});
canvas.add(circle);
```

### Text
```typescript
import { Text, IText, Textbox } from "fabric";

// Static Text
const text = new Text("Hello Fabric!", {
  left: 100,
  top: 300,
  fontFamily: 'Arial',
  fontSize: 40,
  fill: '#333'
});

// Editable Text (User can double click to type)
const iText = new IText("Edit me!", { left: 100, top: 400 });

// Textbox (Auto-wraps text based on width)
const textbox = new Textbox("This is a long text that will wrap automatically.", {
  left: 100,
  top: 500,
  width: 200
});

canvas.add(text, iText, textbox);
```

---

## 4. Object Properties & Manipulation

You can update any object after it has been created using the `.set()` method. **Always call `canvas.renderAll()` after updating properties programmatically** to ensure the UI updates.

```typescript
// Changing properties
rect.set({
  fill: 'green',
  scaleX: 2,
  angle: 45, // Rotation in degrees
  opacity: 0.5
});

// Applying changes
canvas.renderAll();

// Center an object on the canvas
canvas.centerObject(rect);

// Select an object programmatically
canvas.setActiveObject(rect);
```

---

## 5. Events & Interactivity

Fabric allows you to listen to mouse, touch, and object-modification events.

### Canvas Events
```typescript
canvas.on('mouse:down', function(options) {
  if (options.target) {
    console.log('Clicked an object:', options.target);
  } else {
    console.log('Clicked empty canvas background');
  }
});

canvas.on('object:modified', function(options) {
  console.log('Object was moved, scaled, or rotated!');
});
```

### Object-Specific Events
```typescript
rect.on('selected', function() {
  console.log('Rectangle was selected!');
});
```

---

## 6. Grouping Objects

You can combine multiple objects into a single group so they move and scale together.

```typescript
import { Group, Rect, Circle } from "fabric";

const r = new Rect({ width: 100, height: 100, fill: 'red' });
const c = new Circle({ radius: 50, fill: 'blue', left: 50, top: 50 });

const myGroup = new Group([r, c], {
  left: 200,
  top: 200,
  angle: 15
});

canvas.add(myGroup);
```

---

## 7. Working with Images

Images load asynchronously, so they utilize modern Promise-based logic or callbacks or `FabricImage`.

### Loading from URL (v6+)
```typescript
import { FabricImage } from "fabric";

FabricImage.fromURL('https://picsum.photos/200/300').then((img) => {
  img.set({
    left: 100,
    top: 100,
    scaleX: 0.5,
    scaleY: 0.5
  });
  canvas.add(img);
});
```

### Image Filters
Fabric supports extensive image filtering (Grayscale, Blur, Sepia, etc.).
```typescript
import { filters } from "fabric";

// Add a grayscale filter
img.filters.push(new filters.Grayscale());

// Apply filters (v6 handles this automatically upon render, but trigger a render)
img.applyFilters();
canvas.renderAll();
```

---

## 8. Serialization (Save & Load)

One of Fabric's most powerful features is the ability to save the canvas state as a JSON object or string, and restore it later.

### Exporting (Saving)
```typescript
// Export to JSON string
const jsonString = JSON.stringify(canvas.toJSON());
console.log(jsonString);

// Export to SVG string
const svgString = canvas.toSVG();

// Export as a base64 image (PNG/JPEG)
const dataURL = canvas.toDataURL({
  format: 'png',
  quality: 1 // 0 to 1
});
```

### Importing (Loading from JSON)
```typescript
// Load canvas from a JSON string representation
canvas.loadFromJSON(jsonString).then(() => {
  // Executed when loading is complete
  canvas.renderAll();
  console.log('Canvas restored successfully!');
});
```

---

## 9. Free Drawing

Fabric acts as a superb drawing board. You can enable free-drawing mode out of the box.

```typescript
// Enable drawing mode
canvas.isDrawingMode = true;

// Customize the drawing brush
import { PencilBrush } from "fabric";

const brush = new PencilBrush(canvas);
brush.color = "red";
brush.width = 10;

canvas.freeDrawingBrush = brush;
```

---

## Summary Best Practices for V6+

1. **Named Imports**: Prefer `import { Canvas, Rect } from 'fabric';` over namespace imports to reduce the final bundle size.
2. **React Defaults**: Always wrap canvas initialization inside a `useEffect` and remember to clean up using `canvas.dispose()` in the unmount return function.
3. **Render Tracking**: Always trigger `canvas.renderAll()` when you dynamically modify attributes of an object (outside of user-drag events).
4. **Immutability**: Fabric works by mutating object states directly. Using it in React requires you to keep React state completely separate from Fabric canvas state to prevent unnecessary re-renders. Use `useRef` to hold the `canvas` instance reference.

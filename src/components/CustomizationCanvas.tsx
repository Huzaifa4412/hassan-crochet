"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import * as fabric from "fabric";

export interface CustomizationCanvasRef {
    addText: (text: string, font: string, color: string) => void;
    addIcon: (url: string) => void;
    download: () => void;
    updateBaseImage: (url: string) => void;
    updateSelectedTextColor: (color: string, font?: string) => void;
    getSelectedObjectType: () => 'text' | 'group' | 'image' | null;
    deleteSelected: () => void;
}

interface CustomFabricObject extends fabric.Object {
    customType?: 'text' | 'icon';
    customName?: string;
}

interface CustomizationCanvasProps {
    initialImage: string;
    onSelectionChange?: (hasSelection: boolean, selectionType: 'text' | 'group' | 'image' | null) => void;
    onObjectRemoved?: (type: 'text' | 'icon', name: string) => void;
}

const CustomizationCanvas = forwardRef<CustomizationCanvasRef, CustomizationCanvasProps>(
    ({ initialImage, onSelectionChange, onObjectRemoved }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const [isCanvasReady, setIsCanvasReady] = useState(false);
        const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
        const onSelectionChangeRef = useRef(onSelectionChange);
        const onObjectRemovedRef = useRef(onObjectRemoved);

        // Keep the refs updated
        useEffect(() => {
            onSelectionChangeRef.current = onSelectionChange;
            onObjectRemovedRef.current = onObjectRemoved;
        }, [onSelectionChange, onObjectRemoved]);

        // Initialize Fabric Canvas
        useEffect(() => {
            if (!canvasRef.current || !containerRef.current) return;

            const container = containerRef.current;
            const width = container.clientWidth;
            const height = container.clientHeight;

            const canvas = new fabric.Canvas(canvasRef.current, {
                width,
                height,
                backgroundColor: undefined,
                preserveObjectStacking: true, // Keep selected objects at their respective stack position
                selection: true,
                // Selection box styling - professional dark blue
                selectionColor: "rgba(29, 78, 216, 0.1)", // Light blue fill for selection box
                selectionBorderColor: "#1d4ed8", // Professional dark blue border
                selectionLineWidth: 2, // Moderate thickness
            });

            // Set default control colors for all objects
            fabric.Object.prototype.set({
                transparentCorners: false,
                cornerColor: "#1d4ed8", // Professional dark blue for corners
                cornerStrokeColor: "#1e40af", // Slightly lighter dark blue for corner borders
                borderColor: "#1d4ed8", // Professional dark blue border
                cornerSize: 12, // Medium corner size
                padding: 6, // Moderate padding
                cornerStrokeWidth: 2, // Medium corner border thickness
                borderDashArray: [5, 5], // Standard dashed pattern
                borderScaleFactor: 1.5, // Medium object border thickness
            });

            // Ensure canvas doesn't overflow container
            if (canvasRef.current) {
                canvasRef.current.style.maxWidth = "100%";
                canvasRef.current.style.maxHeight = "100%";
            }

            fabricCanvasRef.current = canvas;
            requestAnimationFrame(() => setIsCanvasReady(true));

            // Automatically style any object added to the canvas
            canvas.on('object:added', (e: { target: fabric.Object }) => {
                if (e.target) {
                    // Force professional blue border colors on every object
                    e.target.set({
                        borderColor: '#1d4ed8',
                        cornerColor: '#1d4ed8',
                        cornerStrokeColor: '#1e40af',
                        transparentCorners: false,
                        cornerSize: 12,
                        padding: 6,
                        cornerStrokeWidth: 2,
                        borderDashArray: [5, 5],
                        borderScaleFactor: 1.5,
                    });
                }
            });

            // Track selection changes
            const handleSelectionChange = () => {
                const activeObject = canvas.getActiveObject();
                if (!activeObject) {
                    onSelectionChangeRef.current?.(false, null);
                    return;
                }

                // Force professional blue borders on selected object
                activeObject.set({
                    borderColor: '#1d4ed8',
                    cornerColor: '#1d4ed8',
                    cornerStrokeColor: '#1e40af',
                    transparentCorners: false,
                    cornerSize: 12,
                    padding: 6,
                    cornerStrokeWidth: 2,
                    borderDashArray: [5, 5],
                    borderScaleFactor: 1.5,
                });

                // Determine the type of selected object
                let selectionType: 'text' | 'group' | 'image' | null = null;

                if (activeObject.type === 'textbox' || activeObject.type === 'text') {
                    selectionType = 'text';
                } else if (activeObject.type === 'group') {
                    selectionType = 'group';
                } else if (activeObject.type === 'image') {
                    selectionType = 'image';
                }

                onSelectionChangeRef.current?.(true, selectionType);

                // Re-render to apply new border colors
                canvas.requestRenderAll();
            };

            canvas.on('selection:created', handleSelectionChange);
            canvas.on('selection:updated', handleSelectionChange);
            canvas.on('selection:cleared', () => {
                onSelectionChangeRef.current?.(false, null);
            });

            canvas.on('object:removed', (e: { target: CustomFabricObject | any }) => {
                const target = e.target as CustomFabricObject;
                if (target && target.customType && target.customName) {
                    onObjectRemovedRef.current?.(target.customType, target.customName);
                }
            });

            // Cleanup
            return () => {
                canvas.dispose();
                fabricCanvasRef.current = null;
            };
        }, []);

        // Load initial background image
        useEffect(() => {
            const fabricCanvas = fabricCanvasRef.current;
            if (!fabricCanvas || !initialImage) return;

            const loadBaseImage = async () => {
                try {
                    // Clear any existing background
                    if (fabricCanvas.backgroundImage) {
                        fabricCanvas.set({ backgroundImage: undefined });
                    }

                    const img = await fabric.FabricImage.fromURL(initialImage, { crossOrigin: "anonymous" });

                    // Scale to fit canvas, then multiply by 1.0 to fit perfectly
                    const scale = Math.min(
                        fabricCanvas.width! / img.width!,
                        fabricCanvas.height! / img.height!
                    ) * 1.0;

                    img.set({
                        scaleX: scale,
                        scaleY: scale,
                        originX: "center",
                        originY: "center",
                        left: fabricCanvas.width! / 2,
                        top: fabricCanvas.height! / 2,
                    });

                    fabricCanvas.backgroundImage = img;
                    fabricCanvas.requestRenderAll();
                } catch (error) {
                    console.error("Failed to load base image:", error);
                }
            };

            loadBaseImage();
        }, [isCanvasReady, initialImage]);

        // Handle Resize
        useEffect(() => {
            const fabricCanvas = fabricCanvasRef.current;
            if (!fabricCanvas || !containerRef.current) return;

            // Store last dimensions for scaling
            let lastWidth = fabricCanvas.width || 0;
            let lastHeight = fabricCanvas.height || 0;

            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    if (width === 0 || height === 0) continue;

                    const scaleX = width / lastWidth;
                    const scaleY = height / lastHeight;

                    fabricCanvas.setDimensions({ width, height });

                    // Scale all objects proportionally
                    const objects = fabricCanvas.getObjects();
                    objects.forEach(obj => {
                        obj.set({
                            left: (obj.left || 0) * scaleX,
                            top: (obj.top || 0) * scaleY,
                            scaleX: (obj.scaleX || 1) * scaleX,
                            scaleY: (obj.scaleY || 1) * scaleY,
                        });
                        obj.setCoords();
                    });

                    // Re-center background image if it exists
                    if (fabricCanvas.backgroundImage) {
                        const bg = fabricCanvas.backgroundImage as fabric.FabricImage;
                        // Scale to fit canvas, then multiply by 1.0 to fit perfectly
                        const scale = Math.min(width / bg.width!, height / bg.height!) * 1.0;
                        bg.set({
                            scaleX: scale,
                            scaleY: scale,
                            left: width / 2,
                            top: height / 2,
                        });
                    }

                    lastWidth = width;
                    lastHeight = height;
                    fabricCanvas.requestRenderAll();
                }
            });

            resizeObserver.observe(containerRef.current);
            return () => resizeObserver.disconnect();
        }, [isCanvasReady]);

        // Handle drops from outside (e.g. icons list)
        useEffect(() => {
            const fabricCanvas = fabricCanvasRef.current;
            if (!fabricCanvas || !containerRef.current) return;

            const container = containerRef.current;

            const handleDragOver = (e: DragEvent) => {
                e.preventDefault(); // Necessary to allow dropping
            };

            const handleDrop = async (e: DragEvent) => {
                e.preventDefault();
                const url = e.dataTransfer?.getData("text/plain");
                if (!url) return;

                // Calculate drop position relative to canvas
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                try {
                    const img = await fabric.FabricImage.fromURL(url, { crossOrigin: "anonymous" });
                    img.set({
                        left: x,
                        top: y,
                        originX: "center",
                        originY: "center"
                    });
                    img.scaleToWidth(80); // Default icon size

                    // Process image to remove white background
                    const element = img.getElement();
                    if (element && element instanceof HTMLImageElement) {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            canvas.width = element.naturalWidth;
                            canvas.height = element.naturalHeight;
                            ctx.drawImage(element, 0, 0);

                            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const data = imageData.data;

                            for (let i = 0; i < data.length; i += 4) {
                                // Check if pixel is white or near-white
                                const r = data[i];
                                const g = data[i + 1];
                                const b = data[i + 2];

                                // If pixel is white or very light, make it transparent
                                if (r > 230 && g > 230 && b > 230) {
                                    data[i + 3] = 0; // Set alpha to 0 (transparent)
                                }
                            }

                            ctx.putImageData(imageData, 0, 0);
                            img.setElement(canvas as HTMLCanvasElement);
                        }
                    }

                    // Attach metadata for synchronization
                    const filename = url.split('/').pop() || "";
                    const iconName = filename.split('.')[0].replace(/-/g, ' ');
                    (img as CustomFabricObject).customType = 'icon';
                    (img as CustomFabricObject).customName = iconName;

                    fabricCanvas.add(img);
                    fabricCanvas.setActiveObject(img);
                    fabricCanvas.requestRenderAll();
                } catch (error) {
                    console.error("Failed to load dropped image:", error);
                }
            };

            container.addEventListener("dragover", handleDragOver);
            container.addEventListener("drop", handleDrop);

            return () => {
                container.removeEventListener("dragover", handleDragOver);
                container.removeEventListener("drop", handleDrop);
            };
        }, [isCanvasReady]);

        // Expose methods to parent
        useImperativeHandle(ref, () => ({
            addText: (text, font, color) => {
                const fabricCanvas = fabricCanvasRef.current;
                if (!fabricCanvas) return;

                // Color palettes for multicolor options - matching swatch colors from UI
                const colorPalettes: Record<string, string[]> = {
                    rainbow: [
                        "#FF6B6B",    // Pink
                        "#FFD93D",    // Yellow
                        "#6BCB77",    // Green
                        "#4D96FF",    // Blue
                        "#9D4EDD",    // Purple
                    ],
                    blossom: [
                        "#FF69B4",    // Magenta
                        "#FFB6C1",    // Light Pink
                        "#FFF0F5",    // Pale Pink (Lavender Blush)
                    ],
                    cloudy: [
                        "#87CEEB",    // Sky Blue
                        "#B0E0E6",    // Powder Blue
                        "#E6E6FA",    // Lavender
                        "#A9A9A9",    // Gray
                    ],
                    grassland: [
                        "#556B2F",    // Olive Green (Dark Olive Green)
                        "#98FB98",    // Mint Green (Pale Green)
                        "#808080",    // Gray
                    ],
                };

                // Check if color is a palette
                const paletteColors = colorPalettes[color];

                if (paletteColors) {
                    // For multicolor, create grouped text
                    const chars = text.split("");
                    const fontSize = 32;
                    const letterSpacing = 4;

                    // Create text objects for each character
                    const textObjects: fabric.Text[] = [];
                    let currentX = 0;

                    chars.forEach((char, index) => {
                        const colorIndex = index % paletteColors.length;
                        const charColor = paletteColors[colorIndex];

                        const charObj = new fabric.Text(char, {
                            left: currentX,
                            top: 0,
                            fontSize: fontSize,
                            fontFamily: font,
                            fill: charColor,
                            originX: "left",
                            originY: "top",
                        });

                        textObjects.push(charObj);
                        currentX += charObj.width! + letterSpacing;
                    });

                    // Create group from text objects
                    const group = new fabric.Group(textObjects, {
                        left: fabricCanvas.width! / 2,
                        top: fabricCanvas.height! / 2,
                        originX: "center",
                        originY: "center",
                    });

                    // Attach metadata
                    (group as CustomFabricObject).customType = 'text';
                    (group as CustomFabricObject).customName = text;

                    fabricCanvas.add(group);
                    fabricCanvas.setActiveObject(group);
                    fabricCanvas.requestRenderAll();
                } else {
                    // Single color text
                    const textObj = new fabric.Textbox(text, {
                        left: fabricCanvas.width! / 2,
                        top: fabricCanvas.height! / 2,
                        originX: "center",
                        originY: "center",
                        fontSize: 32,
                        fontFamily: font,
                        fill: color,
                        width: 200,
                        textAlign: "center",
                    });
                    // Attach metadata
                    (textObj as CustomFabricObject).customType = 'text';
                    (textObj as CustomFabricObject).customName = text;

                    fabricCanvas.add(textObj);
                    fabricCanvas.setActiveObject(textObj);
                    fabricCanvas.requestRenderAll();
                }
            },
            addIcon: async (url) => {
                const fabricCanvas = fabricCanvasRef.current;
                if (!fabricCanvas) return;
                try {
                    const img = await fabric.FabricImage.fromURL(url, { crossOrigin: "anonymous" });

                    // Remove white background from icon
                    img.set({
                        left: fabricCanvas.width! / 2,
                        top: fabricCanvas.height! / 2,
                        originX: "center",
                        originY: "center",
                    });
                    img.scaleToWidth(80);

                    // Process image to remove white background
                    const element = img.getElement();
                    if (element && element instanceof HTMLImageElement) {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            canvas.width = element.naturalWidth;
                            canvas.height = element.naturalHeight;
                            ctx.drawImage(element, 0, 0);

                            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const data = imageData.data;

                            for (let i = 0; i < data.length; i += 4) {
                                // Check if pixel is white or near-white
                                const r = data[i];
                                const g = data[i + 1];
                                const b = data[i + 2];

                                // If pixel is white or very light, make it transparent
                                if (r > 230 && g > 230 && b > 230) {
                                    data[i + 3] = 0; // Set alpha to 0 (transparent)
                                }
                            }

                            ctx.putImageData(imageData, 0, 0);
                            img.setElement(canvas as HTMLCanvasElement);
                        }
                    }

                    fabricCanvas.add(img);
                    fabricCanvas.setActiveObject(img);

                    // Attach metadata
                    const filename = url.split('/').pop() || "";
                    const iconName = filename.split('.')[0].replace(/-/g, ' ');
                    (img as CustomFabricObject).customType = 'icon';
                    (img as CustomFabricObject).customName = iconName;
                    fabricCanvas.requestRenderAll();
                } catch (error) {
                    console.error("Failed to load icon:", error);
                }
            },
            download: () => {
                const fabricCanvas = fabricCanvasRef.current;
                if (!fabricCanvas) return;
                // Deselect objects to avoid bounding boxes in export
                fabricCanvas.discardActiveObject();
                fabricCanvas.requestRenderAll();

                const dataUrl = fabricCanvas.toDataURL({
                    format: "png",
                    quality: 1,
                    multiplier: 2 // High res export
                });

                const link = document.createElement("a");
                link.download = "customized-tray-table.png";
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            updateBaseImage: async (url) => {
                const fabricCanvas = fabricCanvasRef.current;
                if (!fabricCanvas) return;
                try {
                    const img = await fabric.FabricImage.fromURL(url, { crossOrigin: "anonymous" });
                    // Scale to fit canvas, then multiply by 1.0 to fit perfectly
                    const scale = Math.min(
                        fabricCanvas.width! / img.width!,
                        fabricCanvas.height! / img.height!
                    ) * 1.0;

                    img.set({
                        scaleX: scale,
                        scaleY: scale,
                        originX: "center",
                        originY: "center",
                        left: fabricCanvas.width! / 2,
                        top: fabricCanvas.height! / 2,
                    });

                    fabricCanvas.backgroundImage = img;
                    fabricCanvas.requestRenderAll();
                } catch (error) {
                    console.error("Failed to update base image:", error);
                }
            },
            updateSelectedTextColor: (color, font) => {
                const fabricCanvas = fabricCanvasRef.current;
                if (!fabricCanvas) return;
                const activeObject = fabricCanvas.getActiveObject();
                if (!activeObject) return;

                // Color palettes for multicolor options - matching swatch colors from UI
                const colorPalettes: Record<string, string[]> = {
                    rainbow: [
                        "#FF6B6B",    // Pink
                        "#FFD93D",    // Yellow
                        "#6BCB77",    // Green
                        "#4D96FF",    // Blue
                        "#9D4EDD",    // Purple
                    ],
                    blossom: [
                        "#FF69B4",    // Magenta
                        "#FFB6C1",    // Light Pink
                        "#FFF0F5",    // Pale Pink (Lavender Blush)
                    ],
                    cloudy: [
                        "#87CEEB",    // Sky Blue
                        "#B0E0E6",    // Powder Blue
                        "#E6E6FA",    // Lavender
                        "#A9A9A9",    // Gray
                    ],
                    grassland: [
                        "#556B2F",    // Olive Green (Dark Olive Green)
                        "#98FB98",    // Mint Green (Pale Green)
                        "#808080",    // Gray
                    ],
                };

                // Check if it's a textbox (single text)
                if (activeObject.type === 'textbox' || activeObject.type === 'text') {
                    const paletteColors = colorPalettes[color];

                    if (paletteColors) {
                        // Convert to multicolor group
                        const textObj = activeObject as fabric.Textbox;
                        const text = textObj.text || "";
                        const chars = text.split("");
                        const fontSize = textObj.fontSize || 32;
                        const currentFont = font || textObj.fontFamily || "sans-serif";
                        const letterSpacing = 4;

                        // Create text objects for each character
                        const textObjects: fabric.Text[] = [];
                        let currentX = 0;

                        chars.forEach((char, index) => {
                            const colorIndex = index % paletteColors.length;
                            const charColor = paletteColors[colorIndex];

                            const charObj = new fabric.Text(char, {
                                left: currentX,
                                top: 0,
                                fontSize: fontSize,
                                fontFamily: currentFont,
                                fill: charColor,
                                originX: "left",
                                originY: "top",
                            });

                            textObjects.push(charObj);
                            currentX += charObj.width! + letterSpacing;
                        });

                        // Create group from text objects
                        const group = new fabric.Group(textObjects, {
                            left: activeObject.left,
                            top: activeObject.top,
                            originX: activeObject.originX,
                            originY: activeObject.originY,
                            angle: activeObject.angle,
                            scaleX: activeObject.scaleX,
                            scaleY: activeObject.scaleY,
                        });

                        // Replace the textbox with the group
                        fabricCanvas.remove(activeObject);
                        fabricCanvas.add(group);
                        fabricCanvas.setActiveObject(group);
                    } else {
                        // Just update color for single color
                        activeObject.set('fill', color);
                        if (font) {
                            activeObject.set('fontFamily', font);
                        }
                    }
                }
                // Check if it's a group (multicolor text)
                else if (activeObject.type === 'group') {
                    const group = activeObject as fabric.Group;
                    const paletteColors = colorPalettes[color];

                    if (paletteColors) {
                        // Update the multicolor group
                        const objects = group.getObjects();
                        objects.forEach((obj, index) => {
                            if (obj.type === 'text') {
                                const textObj = obj as fabric.Text;
                                const colorIndex = index % paletteColors.length;
                                textObj.set('fill', paletteColors[colorIndex]);
                                if (font) {
                                    textObj.set('fontFamily', font);
                                }
                            }
                        });
                    } else {
                        // Convert back to single color textbox
                        const objects = group.getObjects();
                        let text = "";
                        objects.forEach((obj) => {
                            if (obj.type === 'text') {
                                text += (obj as fabric.Text).text;
                            }
                        });

                        // Create new textbox
                        const firstObj = objects[0] as fabric.Text;
                        const textObj = new fabric.Textbox(text, {
                            left: group.left,
                            top: group.top,
                            originX: group.originX,
                            originY: group.originY,
                            angle: group.angle,
                            fontSize: firstObj.fontSize || 32,
                            fontFamily: font || firstObj.fontFamily || "sans-serif",
                            fill: color,
                            width: 200,
                            textAlign: "center",
                        });

                        // Replace the group with the textbox
                        fabricCanvas.remove(group);
                        fabricCanvas.add(textObj);
                        fabricCanvas.setActiveObject(textObj);
                    }
                }

                fabricCanvas.requestRenderAll();
            },
            getSelectedObjectType: () => {
                const fabricCanvas = fabricCanvasRef.current;
                if (!fabricCanvas) return null;
                const activeObject = fabricCanvas.getActiveObject();
                if (!activeObject) return null;

                if (activeObject.type === 'textbox' || activeObject.type === 'text') {
                    return 'text';
                } else if (activeObject.type === 'group') {
                    return 'group';
                } else if (activeObject.type === 'image') {
                    return 'image';
                }
                return null;
            },
            deleteSelected: () => {
                const fabricCanvas = fabricCanvasRef.current;
                if (!fabricCanvas) return;
                
                const activeObjects = fabricCanvas.getActiveObjects();
                if (activeObjects.length > 0) {
                    activeObjects.forEach(obj => fabricCanvas.remove(obj));
                    fabricCanvas.discardActiveObject();
                    fabricCanvas.requestRenderAll();
                }
            }
        }));

        return (
            <div
                ref={containerRef}
                className="w-full h-full relative overflow-hidden"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
            >
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ maxWidth: "100%", maxHeight: "100%", display: "block" }}
                />
            </div>
        );
    }
);

CustomizationCanvas.displayName = "CustomizationCanvas";

export default CustomizationCanvas;

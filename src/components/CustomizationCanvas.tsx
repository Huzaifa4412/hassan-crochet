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
}

interface CustomizationCanvasProps {
    initialImage: string;
    onSelectionChange?: (hasSelection: boolean, selectionType: 'text' | 'group' | 'image' | null) => void;
}

// SVG Trash icon encoded as data URL for the delete control - Red version
const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

const CustomizationCanvas = forwardRef<CustomizationCanvasRef, CustomizationCanvasProps>(
    ({ initialImage, onSelectionChange }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
        const onSelectionChangeRef = useRef(onSelectionChange);

        // Keep the ref updated
        useEffect(() => {
            onSelectionChangeRef.current = onSelectionChange;
        }, [onSelectionChange]);

        // Initialize Fabric Canvas
        useEffect(() => {
            if (!canvasRef.current || !containerRef.current) return;

            const container = containerRef.current;
            const width = container.clientWidth;
            const height = container.clientHeight;

            // Custom control colors - professional dark blue for visibility
            const selectionColor = "#1d4ed8"; // Nice dark blue (blue-700)
            const cornerStrokeColor = "#1e40af"; // Slightly lighter dark blue (blue-800)
            const cornerColor = "#ffffff"; // White fill for corners
            const borderColor = "#1d4ed8"; // Professional dark blue border

            const canvas = new fabric.Canvas(canvasRef.current, {
                width,
                height,
                backgroundColor: "#f3f4f6",
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

            setFabricCanvas(canvas);

            // Create Delete Control globally for objects
            const img = document.createElement("img");
            img.src = deleteIcon;

            const renderIcon = function (
                this: fabric.Control,
                ctx: CanvasRenderingContext2D,
                left: number,
                top: number,
                styleOverride: any,
                fabricObject: fabric.Object
            ) {
                const size = 24;
                ctx.save();
                ctx.translate(left, top);
                ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle || 0));
                ctx.drawImage(img, -size / 2, -size / 2, size, size);
                ctx.restore();
            };

            const deleteObject = function (eventData: any, transform: fabric.Transform) {
                const target = transform.target;
                const canvas = target.canvas;
                if (canvas) {
                    canvas.remove(target);
                    canvas.requestRenderAll();
                }
                return true;
            };

            const customDeleteControl = new fabric.Control({
                x: 0.5,
                y: -0.5,
                offsetY: 16,
                cursorStyle: 'pointer',
                mouseUpHandler: deleteObject,
                render: renderIcon
            });

            // Automatically add the delete control to any object added to the canvas
            canvas.on('object:added', (e: any) => {
                if (e.target) {
                    if (!e.target.controls) {
                        e.target.controls = {};
                    }
                    e.target.controls.deleteControl = customDeleteControl;

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

            // Cleanup
            return () => {
                canvas.dispose();
            };
        }, []);

        // Load initial background image
        useEffect(() => {
            if (!fabricCanvas || !initialImage) return;

            const loadBaseImage = async () => {
                try {
                    // Clear any existing background
                    if (fabricCanvas.backgroundImage) {
                        fabricCanvas.backgroundImage = undefined;
                    }

                    const img = await fabric.FabricImage.fromURL(initialImage, { crossOrigin: "anonymous" });

                    // Scale to fit canvas, then multiply by 1.4 to make it bigger
                    const scale = Math.min(
                        fabricCanvas.width! / img.width!,
                        fabricCanvas.height! / img.height!
                    ) * 1.4;

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
        }, [fabricCanvas, initialImage]);

        // Handle Resize
        useEffect(() => {
            if (!fabricCanvas || !containerRef.current) return;

            const resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    const { width, height } = entry.contentRect;
                    fabricCanvas.setDimensions({ width, height });

                    // Re-center background image if it exists
                    if (fabricCanvas.backgroundImage) {
                        const bg = fabricCanvas.backgroundImage as fabric.FabricImage;
                        // Scale to fit canvas, then multiply by 1.4 to make it bigger
                        const scale = Math.min(width / bg.width!, height / bg.height!) * 1.4;
                        bg.set({
                            scaleX: scale,
                            scaleY: scale,
                            left: width / 2,
                            top: height / 2,
                        });
                    }
                    fabricCanvas.requestRenderAll();
                }
            });

            resizeObserver.observe(containerRef.current);
            return () => resizeObserver.disconnect();
        }, [fabricCanvas]);

        // Handle drops from outside (e.g. icons list)
        useEffect(() => {
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
        }, [fabricCanvas]);

        // Expose methods to parent
        useImperativeHandle(ref, () => ({
            addText: (text, font, color) => {
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
                    fabricCanvas.add(textObj);
                    fabricCanvas.setActiveObject(textObj);
                    fabricCanvas.requestRenderAll();
                }
            },
            addIcon: async (url) => {
                if (!fabricCanvas) return;
                try {
                    const img = await fabric.FabricImage.fromURL(url, { crossOrigin: "anonymous" });
                    img.set({
                        left: fabricCanvas.width! / 2,
                        top: fabricCanvas.height! / 2,
                        originX: "center",
                        originY: "center",
                    });
                    img.scaleToWidth(80);
                    fabricCanvas.add(img);
                    fabricCanvas.setActiveObject(img);
                    fabricCanvas.requestRenderAll();
                } catch (error) {
                    console.error("Failed to load icon:", error);
                }
            },
            download: () => {
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
                if (!fabricCanvas) return;
                try {
                    const img = await fabric.FabricImage.fromURL(url, { crossOrigin: "anonymous" });
                    // Scale to fit canvas, then multiply by 1.4 to make it bigger
                    const scale = Math.min(
                        fabricCanvas.width! / img.width!,
                        fabricCanvas.height! / img.height!
                    ) * 1.4;

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
                        objects.forEach((obj: any, index) => {
                            if (obj.type === 'text') {
                                const colorIndex = index % paletteColors.length;
                                obj.set('fill', paletteColors[colorIndex]);
                                if (font) {
                                    obj.set('fontFamily', font);
                                }
                            }
                        });
                    } else {
                        // Convert back to single color textbox
                        const objects = group.getObjects();
                        let text = "";
                        objects.forEach((obj: any) => {
                            if (obj.type === 'text') {
                                text += obj.text;
                            }
                        });

                        // Create new textbox
                        const firstObj = objects[0] as any;
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

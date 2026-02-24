import { defineField, defineType } from 'sanity'

export default defineType({
    name: "banner",
    title: "Banner",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Banner Title (Internal)",
            type: "string",
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: "type",
            title: "Banner Type",
            type: "string",
            initialValue: "hero",
            options: {
                list: [
                    { title: "Hero (Full width)", value: "hero" },
                    { title: "Announcement Bar (Top strip)", value: "announcement" },
                    { title: "Promo Banner (Mid-page)", value: "promo" },
                    { title: "Category Banner", value: "category" },
                ]
            },
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: "headline",
            title: "Headline",
            type: "string",
            description: "Main heading text"
        }),
        defineField({
            name: "subheadline",
            title: "Subheadline",
            type: "text"
        }),
        defineField({
            name: "image",
            title: "Banner Image",
            type: "image",
            options: { hotspot: true }
        }),
        defineField({
            name: "imagePosition",
            title: "Image Position",
            type: "string",
            initialValue: "center",
            options: {
                list: [
                    { title: "Center", value: "center" },
                    { title: "Top", value: "top" },
                    { title: "Bottom", value: "bottom" },
                    { title: "Left", value: "left" },
                    { title: "Right", value: "right" }
                ]
            }
        }),
        defineField({
            name: "ctaText",
            title: "CTA Button Text",
            type: "string"
        }),
        defineField({
            name: "ctaLink",
            title: "CTA Link",
            type: "string"
        }),
        defineField({
            name: "ctaStyle",
            title: "CTA Style",
            type: "string",
            initialValue: "primary",
            options: {
                list: [
                    { title: "Primary (Orange gradient)", value: "primary" },
                    { title: "Secondary (Outline)", value: "secondary" },
                    { title: "Ghost", value: "ghost" },
                ]
            }
        }),
        defineField({
            name: "backgroundColor",
            title: "Background Color",
            type: "string",
            initialValue: "background",
            options: {
                list: [
                    { title: "Default (Background)", value: "background" },
                    { title: "Light Gray", value: "muted" },
                    { title: "Orange (Light)", value: "orange-light" },
                    { title: "Pink (Light)", value: "pink-light" },
                    { title: "Custom Color", value: "custom" }
                ]
            }
        }),
        defineField({
            name: "customBackgroundColor",
            title: "Custom Background Color",
            type: "string",
            description: "Hex color code (e.g., #FFE4E1)",
            hidden: ({ parent }) => parent?.backgroundColor !== "custom"
        }),
        defineField({
            name: "textColor",
            title: "Text Color",
            type: "string",
            initialValue: "foreground",
            options: {
                list: [
                    { title: "Default (Foreground)", value: "foreground" },
                    { title: "White", value: "white" },
                    { title: "Black", value: "black" },
                    { title: "Orange", value: "orange" },
                    { title: "Custom Color", value: "custom" }
                ]
            }
        }),
        defineField({
            name: "customTextColor",
            title: "Custom Text Color",
            type: "string",
            description: "Hex color code (e.g., #FF6B35)",
            hidden: ({ parent }) => parent?.textColor !== "custom"
        }),
        defineField({
            name: "isActive",
            title: "Active",
            type: "boolean",
            initialValue: true
        }),
        defineField({
            name: "startDate",
            title: "Start Date",
            type: "datetime"
        }),
        defineField({
            name: "endDate",
            title: "End Date",
            type: "datetime"
        }),
        defineField({
            name: "sortOrder",
            title: "Sort Order",
            type: "number",
            initialValue: 0
        })
    ],

    preview: {
        select: {
            title: "title",
            subtitle: "type",
            media: "image"
        }
    }
})

import { defineField, defineType } from 'sanity'

export default defineType({
    name: "product",
    title: "Product",
    type: "document",
    fields: [
        // Basic Info
        defineField({
            name: "title",
            title: "Product Title",
            type: "string",
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name:"mainImage",
            title:"Product Image",
            type:"image",
            options: { hotspot: true },
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (Rule) => Rule.required()
        }),

        // Category & Collection References
        defineField({
            name: "category",
            title: "Category",
            type: "reference",
            to: [{ type: "category" }]
        }),

        // Description
        defineField({
            name: "description",
            title: "Description",
            type: "text"
        }),
        defineField({
            name: "shortDescription",
            title: "Short Description",
            type: "text",
            description: "Brief description for product cards",
            rows: 2
        }),

        // Etsy Website Link
        defineField({
            name: "etsyLink",
            title: "Etsy Link",
            type: 'url',
            validation: (Rule) => Rule.required()
        }),

        // Color Variants (for your canvas + color switcher)
        defineField({
            name: "variants",
            title: "Color Variants",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "colorName",
                            title: "Color Name",
                            type: "string",
                            validation: (Rule) => Rule.required()
                        },
                        {
                            name: "image",
                            title: "Product Image",
                            type: "image",
                            options: { hotspot: true },
                            validation: (Rule) => Rule.required()
                        },
                        {
                            name: "sortOrder",
                            title: "Sort Order",
                            type: "number",
                            initialValue: 0
                        }
                    ]
                }
            ]
        }),

        // Badges (Studio Edition, Aesthetics etc.)
        defineField({
            name: "badges",
            title: "Product Badges",
            type: "array",
            of: [{ type: "string" }],
            options: {
                list: [
                    { title: "New", value: "New" },
                    { title: "Bestseller", value: "Bestseller" },
                    { title: "Limited Edition", value: "Limited Edition" },
                    { title: "Popular", value: "Popular" },
                    { title: "Handmade", value: "Handmade" },
                    { title: "Sale", value: "Sale" },
                    { title: "Customizable", value: "Customizable" },
                ]
            }
        }),

        // Stock
        defineField({
            name: "inStock",
            title: "In Stock",
            type: "boolean",
            initialValue: true
        }),

        // Featured toggle
        defineField({
            name: "featured",
            title: "Featured Product",
            type: "boolean",
            initialValue: false
        }),

        // New Product toggle
        defineField({
            name: "isNew",
            title: "New Product",
            type: "boolean",
            initialValue: false,
            description: "Mark as new arrival"
        }),

        // Optional: Sale Countdown Support
        defineField({
            name: "saleEndDate",
            title: "Sale End Date",
            type: "datetime"
        })
    ],

    preview: {
        select: {
            title: "title",
            media: "mainImage",
            subtitle: "category.title"
        }
    }
})

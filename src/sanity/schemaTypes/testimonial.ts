import { defineField, defineType } from 'sanity'

export default defineType({
    name: "testimonial",
    title: "Testimonial",
    type: "document",
    fields: [
        defineField({
            name: "customerName",
            title: "Customer Name",
            type: "string",
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: "customerImage",
            title: "Customer Image",
            type: "image",
            options: { hotspot: true }
        }),
        defineField({
            name: "rating",
            title: "Rating",
            type: "number",
            initialValue: 5,
            validation: (Rule) => Rule.required().min(1).max(5),
            description: "1-5 stars"
        }),
        defineField({
            name: "review",
            title: "Review Text",
            type: "text",
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: "product",
            title: "Related Product",
            type: "reference",
            to: [{ type: "product" }]
        }),
        defineField({
            name: "reviewDate",
            title: "Review Date",
            type: "datetime",
            initialValue: () => new Date().toISOString()
        }),
        defineField({
            name: "images",
            title: "Review Images",
            type: "array",
            of: [
                {
                    type: "image",
                    options: { hotspot: true }
                }
            ],
            description: "Customer photos of the product"
        }),
        defineField({
            name: "isVerified",
            title: "Verified Purchase",
            type: "boolean",
            initialValue: true
        }),
        defineField({
            name: "isFeatured",
            title: "Featured Testimonial",
            type: "boolean",
            initialValue: false,
            description: "Show prominently on the website"
        }),
        defineField({
            name: "isActive",
            title: "Active",
            type: "boolean",
            initialValue: true
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
            title: "customerName",
            subtitle: "rating",
            media: "customerImage"
        },
        prepare({ title, subtitle, media }) {
            return {
                title,
                subtitle: `${"★".repeat(subtitle || 5)}${"☆".repeat(5 - (subtitle || 5))}`,
                media
            }
        }
    }
})

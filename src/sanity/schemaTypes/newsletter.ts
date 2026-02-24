import { defineField, defineType } from 'sanity'

export default defineType({
    name: "newsletter",
    title: "Newsletter",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Newsletter Section Title (Internal)",
            type: "string",
            initialValue: "Newsletter Signup"
        }),
        defineField({
            name: "headline",
            title: "Headline",
            type: "string",
            initialValue: "Join Our Community",
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            initialValue: "Subscribe for exclusive offers, new product updates, and crochet tips!"
        }),
        defineField({
            name: "discountOffer",
            title: "Discount Offer",
            type: "string",
            description: "e.g., 'Get 10% off your first order'",
            initialValue: "Get 10% off your first order!"
        }),
        defineField({
            name: "placeholderText",
            title: "Input Placeholder",
            type: "string",
            initialValue: "Enter your email address"
        }),
        defineField({
            name: "buttonText",
            title: "Button Text",
            type: "string",
            initialValue: "Subscribe"
        }),
        defineField({
            name: "successMessage",
            title: "Success Message",
            type: "text",
            initialValue: "Thank you for subscribing! Check your email for your discount code."
        }),
        defineField({
            name: "image",
            title: "Background Image",
            type: "image",
            options: { hotspot: true }
        }),
        defineField({
            name: "backgroundColor",
            title: "Background Color",
            type: "string",
            initialValue: "orange-gradient",
            options: {
                list: [
                    { title: "Orange Gradient", value: "orange-gradient" },
                    { title: "Pink Gradient", value: "pink-gradient" },
                    { title: "Light Gray", value: "muted" },
                    { title: "Image Only", value: "image" },
                ]
            }
        }),
        defineField({
            name: "isActive",
            title: "Active",
            type: "boolean",
            initialValue: true
        }),
        defineField({
            name: "showOnHomepage",
            title: "Show on Homepage",
            type: "boolean",
            initialValue: true
        })
    ],

    preview: {
        select: {
            title: "headline",
            subtitle: "discountOffer"
        }
    }
})

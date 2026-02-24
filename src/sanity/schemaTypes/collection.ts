import { defineField, defineType } from 'sanity'

export default defineType({
    name: "collection",
    title: "Collection",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Collection Title",
            type: "string",
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
        defineField({
            name: "description",
            title: "Description",
            type: "text"
        }),
        defineField({
            name: "image",
            title: "Collection Image",
            type: "image",
            options: { hotspot: true },
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: "badge",
            title: "Badge",
            type: "string",
            description: "e.g., New Arrivals, Best Sellers, Limited Edition"
        }),
        defineField({
            name: "badgeColor",
            title: "Badge Color",
            type: "string",
            initialValue: "orange",
            options: {
                list: [
                    { title: "Orange", value: "orange" },
                    { title: "Pink", value: "pink" },
                    { title: "Blue", value: "blue" },
                    { title: "Green", value: "green" },
                    { title: "Purple", value: "purple" },
                    { title: "Red", value: "red" },
                ]
            }
        }),
        defineField({
            name: "products",
            title: "Products",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [{ type: "product" }]
                }
            ]
        }),
        defineField({
            name: "sortOrder",
            title: "Sort Order",
            type: "number",
            initialValue: 0,
            description: "Lower numbers appear first"
        }),
        defineField({
            name: "isActive",
            title: "Active",
            type: "boolean",
            initialValue: true
        })
    ],

    preview: {
        select: {
            title: "title",
            media: "image"
        }
    }
})

import { defineField, defineType } from 'sanity'

export default defineType({
    name: "category",
    title: "Category",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Category Title",
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
            name: "icon",
            title: "Icon",
            type: "string",
            description: "Lucide icon name (e.g., home, flower, shopping-bag)"
        }),
        defineField({
            name: "image",
            title: "Category Image",
            type: "image",
            options: { hotspot: true }
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
            initialValue: true,
            description: "Show/hide this category on the website"
        })
    ],

    preview: {
        select: {
            title: "title",
            media: "image"
        }
    }
})

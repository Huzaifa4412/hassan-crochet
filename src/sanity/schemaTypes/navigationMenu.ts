import { defineField, defineType } from 'sanity'

export default defineType({
    name: "navigationMenu",
    title: "Navigation Menu",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Menu Title (Internal)",
            type: "string",
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: "menuType",
            title: "Menu Type",
            type: "string",
            initialValue: "main",
            options: {
                list: [
                    { title: "Main Navigation", value: "main" },
                    { title: "Footer Navigation", value: "footer" },
                    { title: "Mobile Navigation", value: "mobile" },
                ]
            }
        }),
        defineField({
            name: "menuItems",
            title: "Menu Items",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "label",
                            title: "Label",
                            type: "string",
                            validation: (Rule) => Rule.required()
                        },
                        {
                            name: "link",
                            title: "Link",
                            type: "string",
                            description: "Internal path (e.g., /products) or external URL"
                        },
                        {
                            name: "openInNewTab",
                            title: "Open in New Tab",
                            type: "boolean",
                            initialValue: false
                        },
                        {
                            name: "icon",
                            title: "Icon",
                            type: "string",
                            description: "Lucide icon name (e.g., home, heart, shopping-bag)"
                        },
                        {
                            name: "isDropdown",
                            title: "Is Dropdown",
                            type: "boolean",
                            initialValue: false
                        },
                        {
                            name: "dropdownItems",
                            title: "Dropdown Items",
                            type: "array",
                            of: [
                                {
                                    type: "object",
                                    fields: [
                                        {
                                            name: "label",
                                            title: "Label",
                                            type: "string"
                                        },
                                        {
                                            name: "link",
                                            title: "Link",
                                            type: "string"
                                        },
                                        {
                                            name: "description",
                                            title: "Description",
                                            type: "text"
                                        },
                                        {
                                            name: "image",
                                            title: "Image",
                                            type: "image",
                                            options: { hotspot: true }
                                        },
                                        {
                                            name: "isFeatured",
                                            title: "Featured Item",
                                            type: "boolean",
                                            initialValue: false
                                        }
                                    ]
                                }
                            ],
                            hidden: ({ parent }) => !parent?.isDropdown
                        },
                        {
                            name: "category",
                            title: "Link to Category",
                            type: "reference",
                            to: [{ type: "category" }],
                            description: "Automatically populate from category"
                        },
                        {
                            name: "collection",
                            title: "Link to Collection",
                            type: "reference",
                            to: [{ type: "collection" }],
                            description: "Automatically populate from collection"
                        }
                    ]
                }
            ]
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
            subtitle: "menuType"
        }
    }
})

import { CONTENT_TYPES } from "@/utils/constants";

export default {
  name: "Enroute",
  slug: "Enroute",
  roles: ["Исследование", "Визуальная идентификация", "Гайдлайн"],
  year: 24,
  number: 8,
  content: [
    {
      type: CONTENT_TYPES.paragraph,
      text: `
        -
      `,
    },
    {
      type: CONTENT_TYPES.extraParagraph,
      text: `
        -
      `,
    },
  ],
  images: [
    "/8.2.jpg",
  ],
  media: [
    { type: "img", src: "/8.webp" }, 
  ]
};

import { CONTENT_TYPES } from "@/utils/constants";

export default {
  name: "Artiqua",
  slug: "Artiqua",
  roles: ["Исследование", "Визуальная идентификация", "Гайдлайн"],
  year: 25,
  number: 9,
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
        A closed club for experienced investors, providing personal solutions with maximum benefit in all market situations.
      `,
    },
  ],
  images: [
    "/9.1.png",
  ],
  media: [
    { type: "img", src: "/9.0.png" }, 
  ]
};

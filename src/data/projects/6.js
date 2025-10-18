import { CONTENT_TYPES } from "@/utils/constants";

export default {
  name: "Xellon",
  slug: "xellon",
  roles: ["Дизайн", "Визуальная идентификация", "Гайдлайн"],
  year: 28,
  number: 6,
  content: [
    {
      type: CONTENT_TYPES.paragraph,
      text: `
        In 2020 we were approached by a founder of uprising hedge fund to help him develop branding. The client's main request was to create a trusted image for the fund with deep expertise.
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
    "https://player.vimeo.com/1020314626",
  ],
  media: [
    { type: "img", src: "/6.webp" }, 
  ]
};

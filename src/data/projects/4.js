import { CONTENT_TYPES } from "@/utils/constants";

export default {
  name: "ICE",
  slug: "ice",
  roles: ["Визуальная идентификация", "Анимация", "Гайдлайн"],
  year: 22,
  number: 4,
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
    "/4.1.mp4",
    "/4.2.webp",
    "/4.3.webp",
    "/4.4.webp",
    "/4.5.webp",
    "/4.6.mp4",
    "/4.7.webp",
    "/4.8.webp",
    "/4.9.webp",
    "/4.10.webp",
    "/4.11.webp",
    "/4.12.webp",
    "/4.13.webp",
  ],
  media: [
    { type: "img", src: "/4.webp" }, 
  ]
};

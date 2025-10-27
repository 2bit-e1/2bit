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
    "/3.2.mp4",
    "/3.3.mp4",
    "/3.4.webp",
    "/3.5.webp",
    "/3.6.png",
    "/3.7.mp4",
    "/3.8.webp",
    "/3.9.mp4",
    "/3.10.webp",
    "/3.11.webp",
  ],
  media: [
    { type: "img", src: "/4.webp" }, 
  ]
};

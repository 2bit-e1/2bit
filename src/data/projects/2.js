import { CONTENT_TYPES } from "@/utils/constants";


export default {
  name: "Mad beer",
  slug: "mad-beer",
  roles: ["Исследование", "Визуальная идентификация", "Анимация"],
  year: 21,
  number: 2,
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
    "/2.1.mp4",
    "/2.2.jpg",
    "/2.3.jpg",
    "/2.4.jpg",
    "/2.5.jpg",
    "/2.6.mp4",
    "/2.7.jpg",
    "/2.8.webp",
    "/2.9.jpg.webp",
    "/2.10.webp",
    "/2.11.mp4",
    "/2.12.webp",
    "/2.13.webp",
    "/2.14.webp",
  ],
  media: [
    { type: "img", src: "/2.jpg" },  
  ]
  
};

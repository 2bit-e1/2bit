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
    "/3.1.webp",
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
    "/3.12.png",
    "/3.13.webp",
    "/3.14.webp",
    "/3.15.webp",
    "/3.16.mp4",
    "/3.17.jpg",
    "/3.18.mp4",
    "/3.19.mp4",
    "/3.20.png",
    "/3.21.jpg",
    "/3.22.jpg",
    "/3.23.mp4",
    "/3.24.png",
    "/3.25.mp4",
  ],
  media: [
    { type: "img", src: "/2.jpg" },  
  ]
  
};

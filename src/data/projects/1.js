import { CONTENT_TYPES } from "@/utils/constants";

export default {
  name: "Refmodel",
  slug: "refmodel",
  roles: ["Веб", "Анимация", "3D"],
  year: 28,
  number: 1,
  link: "https://www.youtube.com/",
  content: [
    {
      type: CONTENT_TYPES.paragraph,
      text: `
        In 2021 we were approached by a founder of uprising hedge fund to help him develop branding. The client's main request was to create a trusted image for the fund with deep expertise.
      `,
    },
    {
      type: CONTENT_TYPES.extraParagraph,
      text: `
        A closed club for experienced investors,  A closed club for experienced investors providing personal solutions with maximum benefit in all market situations.
      `,
    },
  ],
  images: [
    "https://plus.unsplash.com/premium_photo-1673597080829-89755cc852d4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGlmZmVyZW50JTIwc2l6ZXN8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1516981879613-9f5da904015f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZGlmZmVyZW50JTIwc2l6ZXN8ZW58MHx8MHx8fDA%3D"
  ],
  media: [
    { type: "video", src: "/1.mp4" }, 
  ]
};

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
    
    "https://kinescope.io/embed/xfiUFyVMNiH34SjjBgiLau", // пример Vimeo
  ],
  media: [
    { type: "video", src: "/1.mp4" }, 
  ]
};

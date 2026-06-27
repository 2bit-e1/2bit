import { CONTENT_TYPES } from "@/utils/constants";

export default {
  name: "Gitlife",
  slug: "gitlife",
  roles: ["3D", "Визуальная идентификация", "Веб", "Анимация"],
  year: 24,
  number: 7,
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
    "/7.1.mp4",
  ],
  media: [
    { type: "video", src: "/7.mp4" }, 
  ]
};

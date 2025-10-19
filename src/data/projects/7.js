import { CONTENT_TYPES } from "@/utils/constants";

export default {
  name: "Gitlife",
  slug: "gitlife",
  roles: ["Дизайн", "Визуальная идентификация", "Гайдлайн"],
  year: 29,
  number: 7,
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
    "/3.1.webp",
  ],
  media: [
    { type: "video", src: "/7.mp4" }, 
  ]
};

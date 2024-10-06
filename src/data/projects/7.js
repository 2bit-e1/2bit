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
    "https://images.unsplash.com/photo-1604247416063-e0e6aaf47b0b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlmZmVyZW50JTIwc2l6ZXN8ZW58MHx8MHx8fDA%3D",
    "https://plus.unsplash.com/premium_photo-1673597080829-89755cc852d4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGlmZmVyZW50JTIwc2l6ZXN8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1516981879613-9f5da904015f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZGlmZmVyZW50JTIwc2l6ZXN8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1604247416063-e0e6aaf47b0b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlmZmVyZW50JTIwc2l6ZXN8ZW58MHx8MHx8fDA%3D",
  ]
};

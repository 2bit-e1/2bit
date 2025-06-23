import { CONTENT_TYPES } from "@/utils/constants";

export default {
  name: "Sasha Slepchuk",
  slug: "sasha-slepchuk",
  roles: ["Дизайн", "Визуальная идентификация", "Гайдлайн"],
  year: 27,
  number: 5,
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
    "https://disk.yandex.ru/i/U1mPVjOeEsAtrQ",
    "https://disk.yandex.ru/i/zu0TK4bQYN247w",
    "https://disk.yandex.ru/i/x4CJ2j_KE763lQ",
    "https://disk.yandex.ru/i/eZqDzsEp-wTXBg",
    "https://disk.yandex.ru/i/EEcyDRrIwvbhDQ",
    "https://disk.yandex.ru/i/KkM1Pd64-UY-Gg",

  ],
  media: [
    { type: "img", src: "/5.webp" }, 
  ]
};

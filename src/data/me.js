import { CONTENT_TYPES } from "@/utils/constants";

export default {
  footerData: {
    contacts: [
      {
        link: "mailto:hello@madboot.co",
        text: "hello@madboot.co",
      },
      {
        link: "/",
        text: "Instagram",
      },
      {
        link: "/",
        text: "Telegram",
      },
    ],
    press: [
      {
        link: "/",
        text: "C-news",
      },
      {
        link: "/",
        text: "Sostav",
      },
    ],
    services: [
      "Исследование",
      "Визуальная идентификация",
      "Web",
      "Гайдлайн",
      "Артдирекшн",
      "Анимация",
      "3D",
    ],
  },
  content: [
    {
      type: CONTENT_TYPES.image,
      link: "/images/image.png",
    },
    {
      type: CONTENT_TYPES.paragraph,
      text: `
        is a design studio centered on new ideas and defining experiences, partnering with our generation’s leading brands and innovators to influence culture. Our approach challenges industry standards, adopts new technologies, and has a lasting positive impact on ourselves and others. Over time, the work has naturally led us toward industry leaders across Art, Architecture, Fashion, Sustainability, Technology, and beyond.
      `,
    },
    {
      type: CONTENT_TYPES.extraParagraph,
      text: `
        A closed club for experienced investors, providing personal solutions with maximum benefit in all market situations.
      `,
    },
  ],
};

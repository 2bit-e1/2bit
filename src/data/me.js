import { CONTENT_TYPES } from "@/utils/constants";

export default {
  footerData: {
    contacts: [
      {
        link: "mailto:kakpechorin666@gmail.com",
        text: "2bit.works",
      },
      {
        link: "https://www.instagram.com/stone_and_echo/?hl=ru",
        text: "Instagram",
      },
      {
        link: "https://t.me/Stoneandecho",
        text: "Telegram",
      },
    ],
    press: [
      {
        link: "/",
        text: "/",
      },
      {
        link: "/",
        text: "/",
      },
    ],
    services: [
      "Исследование",
      "Визуальная идентификация",
      "Веб",
      "Гайдлайн",
      "Анимация",
      "3D",
    ],
  },
  content: [
    {
      type: CONTENT_TYPES.iframe,
      link: "https://kinescope.io/embed/xfiUFyVMNiH34SjjBgiLau", //3.1.webp / 3.2.mp4
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

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
      link: "bio.jpg"
    },
    {
      type: CONTENT_TYPES.paragraph,
      text: `
        Концептуальный дизайнер, работающий на стыке стратегии, визуальных исследований и арт-дирекшна.
Проектирую консистентные визуальные системы — от исследовательского и стратегического этапа до перевода смыслов в визуальную метафору, айдентику и digital-среду. Работаю с задачами высокой сложности, где важно превратить сложную логику в ясный, масштабируемый и управляемый визуальный язык.
      `,
    },
    {
      type: CONTENT_TYPES.extraParagraph,
      text: `
        Оригинальное видение помогает выходить за границы категорий и формировать дифференциирующий образ бренда: более выразительный, осмысленый и вдохновляющий.
      `,
    },
  ],
};

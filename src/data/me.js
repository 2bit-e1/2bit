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
        Концептуальный дизайнер. Создаю уникальные образы и ощущения. 
Уникальное видение помогает выходить за границы категорий и формировать дифференциирующий образ бренда: более выразительный, осмысленый и вдохновляющий.
      `,
    },
    {
      type: CONTENT_TYPES.extraParagraph,
      text: `
        Каждый проект начинается как открытое исследование и развивается через процесс,формуриующий новую реальность бренда. 
Такой подход привел к сотрудничеству с представителями индустрии — с теми, кто разделяет это стремление.
      `,
    },
  ],
};

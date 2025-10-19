import { CONTENT_TYPES } from "@/utils/constants";

export default {
  name: "Xellon",
  slug: "xellon",
  roles: ["Исследование", " Анимация", "Визуальная идентификация", "3д"],
  year: 28,
  number: 6,
  content: [
    {
      type: CONTENT_TYPES.paragraph,
      text: `
        XELLON — IT-компания, лидер рынка в адаптации бизнеса к изменениям инфраструктуры в IT-сфере через индивидуальные услуги локализации. В 2023 году компания реализовала стратегию корпоративного бренда.
Архитектурные планы с их особой эстетикой графических элементов и композиционной организацией информации стали основой стиля. 
      `,
    },
    {
      type: CONTENT_TYPES.extraParagraph,
      text: `
        Архитектурное бюро по проектированию IT-инфраструктуры для бизнеса.
      `,
    },
  ],
  images: [
    "https://player.vimeo.com/1020314626",
  ],
  media: [
    { type: "img", src: "/6.webp" }, 
  ]
};

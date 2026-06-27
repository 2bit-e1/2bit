import { CONTENT_TYPES } from "@/utils/constants";

export default {
  name: "ICE",
  slug: "ice",
  roles: ["Визуальная идентификация", "Анимация", "Гайдлайн"],
  year: 22,
  number: 4,
  content: [
    {
      type: CONTENT_TYPES.paragraph,
      text: `
        Нужно было собрать язык, который связывает участников из разных стран и превращает Арктику из удаленной темы в общее поле действия. Система строится вокруг набора полярных символов. Они работают на сцене, в мерче, печатных материалах, digital-носителях и среде форума.
      `,
    },
    {
      type: CONTENT_TYPES.extraParagraph,
      text: `
        Точка входа в общую карту будущей Арктики.
      `,
    },
  ],
  images: [
    "/4.1.mp4",
    "/4.2.webp",
    "/4.3.webp",
    "/4.4.webp",
    "/4.5.webp",
    "/4.6.mp4",
    "/4.7.webp",
    "/4.8.webp",
    "/4.9.webp",
    "/4.10.webp",
    "/4.11.webp",
    "/4.12.webp",
    "/4.13.webp",
  ],
  media: [
    { type: "img", src: "/4.webp" }, 
  ]
};

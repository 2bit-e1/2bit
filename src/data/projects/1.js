import { CONTENT_TYPES } from "@/utils/constants";

export default {
  name: "Refmodel",
  slug: "refmodel",
  roles: ["Веб", "Анимация", "3D"],
  year: 24,
  number: 1,
  link: "https://model.rubytech.ru",
  content: [
    {
      type: CONTENT_TYPES.paragraph,
      text: `
        Референсная модель Rubytech –  набор аппаратных и программных продуктов, структурированных в соответствии с метамоделью базового ИТ-ландшафта.
Главной задачей работы стало устранение эффекта «визуальной слепоты» пользователя и создание логичной структуры перемещения между страницами.

      `,
    },
    {
      type: CONTENT_TYPES.extraParagraph,
      text: `
        С помощью метафоры единого модуля  мы создали понятную и ясную карту путешествия пользователя, обеспечив плавное погружение и ясное восприятие информации.
      `,
    },
  ],
  images: [
    "https://player.vimeo.com/1020358245",
    "https://kinescope.io/embed/xfiUFyVMNiH34SjjBgiLau", // пример Vimeo
  ],
  media: [
    { type: "video", src: "/1.mp4" }, 
  ]
};

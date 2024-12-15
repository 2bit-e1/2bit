export const PAGE_NAMES = {
  home: "home",
  process: "process",
  project: "project",
  me: "me",
};

export const ROUTES = {
  home: "/",
  process: "/process",
  project: "/projects/:slug",
  me: "/me",
};

export const CONTENT_TYPES = {
  title: "title",
  paragraph: "paragraph",
  extraParagraph: "extra-paragraph",
  image: "image",
  video: "video"
};

// 100ms задержка в появлинии слов
export const wordAppearDelayStep = 35



// Разделение текста на строки на основе ширины блока
// textContent.split(' ').forEach(word => {
//   const newLine = currentLine + (currentLine ? ' ' : '') + word;
//   const tempDiv = document.createElement('div');
//   tempDiv.textContent = newLine;
//   document.body.appendChild(tempDiv);
//   if (tempDiv.offsetWidth > paragraphWidth) {
//     lines.push(currentLine);
//     currentLine = word;
//   } else {
//     currentLine = newLine;
//   }
//   document.body.removeChild(tempDiv);
// });

// // Добавление оставшейся строки
// if (currentLine) {
//   lines.push(currentLine);
// }

// // Очистка содержимого элемента <p>
// paragraph.innerHTML = '';

// // Обертывание каждой строки в <div> и добавление их обратно в элемент <p>
// lines.forEach(line => {
//   const div = document.createElement('div');
//   div.textContent = line.trim();
//   paragraph.appendChild(div);
// });


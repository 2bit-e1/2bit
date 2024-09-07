import { timeForLoadAllImages } from "@/components/Process/utils";
import { promiseTimeLimit } from "./promiseTimeLimit";
import { onMounted } from "vue";

export const useWaitingImagesToLoad = (imagesRefs, handleImagesLoaded) => {
  onMounted(() => {
    const proms = imagesRefs.value.map((image) => new Promise((res) => (image.onload = () => res())));
    promiseTimeLimit(Promise.all(proms), timeForLoadAllImages).then(handleImagesLoaded);
  });
}
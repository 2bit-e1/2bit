import LocomotiveScroll from "locomotive-scroll";

export const getLocomotiveScrollInstance = (el) => {
  if (window.innerWidth <= 1024) return null
  
  const locomotiveScroll = new LocomotiveScroll({
    el,
    smooth: true,
    mobile: {
      smooth: false,
      breakpoint: 0,
    },
    tablet: {
      smooth: false,
      breakpoint: 0,
    }
  });
  
  return locomotiveScroll
}
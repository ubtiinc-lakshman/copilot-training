"use client";

import { useEffect } from "react";

// Course pages: once the page is scrolled, the main header slides away and only the course menu stays; back at the top both show.
// It sets data-course-scrolled on <html>; the rules are in globals.css. Pages without a course menu never set it, so their header stays.
export default function ScrollChrome() {
  useEffect(() => {
    const root = document.documentElement;
    const update = () => root.toggleAttribute("data-course-scrolled", window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      root.removeAttribute("data-course-scrolled");
    };
  }, []);
  return null;
}

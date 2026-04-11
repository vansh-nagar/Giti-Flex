"use client";
 
 import { useEffect, useState } from "react";
 
 export function useTheme() {
   const [theme, setTheme] = useState<"light" | "dark">("light");
 
   useEffect(() => {
     const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
     const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
     const initialTheme = savedTheme || systemTheme;
     
     setTheme(initialTheme);
     if (initialTheme === "dark") {
       document.documentElement.classList.add("dark");
     } else {
       document.documentElement.classList.remove("dark");
     }
   }, []);
 
   const toggleTheme = () => {
     const newTheme = theme === "light" ? "dark" : "light";
     setTheme(newTheme);
     localStorage.setItem("theme", newTheme);
     
     if (newTheme === "dark") {
       document.documentElement.classList.add("dark");
     } else {
       document.documentElement.classList.remove("dark");
     }
   };
 
   return { theme, toggleTheme };
 }

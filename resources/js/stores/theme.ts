import { defineStore } from "pinia"

type ThemeMode = "light" | "dark" | "system"

export const useThemeStore = defineStore("theme", {
  state: (): { theme: ThemeMode } => ({
    theme: "system",
  }),

  actions: {
    hydrateTheme() {
      const storedTheme = localStorage.getItem("theme") as ThemeMode | null

      this.theme = storedTheme || "system"

      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches

      if (this.theme === "dark") {
        document.documentElement.classList.add("dark")
      } else if (this.theme === "light") {
        document.documentElement.classList.remove("dark")
      } else {
        document.documentElement.classList.toggle("dark", prefersDark)
      }
    },

    setTheme(theme: ThemeMode) {
      this.theme = theme

      if (theme === "dark") {
        document.documentElement.classList.add("dark")
        localStorage.setItem("theme", "dark")
      } else if (theme === "light") {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("theme", "light")
      } else {
        localStorage.removeItem("theme")

        const systemDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches

        document.documentElement.classList.toggle("dark", systemDark)
      }
    },
  },
})

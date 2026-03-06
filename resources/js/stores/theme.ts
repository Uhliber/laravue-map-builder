import { defineStore } from "pinia"

type ThemeMode = "light" | "dark" | "system"

export const useThemeStore = defineStore("theme", {
    state: (): { theme: ThemeMode } => ({
        theme: (localStorage.getItem("theme") as ThemeMode) || "system"
    }),

    actions: {
        setTheme(theme: ThemeMode) {
            this.theme = theme

            if (theme === "dark") {
                document.documentElement.classList.add("dark")
                localStorage.setItem("theme", "dark")
            }
            else if (theme === "light") {
                document.documentElement.classList.remove("dark")
                localStorage.setItem("theme", "light")
            }
            else {
                localStorage.removeItem("theme")

                const systemDark = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches

                document.documentElement.classList.toggle("dark", systemDark)
            }
        }
    }
})

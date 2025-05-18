import useAuthStore from "~/stores/AuthStore"

export default function useThemeSwitch() {
  const enabled = useState(() => ({}))

  onMounted(() => {
    if (process.client) {
      enabled.value = localStorage.getItem("theme") === "dark" ? true : false
    }
  })


  const toggleTheme = () => {
    enabled.value = !enabled.value
    if (process.client) {
      localStorage.setItem("theme", enabled.value ? "dark" : "light")
    }
    setTheme()
  }

  function setTheme() {
    if (process.client) {
      const theme = localStorage.getItem("theme")
      if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.documentElement.setAttribute("data-theme", "dark")
        document.documentElement.style.backgroundColor = "rgb(63 63 70)";
        useAuthStore().theme = "dark"
        //   enabled.value = true
      } else {
        document.documentElement.removeAttribute("data-theme")
        document.documentElement.style.backgroundColor = "rgb(243 244 246)";
        useAuthStore().theme = "light"
        //   enabled.value = false
      }
    }
  }

  return {
    enabled,
    toggleTheme,
    setTheme,
  }
}
const useLayoutsStore = defineStore({
  id: 'layoutsStore',
  state: () => ({
    titlePath: 'testlayout',
    subTitlePath: '',
    lastPathSegment: '',
    parentTitle: '',
    topTitle: '',
    currentRouteName: '',
    lastFullPath: '',
    isCloseSidebar: true,
    lastVisitedRoute: '',
    lastVisitedMasterRoute: '/masters/customizations',
    currentRoute: [] as Record<string, any>[],
  }),
  actions: {
    defineTitlePath(config?: any) {
      // Resolve the route here (in-action, valid context) instead of at module
      // top level — a top-level useRoute() runs on first import, which can be
      // during app bootstrap (plugins) where there is no Nuxt instance yet.
      const route = useRoute()
      let routePath = route.path
      let pathArray = routePath.split('/')

      this.currentRoute = []
      pathArray.forEach((item, index) => {
        if (item != '') {
          // this.currentRoute.push(item)
          let active = false
          if (index == pathArray.length - 1 || item.includes('edit')) {
            active = true
          }
          // get previous to start, then combine with current
          let href = pathArray.slice(0, index + 1).join('/').toLowerCase()
          console.log('href', href);
          // if (href.includes('masters') && index == 1) {
          //   href = this.lastVisitedMasterRoute
          // }


          this.currentRoute.push({
            title: item.replace(/-/g, ' '),
            href: href,
            active: active,
            disabled: active
          })
        }
      })

      let titlePath = pathArray[1]
      let subTitlePath = pathArray[3]
      let lastPathSegment = pathArray[pathArray.length - 1].replace(/-/g, ' ')

      if (titlePath.replace(/-/g, ' ') == lastPathSegment) {
        subTitlePath = ''
        lastPathSegment = ''
      }

      this.titlePath = config?.titlePath ?? titlePath
      this.subTitlePath = config?.subTitlePath ?? subTitlePath
      this.lastPathSegment = config?.lastPathSegment ?? lastPathSegment
      this.parentTitle = config?.parentTitle ?? ''
      this.topTitle = config?.topTitle ?? titlePath
      this.currentRouteName = route.name?.toString() ?? ''

      if (route.path.includes('/masters/')) {
        this.lastVisitedMasterRoute = route.path
      }

    },
    hasHistory(): boolean {
      return window.history.length > 2
    }
  },
  persist: true
})

export default useLayoutsStore

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLayoutsStore, import.meta.hot))
}
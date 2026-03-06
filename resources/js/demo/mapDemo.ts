import type { MapPointer } from "@/types"
import { PageProps } from "@/types"
import { usePage } from "@inertiajs/vue3"
import { computed } from "vue"

const page = usePage<PageProps>()

const authorUrl = computed<string>(() => {
  return (page.props?.author_url as string) ?? "/"
})

export const demoMapBaseImage = "/images/base/base-1.jpg"

export const demoHighlightPointer: {
  pointer: MapPointer
  style: Record<string, string | number>
} = {
  pointer: {
    id: "landmark-ship",
    name: "Ship",
    category: "landmarks",
    fileType: "svg",
    title: "Welcome!",
    description:
      "Add an interactive map to help users explore and navigate your site. Click this popover to start building.",
    link: "/login",
    x: 0,
    y: 0,
    trigger: "always",
    placement: "right",
    offset: -30,
    animate: false,
  },
  style: {
    left: "-130px",
    bottom: "-30px",
    width: "300px",
    height: "300px",
  },
}

export const demoPointers: MapPointer[] = [
  {
    id: "landmark-cave",
    name: "Cave",
    category: "landmarks",
    fileType: "svg",
    x: 580,
    y: 530,
    title: "Main Social Cave",
    description: "Chill zone for networking.",
    link: "/",
    trigger: "hover",
    placement: "left",
    animate: true,
  },
  {
    id: "landmark-pyramid",
    name: "Pyramid",
    category: "landmarks",
    fileType: "svg",
    x: 320,
    y: 200,
    title: "Explore the Map",
    description: "Hover over the landmarks to show popovers.",
    link: "/",
    trigger: "always",
    placement: "top",
    animate: true,
  },
  {
    id: "landmark-volcano",
    name: "Volcano",
    category: "landmarks",
    fileType: "svg",
    x: 60,
    y: 380,
    title: "Food Volcano",
    description: "Snacks and drinks available.",
    link: "/",
    trigger: "hover",
    placement: "right",
    animate: true,
  },
  {
    id: "landmark-hut",
    name: "Hut",
    category: "landmarks",
    fileType: "svg",
    x: 650,
    y: 280,
    title: "Relax Hut",
    description: "Quiet resting area.",
    link: "/",
    trigger: "hover",
    animate: true,
  },
  {
    id: "ollie-stand",
    name: "Ollie",
    category: "other",
    fileType: "png",
    x: 720,
    y: 30,
    title: "Visit my Website!",
    link: authorUrl.value,
    target: "_blank",
    trigger: "always",
    animate: true,
  },
]

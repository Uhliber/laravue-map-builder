import type {
  MapPointer,
  MapAsset,
  MapHighlightPointer,
  PageProps,
} from "@/types"
import { usePage } from "@inertiajs/vue3"
import { computed } from "vue"

const page = usePage<PageProps>()

const authorUrl = computed<string>(() => {
  return (page.props?.author_url as string) ?? "/"
})

export const demoMapBaseImage = "/images/base/base-1.jpg"

export const demoAssets: MapAsset[] = [
  //   Base

  {
    id: "base-1",
    name: "Base 1",
    category: "base",
    subcategory: null,
    src: "/images/base/base-1.jpg",
    fileType: "jpg",
  },
  {
    id: "base-2",
    name: "Base 2",
    category: "base",
    subcategory: null,
    src: "/images/base/base-2.jpg",
    fileType: "jpg",
  },
  {
    id: "base-3",
    name: "Base 3",
    category: "base",
    subcategory: null,
    src: "/images/base/base-3.jpg",
    fileType: "jpg",
  },

  // Pointer: Base

  {
    id: "pointer-1",
    name: "Pointer 1",
    category: "pointers",
    subcategory: "basic",
    src: "/images/pointers/basic/pointer-1.png",
    fileType: "png",
  },
  {
    id: "pointer-2",
    name: "Pointer 2",
    category: "pointers",
    subcategory: "basic",
    src: "/images/pointers/basic/pointer-2.png",
    fileType: "png",
  },
  {
    id: "pointer-3",
    name: "Pointer 3",
    category: "pointers",
    subcategory: "basic",
    src: "/images/pointers/basic/pointer-3.png",
    fileType: "png",
  },
  {
    id: "pointer-4",
    name: "Pointer 4",
    category: "pointers",
    subcategory: "basic",
    src: "/images/pointers/basic/pointer-4.png",
    fileType: "png",
  },

  //   Pointer: Dots

  {
    id: "dot-1",
    name: "Dot 1",
    category: "pointers",
    subcategory: "dots",
    src: "/images/pointers/dots/dot-1.svg",
    fileType: "svg",
  },
  {
    id: "dot-2",
    name: "Dot 2",
    category: "pointers",
    subcategory: "dots",
    src: "/images/pointers/dots/dot-2.svg",
    fileType: "svg",
  },
  {
    id: "dot-3",
    name: "Dot 3",
    category: "pointers",
    subcategory: "dots",
    src: "/images/pointers/dots/dot-3.svg",
    fileType: "svg",
  },

  //   Pointer: Landmarks

  {
    id: "landmark-cave",
    name: "Cave",
    category: "pointers",
    subcategory: "landmarks",
    src: "/images/pointers/landmarks/landmark-cave.svg",
    fileType: "svg",
  },
  {
    id: "landmark-fossil",
    name: "Fossil",
    category: "pointers",
    subcategory: "landmarks",
    src: "/images/pointers/landmarks/landmark-fossil.svg",
    fileType: "svg",
  },
  {
    id: "landmark-headstones",
    name: "Headstones",
    category: "pointers",
    subcategory: "landmarks",
    src: "/images/pointers/landmarks/landmark-headstones.svg",
    fileType: "svg",
  },
  {
    id: "landmark-hut",
    name: "Hut",
    category: "pointers",
    subcategory: "landmarks",
    src: "/images/pointers/landmarks/landmark-hut.svg",
    fileType: "svg",
  },
  {
    id: "landmark-pyramid",
    name: "Pyramid",
    category: "pointers",
    subcategory: "landmarks",
    src: "/images/pointers/landmarks/landmark-pyramid.svg",
    fileType: "svg",
  },
  {
    id: "landmark-ruins",
    name: "Ruins",
    category: "pointers",
    subcategory: "landmarks",
    src: "/images/pointers/landmarks/landmark-ruins.svg",
    fileType: "svg",
  },
  {
    id: "landmark-ship",
    name: "Ship",
    category: "pointers",
    subcategory: "landmarks",
    src: "/images/pointers/landmarks/landmark-ship.svg",
    fileType: "svg",
  },
  {
    id: "landmark-totem",
    name: "Totem",
    category: "pointers",
    subcategory: "landmarks",
    src: "/images/pointers/landmarks/landmark-totem.svg",
    fileType: "svg",
  },
  {
    id: "landmark-tower",
    name: "Tower",
    category: "pointers",
    subcategory: "landmarks",
    src: "/images/pointers/landmarks/landmark-tower.svg",
    fileType: "svg",
  },
  {
    id: "landmark-volcano",
    name: "Volcano",
    category: "pointers",
    subcategory: "landmarks",
    src: "/images/pointers/landmarks/landmark-volcano.svg",
    fileType: "svg",
  },
]

export const demoHighlightPointer: MapHighlightPointer = {
  pointer: {
    id: "landmark-ship",
    name: "Ship",
    category: "landmarks",
    fileType: "svg",
    title: "Build your map!",
    description:
      "Add an interactive map to help users explore and navigate your site. Click this popover to start building.",
    link: "/map-builder",
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

    x: 52,
    y: 55,

    width: 16,
    height: 16,

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

    x: 30,
    y: 20,

    width: 16,
    height: 16,

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

    x: 6.2,
    y: 36,

    width: 16,
    height: 16,

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

    x: 60,
    y: 30,

    width: 16,
    height: 16,

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

    x: 67,
    y: 2,

    width: 16,
    height: 16,

    title: "Visit my Website!",
    link: authorUrl.value,
    target: "_blank",
    trigger: "always",
    animate: true,
  },
]

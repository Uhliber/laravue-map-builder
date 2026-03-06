import type { MapPointer } from "@/types"

export const demoMapBaseImage = "/images/base/base-1.jpg"

export const demoHighlightPointer = {
  pointer: {
    id: "landmark-ship",
    name: "Ship",
    category: "landmarks",
    fileType: "svg",
    title: "Welcome!",
    description:
      "Start creating your own map layout and place markers anywhere you like. Click the arrow to begin building your map.",
    link: "/login",
    x: 0,
    y: 0,
    trigger: "always",
    placement: "right",
    offset: -30,
  },
  style: {
    left: "-160px",
    bottom: "-50px",
    width: "400px",
    height: "400px",
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
  },
]

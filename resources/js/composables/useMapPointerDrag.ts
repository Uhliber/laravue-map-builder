import { ref, computed, nextTick } from "vue"
import { useMouse, useEventListener } from "@vueuse/core"
import type { Ref } from "vue"
import { MapAsset, MapPointer } from "@/types"

export function useMapPointerDrag(
  mapContainer: Ref<HTMLElement | null>,
  workspacePointers: Record<string, MapPointer | null>,
  initialAssets: Ref<MapAsset[]>,
  options?: {
    pointerSize?: number
    dragThreshold?: number
  },
) {
  const draggedPointerId = ref<string | null>(null)

  const dragThreshold = options?.dragThreshold ?? 6

  const dragStartX = ref(0)
  const dragStartY = ref(0)

  const isDragging = ref(false)

  const offsetX = ref(0)
  const offsetY = ref(0)

  const mouse = useMouse()

  const assetMap = computed(() => {
    const map = new Map<string, MapAsset>()

    for (const asset of initialAssets.value) {
      map.set(asset.id, asset)
    }

    return map
  })

  async function createWorkspacePointer(assetId: string) {
    await nextTick()
    if (!mapContainer.value) return null

    const asset = assetMap.value.get(assetId)

    if (!asset) return null

    const rect = mapContainer.value.getBoundingClientRect()

    const id = `${assetId}-${Date.now()}`

    const pointer: MapPointer = {
      id,
      name: asset.name,
      category: asset.category,
      fileType: asset.fileType,
      src: asset.src,
      x: rect.width / 2,
      y: rect.height / 2,
    }

    workspacePointers[id] = pointer

    return pointer
  }

  async function startDrag(pointerId: string, event: MouseEvent) {
    let pointer = workspacePointers[pointerId]

    if (!pointer) {
      pointer = await createWorkspacePointer(pointerId)
      if (!pointer) return
    }

    draggedPointerId.value = pointer.id

    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()

    offsetX.value = mouse.x.value - rect.left
    offsetY.value = mouse.y.value - rect.top

    dragStartX.value = event.clientX
    dragStartY.value = event.clientY

    isDragging.value = false

    event.preventDefault()
  }

  function handleMove() {
    if (!draggedPointerId.value || !mapContainer.value) return

    const pointer = workspacePointers[draggedPointerId.value]
    if (!pointer) return

    const dx = Math.abs(mouse.x.value - dragStartX.value)
    const dy = Math.abs(mouse.y.value - dragStartY.value)

    if (!isDragging.value) {
      if (dx > dragThreshold || dy > dragThreshold) {
        isDragging.value = true
      } else {
        return
      }
    }

    const container = mapContainer.value
    if (!container) return

    const rect = container.getBoundingClientRect()

    pointer.x = mouse.x.value - rect.left - offsetX.value
    pointer.y = mouse.y.value - rect.top - offsetY.value
  }

  function handleStop() {
    if (!draggedPointerId.value || !mapContainer.value) return

    const pointer = workspacePointers[draggedPointerId.value]
    if (!pointer) return

    const rect = mapContainer.value.getBoundingClientRect()

    const pointerSize = options?.pointerSize ?? 48

    let x = pointer.x ?? 0
    let y = pointer.y ?? 0

    const minX = 0
    const minY = 0
    const maxX = rect.width - pointerSize
    const maxY = rect.height - pointerSize

    const isInside = x >= minX && y >= minY && x <= maxX && y <= maxY

    if (!isInside) {
      const distLeft = Math.abs(x - minX)
      const distRight = Math.abs(x - maxX)
      const distTop = Math.abs(y - minY)
      const distBottom = Math.abs(y - maxY)

      const minDist = Math.min(distLeft, distRight, distTop, distBottom)

      if (minDist === distLeft) pointer.x = minX
      else if (minDist === distRight) pointer.x = maxX
      else if (minDist === distTop) pointer.y = minY
      else pointer.y = maxY
    }

    draggedPointerId.value = null
    isDragging.value = false
  }

  useEventListener(window, "mousemove", handleMove)
  useEventListener(window, "mouseup", handleStop)

  return {
    startDrag,
  }
}

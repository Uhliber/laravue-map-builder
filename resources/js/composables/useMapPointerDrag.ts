import { ref, computed, nextTick } from "vue"
import { useMouse, useEventListener } from "@vueuse/core"
import type { Ref } from "vue"
import { MapAsset, MapPointer } from "@/types"

export function useMapPointerDrag(
  mapContainer: Ref<HTMLElement | null>,
  workspacePointers: Record<string, MapPointer | null>,
  initialAssets: Ref<MapAsset[]>,
  options?: {
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

    const id = `${assetId}-${Date.now()}`

    const pointer: MapPointer = {
      id,
      name: asset.name,
      category: asset.category,
      fileType: asset.fileType,
      src: asset.src,

      // center spawn (normalized percent)
      x: 50,
      y: 50,

      width: 6,
      height: 6,
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
    const rect = container.getBoundingClientRect()

    if (!rect.width || !rect.height) return

    // Do NOT clamp during dragging
    const nx = (mouse.x.value - rect.left - offsetX.value) / rect.width
    const ny = (mouse.y.value - rect.top - offsetY.value) / rect.height

    pointer.x = nx * 100
    pointer.y = ny * 100
  }

  function handleStop() {
    if (!draggedPointerId.value || !mapContainer.value) {
      draggedPointerId.value = null
      isDragging.value = false
      return
    }

    const pointer = workspacePointers[draggedPointerId.value]
    if (!pointer) {
      draggedPointerId.value = null
      isDragging.value = false
      return
    }

    const rect = mapContainer.value.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    if (!isDragging.value) {
      if (!workspacePointers[draggedPointerId.value]) {
        pointer.x = 50
        pointer.y = 50
      }
      draggedPointerId.value = null
      isDragging.value = false
      return
    } else {
      let nx = (mouse.x.value - rect.left - offsetX.value) / rect.width
      let ny = (mouse.y.value - rect.top - offsetY.value) / rect.height

      nx = Math.max(0, Math.min(1, nx))
      ny = Math.max(0, Math.min(1, ny))

      pointer.x = nx * 100
      pointer.y = ny * 100
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

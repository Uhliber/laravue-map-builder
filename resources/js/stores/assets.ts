import { defineStore } from "pinia"
import { ref, computed } from "vue"

import { demoAssets } from "@/demo/mapDemo"
import type { MapAsset, MapAssetSubcategory } from "@/types"

type AssetCategoryMap = Record<string, MapAsset[]>

export const useAssetsStore = defineStore("assets", () => {
  const assets = ref<MapAsset[]>([])

  function fetchAssets(): void {
    assets.value = demoAssets
  }

  const baseAssets = computed<MapAsset[]>(() =>
    assets.value.filter((a: MapAsset) => a.category === "base"),
  )

  const pointerAssets = computed<MapAsset[]>(() =>
    assets.value.filter((a: MapAsset) => a.category === "pointers"),
  )

  const pointerSubcategories = computed<AssetCategoryMap>(() => {
    const map: AssetCategoryMap = {}

    pointerAssets.value.forEach((asset: MapAsset) => {
      const key: MapAssetSubcategory | "other" = asset.subcategory ?? "other"

      if (!map[key]) {
        map[key] = []
      }

      map[key].push(asset)
    })

    return map
  })

  return {
    assets,
    fetchAssets,
    baseAssets,
    pointerAssets,
    pointerSubcategories,
  }
})

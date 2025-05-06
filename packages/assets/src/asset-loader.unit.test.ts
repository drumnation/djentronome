import { describe, it, expect, beforeEach } from "vitest";
import { loadSound, getAssetStatus, AssetStatus } from "./index";
import { soundAssets } from "../sounds";

describe("Asset Loader", () => {
  beforeEach(() => {
    // Reset module state between tests if needed
  });
  
  it("should load a sound asset and update its status", async () => {
    // Get reference to a sound asset
    const asset = soundAssets.buttonClick;
    expect(asset).toBeDefined();
    
    if (asset) {
      // Initial status may be undefined if not tracked yet
      const initialStatus = getAssetStatus(asset.id);
      expect(initialStatus?.status !== AssetStatus.LOADED).toBeTruthy();
      
      // Load the asset
      const result = await loadSound(asset);
      expect(result).toBe(true);
      
      // Status should now be LOADED
      const finalStatus = getAssetStatus(asset.id);
      expect(finalStatus).toBeDefined();
      expect(finalStatus?.status).toBe(AssetStatus.LOADED);
    }
  });
});

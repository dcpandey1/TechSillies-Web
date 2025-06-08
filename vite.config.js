import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    allowedHosts: ["88be-2409-40f2-3005-5b19-20d0-5d59-436f-2ddd.ngrok-free.app"],
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["html5-qrcode"], // ✅ Include it in optimization step
  },
});

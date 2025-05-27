import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    base: mode === "production" ? "/AdminJS/" : "/",
    plugins: [react()],
}));

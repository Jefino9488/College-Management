import path from "path"
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base : "/College-Management/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          "vendor": ["react", "react-dom", "react-router-dom"],
          // UI components
          "ui-components": [
            "./src/components/ui/button.tsx",
            "./src/components/ui/input.tsx",
            "./src/components/ui/label.tsx",
            "./src/components/ui/form.tsx",
            "./src/components/ui/select.tsx",
            "./src/components/ui/card.tsx",
            "./src/components/ui/navigation-menu.tsx",
            "./src/components/ui/avatar.tsx",
            "./src/components/ui/dropdown-menu.tsx",
            "./src/components/ui/table.tsx",
          ],
          // Pages
          "pages": [
            "./src/pages/Register.tsx",
            "./src/pages/Login.tsx",
            "./src/pages/Departments.tsx",
            "./src/pages/CollegeManagement.tsx",
            "./src/pages/Home.tsx",
          ],
        },
      },
    },
  },
})

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
    },
    build: {
        outDir: 'dist',
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env['NODE_ENV']),
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
//# sourceMappingURL=vite.config.js.map
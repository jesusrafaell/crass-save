import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		watch: {
			usePolling: true,
		},
		host: '0.0.0.0',
		strictPort: true,
		port: 9000,
	},
});

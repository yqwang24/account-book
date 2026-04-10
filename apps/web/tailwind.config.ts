import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('@account-book/config-tailwind/tailwind.config.ts')],
} satisfies Config
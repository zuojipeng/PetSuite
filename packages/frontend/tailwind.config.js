/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 启用深色模式支持
  theme: {
    extend: {
      colors: {
        // 温暖友好的暖色系配色方案
        primary: '#ff9d5c',           // 暖橙色（主色）
        'primary-dark': '#ff7b3d',    // 深橙色
        'primary-light': '#ffb380',   // 浅橙色
        secondary: '#ffd166',         // 暖黄色
        accent: '#ff6b9d',            // 粉红色
        'accent-coral': '#ff8577',    // 珊瑚色
        peach: '#ffcab0',             // 桃色
        cream: '#fff5e6',             // 奶油色
        'warm-bg': '#fffaf5',         // 温暖背景色
        'warm-gray': '#f5f1ed',       // 暖灰色
        'warm-text': '#5a4a42',       // 暖色文字
        'warm-dark': '#3d2f28',       // 深暖色

        // 辅助色
        'soft-green': '#a8d5ba',      // 柔和绿
        'soft-blue': '#a8c5e4',       // 柔和蓝

        // 保留原有配色（兼容）
        'background-dark': '#020617',
        'agent-bg': '#0f172a',
        'accent-mint': '#22d3ee',
        'med-blue': '#4f46e5',
        'fin-green': '#10b981',
        'purple-primary': '#7c3aed',
      },
      fontFamily: {
        display: ['Space Grotesk', 'Noto Sans SC', 'sans-serif'],
        sans: ['Noto Sans SC', 'sans-serif']
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

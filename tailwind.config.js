/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bs: {
          primary: '#FFD700',    // Amarelo oficial
          secondary: '#2F4F4F',  // Azul escuro oficial
          light: '#F8F9FA',      // Fundo claro
          text: '#333333',       // Texto escuro
          dark: '#000000'
        },
        orange: {
          500: '#F97316',
          600: '#EA580C',
        },
        funnel: {
          1: '#1e3a8a', // Prospect
          2: '#2563eb', // Primeiro Contato
          3: '#3b82f6', // Apresentação Enviada
          4: '#60a5fa', // Reunião Agendada
          5: '#6366f1', // Reunião Realizada
          6: '#8b5cf6', // Decisão
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

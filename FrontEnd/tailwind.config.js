/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',      
        secondary: '#1E293B',     
        dark: '#000000ff',  
        danger: '#ff0000ff  '        
      }
    },
  },
  plugins: [],
}
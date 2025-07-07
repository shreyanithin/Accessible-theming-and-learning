# Inclusify: Accessible Theming & Color Vision Simulator

Inclusify is a modern web application that helps designers and developers build more inclusive and accessible user interfaces. By simulating real-world color vision deficiencies, Inclusify allows you to preview and compare how your designs appear to users with different types of color blindness, ensuring your color choices work for everyone.

## 🚀 Features

- 🌈 **Color Vision Simulation**  
  Instantly compare normal and color-blind views of your designs.

- 🖼️ **Image Comparison**  
  Side-by-side image previews for normal and simulated color-blind vision.

- 🎨 **Color Swatch Demo**  
  Visualize how common UI colors appear to all users.

- ⚡ **Animated, Responsive UI**  
  Built with Next.js, Tailwind CSS, and Framer Motion for a beautiful, modern experience.

- 🎯 **ColorBlindness Test**
Detect and visualize color vision deficiency using Ishihara plates for accurate results.

- ♿ **Accessibility First**  
  Designed to promote accessible, inclusive design practices.

- 📦 **Custom Accessibility Package**  
  Includes a custom-built package for color vision simulation and accessible theming.  
  You can install it using:

  ```bash
  npm i access-utils
  ```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shreyanithin/Accessible-theming-and-learning.git
   cd accessible-theming
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in your browser:**
   ```
   http://localhost:3000
   ```

## Project Structure

- `access-theme/src/app/landing/page.tsx` — Main landing page with color vision simulation and demo.
- `public/` — Static assets.
- `styles/` — Global and component styles (Tailwind CSS).

## Tech Stack

- [Next.js](https://nextjs.org/) — React framework for production.
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework.
- [Framer Motion](https://www.framer.com/motion/) — Animation library for React.

## Accessibility

Inclusify is built to raise awareness about color accessibility. For more resources, check out:
- [WebAIM: Color Blindness](https://webaim.org/articles/visual/colorblind)
- [Color Oracle](https://colororacle.org/)
- [Accessible Color Palette Builder](https://toolness.github.io/accessible-color-matrix/)


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

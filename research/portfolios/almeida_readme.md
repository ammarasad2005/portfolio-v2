<h3 align="center">
  <img alt="Portfolio" width="70%" title="#logo" src="https://github.com/tthheusalmeida/portfolio/blob/main/public/cover/me.webp">
  <br>
</h3>

<p align="center">
  <strong>Portfolio</strong> — A personal space to showcase who I am, what I build, and where I've been.
</p>

<p align="center">
  <a href="https://github.com/tthheusalmeida/portfolio/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" target="_blank" />
  </a>
</p>

# 📂 Table of Contents

- [About](#about)
- [Technology Stack](#technology-stack)
- [In Action](#in-action)
- [Environment & Deployment](#environment--deployment)
- [License](#license)

<a id="about"></a>

## 👤 About

This is my personal portfolio, developed to present my professional background, skills, and recent projects. It serves as a hub for recruiters, collaborators, and tech enthusiasts to know more about my work and how to reach me.

<a id="technology-stack"></a>

## 💻 Technology Stack

The project was built with the following technologies:

- [Next.js](https://nextjs.org/) — React framework for production with hybrid static & server rendering
- [React](https://reactjs.org/) — Library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) — Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Node.js](https://nodejs.org/) — Server-side JavaScript runtime
- [Nodemailer](https://nodemailer.com/) — Email sending module for Node.js

<a id="in-action"></a>

## 📸 In Action

You can see the portfolio live at: [almeida-matheus.com](https://almeida-matheus.com/)

<a id="environment--deployment"></a>

## ⚙️ Environment & Deployment

The project is deployed via **GitHub Actions** and hosted on **Hostinger via FTP**.

### 🔐 Secrets and Environment

All sensitive data and environment variables are managed using **GitHub Secrets** and injected during the CI/CD process.

**⚠️ Never remove the following GitHub Secrets, as they are essential for deployment:**

- `FTP_HOST`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_PORT`
- `FTP_SERVER_DIR`

### 🌱 Runtime Environment Variables

These variables are defined via GitHub Secrets and exposed in the CI/CD pipeline (e.g., in the `env` block of your `.yaml` workflow file), then accessed using `process.env` in the code.

Examples:

- `INTERNAL_JWT_SECRET`

<a id="license"></a>

## 📝 License

This project is licensed under the MIT License. See the [license page](https://opensource.org/licenses/MIT) for more information.

---

<h4 align="center">
  Made with ❤️ by <a href="https://www.linkedin.com/in/dev-almeida-matheus/" target="_blank">Matheus Almeida</a>
</h4>

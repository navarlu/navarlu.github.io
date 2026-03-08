import { placeholderEmail, projects } from "./data/projects.js";

function updateThemeButton(theme) {
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.textContent = theme === "dark" ? "Light" : "Dark";
}

function setInitialTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeButton(theme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", nextTheme);
  localStorage.setItem("theme", nextTheme);
  updateThemeButton(nextTheme);
}

function setFooterYear() {
  document.getElementById("currentYear").textContent = new Date().getFullYear();
}

function renderProjects(filterCategory = "All") {
  const container = document.getElementById("projects-container");
  container.innerHTML = "";

  projects.forEach((project) => {
    const isVisible = filterCategory === "All" || project.category === filterCategory;
    if (!isVisible) {
      return;
    }

    const card = document.createElement("a");
    card.className = "project-card";
    card.href = project.href;
    if (project.external) {
      card.target = "_blank";
      card.rel = "noreferrer";
    }
    card.innerHTML = `
      <div class="project-summary">
        <div class="project-image-container">
          ${
            project.image
              ? `<img class="project-image" src="${project.image}" alt="${project.title} preview">`
              : `<div class="project-image">${project.imageLabel || project.title}</div>`
          }
        </div>
        <div class="project-info">
          <div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
          </div>
          <div>
            <div class="project-tags">
              ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
            </div>
            <span class="view-project-link">${project.linkLabel || "View Project"} &rarr;</span>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderFilters(initialFilter = "All") {
  const container = document.getElementById("filter-container");
  const categories = [...new Set(projects.map((project) => project.category))];

  container.innerHTML = [
    `<button class="filter-button" data-filter="All">All (${projects.length})</button>`,
    ...categories.map((category) => {
      const count = projects.filter((project) => project.category === category).length;
      return `<button class="filter-button" data-filter="${category}">${category} (${count})</button>`;
    })
  ].join("");

  container.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-button");
    if (!button) {
      return;
    }

    const filter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderProjects(filter);
  });

  const activeButton =
    container.querySelector(`[data-filter="${initialFilter}"]`) ||
    container.querySelector('[data-filter="All"]');

  activeButton.classList.add("active");
  return activeButton.dataset.filter;
}

async function copyEmailToClipboard() {
  const button = document.getElementById("copyEmailBtn");

  try {
    await navigator.clipboard.writeText(placeholderEmail);
    button.textContent = "Copied";
    button.classList.add("copied");
    setTimeout(() => {
      button.textContent = "Copy Email";
      button.classList.remove("copied");
    }, 1500);
  } catch (error) {
    button.textContent = placeholderEmail;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setInitialTheme();
  setFooterYear();

  const initialFilter = renderFilters("All");
  renderProjects(initialFilter);

  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("copyEmailBtn").addEventListener("click", copyEmailToClipboard);
});

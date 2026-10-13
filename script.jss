
"use strict";

const searchInput = document.getElementById("idea-search");
const filterContainer = document.getElementById("category-filters");
const ideaGrid = document.getElementById("idea-grid");
const resultsCount = document.getElementById("results-count");
const emptyState = document.getElementById("empty-state");

const ideaCards = Array.from(
  ideaGrid.querySelectorAll(".idea-card")
);

let activeCategory = "All";

function updateIdeas() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  ideaCards.forEach((card) => {
    const category = card.dataset.category || "";
    const title = card.querySelector("h3")?.textContent || "";
    const description = card.querySelector("p")?.textContent || "";
    const tags = card.querySelector(".tags")?.textContent || "";
    const extraSearch = card.dataset.search || "";

    const searchableText = [
      title,
      description,
      tags,
      extraSearch,
      category
    ].join(" ").toLowerCase();

    const matchesCategory =
      activeCategory === "All" || category === activeCategory;

    const matchesSearch =
      query === "" || searchableText.includes(query);

    const isVisible = matchesCategory && matchesSearch;

    card.hidden = !isVisible;

    if (isVisible) {
      visibleCount++;
    }
  });

  resultsCount.textContent =
    `${visibleCount} ${visibleCount === 1 ? "idea" : "ideas"} to explore`;

  emptyState.hidden = visibleCount !== 0;
  ideaGrid.hidden = visibleCount === 0;
}

filterContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");

  if (!button) return;

  activeCategory = button.dataset.category;

  filterContainer.querySelectorAll("button[data-category]").forEach((item) => {
    const isActive = item === button;

    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  updateIdeas();
});

searchInput.addEventListener("input", updateIdeas);

// Press "/" to focus search when you're not typing elsewhere.
document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping =
    target instanceof HTMLElement &&
    (
      target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
    );

  if (
    event.key === "/" &&
    !isTyping &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey
  ) {
    event.preventDefault();
    searchInput.focus();
  }

  if (
    event.key === "Escape" &&
    document.activeElement === searchInput
  ) {
    searchInput.value = "";
    updateIdeas();
    searchInput.blur();
  }
});

// Set the correct initial result count.
updateIdeas();

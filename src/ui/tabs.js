export function setupTabs(elements) {
  const { panelSingle, panelBulk, tabSingle, tabBulk } = elements;

  function switchTab(type) {
    panelSingle.classList.toggle("hidden", type !== "single");
    panelBulk.classList.toggle("hidden", type !== "bulk");
    tabSingle.classList.toggle("tab-active", type === "single");
    tabBulk.classList.toggle("tab-active", type === "bulk");
  }

  tabSingle.addEventListener("click", () => switchTab("single"));
  tabBulk.addEventListener("click", () => switchTab("bulk"));

  return { switchTab };
}

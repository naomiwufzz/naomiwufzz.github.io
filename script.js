(() => {
  const buttons = [...document.querySelectorAll("[data-filter]")];
  const items = [...document.querySelectorAll(".timeline-item[data-kind]")];
  const status = document.querySelector("#filter-status");
  const dialog = document.querySelector("#entry-dialog");
  const dialogType = document.querySelector("#entry-dialog-type");
  const dialogTitle = document.querySelector("#entry-dialog-title");
  const dialogDate = document.querySelector("#entry-dialog-date");
  const dialogContent = document.querySelector("#entry-dialog-content");
  const dialogClose = dialog.querySelector(".entry-dialog-close");
  const labels = {
    agent: "Agent 系统项目",
    posttraining: "策略后训练项目",
    research: "深度研究项目",
    opensource: "开源项目",
  };

  let lastTrigger = null;

  const setFilter = (button) => {
    const filter = button.dataset.filter;
    let visible = 0;
    buttons.forEach((item) => {
      const selected = item === button;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    items.forEach((item) => {
      const show = filter === "all" || item.dataset.kind === filter;
      item.hidden = !show;
      if (show) visible += 1;
    });
    status.textContent = filter === "all" ? `显示全部 ${visible} 个项目` : `显示 ${visible} 个${labels[filter]}`;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => setFilter(button));
    button.addEventListener("keydown", (event) => {
      const index = buttons.indexOf(button);
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % buttons.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = buttons.length - 1;
      else return;
      event.preventDefault();
      buttons[nextIndex].focus();
      setFilter(buttons[nextIndex]);
    });
  });

  document.querySelectorAll("[data-filter-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const targetFilter = buttons.find((button) => button.dataset.filter === link.dataset.filterLink);
      if (targetFilter) setFilter(targetFilter);
    });
  });

  document.querySelectorAll(".timeline-entry").forEach((entry) => {
    const item = entry.closest(".timeline-item");
    const heading = entry.querySelector("h3");
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "entry-open-overlay";
    trigger.setAttribute("aria-label", "打开详情：" + heading.textContent.trim());
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", dialog.id);
    trigger.addEventListener("click", () => {
      lastTrigger = trigger;
      dialogType.textContent = entry.querySelector(".timeline-type")?.textContent.trim() || "";
      dialogTitle.textContent = heading.textContent.trim();
      dialogDate.textContent = item.querySelector("time")?.textContent.trim() || "";
      const content = entry.cloneNode(true);
      content.classList.add("entry-dialog-entry");
      content.querySelector(".entry-open-overlay")?.remove();
      content.querySelectorAll("details").forEach((details) => {
        details.open = true;
      });
      dialogContent.replaceChildren(content);
      dialog.showModal();
    });
    entry.prepend(trigger);
  });

  dialogClose.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => lastTrigger?.focus());

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealItems = document.querySelectorAll(".section-heading, .timeline-item, .spotlight-inner, .education-card, .evidence-card, .architecture-card, .material-card, .contact-inner");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => {
      item.classList.add("reveal");
      observer.observe(item);
    });
  }
})();

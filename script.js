const printButton = document.querySelector("#print-guide");

printButton?.addEventListener("click", () => {
  window.print();
});

const printWorksheetButton = document.querySelector("#print-worksheet");
let isWorksheetPrinting = false;
let detailsBeforePrint = [];

printWorksheetButton?.addEventListener("click", () => {
  isWorksheetPrinting = true;
  document.body.classList.add("print-worksheet");
  window.print();
});

window.addEventListener("beforeprint", () => {
  detailsBeforePrint = [...document.querySelectorAll("details:not(.guide-menu)")].map(
    (details) => ({ details, open: details.open }),
  );
  detailsBeforePrint.forEach(({ details }) => {
    details.open = true;
  });
});

window.addEventListener("afterprint", () => {
  detailsBeforePrint.forEach(({ details, open }) => {
    details.open = open;
  });
  detailsBeforePrint = [];

  if (!isWorksheetPrinting) {
    return;
  }

  document.querySelectorAll("#roteiro textarea").forEach((field) => {
    field.value = "";
  });
  document.body.classList.remove("print-worksheet");
  isWorksheetPrinting = false;
});

const openDetailsForHash = (hash) => {
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));

  for (let element = target; element; element = element.parentElement) {
    if (element instanceof HTMLDetailsElement) {
      element.open = true;
    }
  }

  return target;
};

const revealHashTarget = () => {
  const target = openDetailsForHash(window.location.hash);
  target?.scrollIntoView({ block: "start" });
};

if (window.location.hash) {
  requestAnimationFrame(revealHashTarget);
}
window.addEventListener("hashchange", revealHashTarget);

document.querySelectorAll(".guide-menu").forEach((menu) => {
  menu.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (!link) {
      return;
    }

    if (
      link.hash &&
      link.origin === window.location.origin &&
      link.pathname === window.location.pathname
    ) {
      openDetailsForHash(link.hash);
    }

    menu.open = false;
  });

  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.open) {
      menu.open = false;
      menu.querySelector("summary")?.focus();
    }
  });
});

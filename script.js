// Ceylon Odyssey Travels — navigation, booking enquiry and page interactions
document.addEventListener("DOMContentLoaded", () => {
  // Render Lucide icons when the library is available.
  if (window.lucide) window.lucide.createIcons();

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-link");
  const backToTop = document.querySelector(".back-to-top");
  const modal = document.querySelector("#booking-modal");
  const selectedPackage = document.querySelector("#selected-package");
  const bookingForm = document.querySelector("#booking-form");

  // Mobile navigation
  const closeMenu = () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
    if (window.lucide) window.lucide.createIcons();
  };

  menuToggle.addEventListener("click", event => {
    event.stopPropagation();
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    menuToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (window.lucide) window.lucide.createIcons();
  });

  navItems.forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("click", event => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });

  // Header and back-to-top visibility
  const updateScrollUI = () => {
    const scrolled = window.scrollY > 30;
    header.classList.toggle("scrolled", scrolled);
    backToTop.classList.toggle("visible", window.scrollY > 500);
  };
  updateScrollUI();
  window.addEventListener("scroll", updateScrollUI, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Highlight the navigation item for the section currently in view.
  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navItems.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => observer.observe(section));
  }

  // Open the booking enquiry modal for the selected package.
  document.querySelectorAll(".book-button").forEach(button => {
    button.addEventListener("click", () => {
      selectedPackage.textContent = button.dataset.package || "a tour";
      if (typeof modal.showModal === "function") {
        modal.showModal();
        document.body.classList.add("modal-open");
      } else {
        alert(`Thanks for your interest in ${selectedPackage.textContent}! Please contact us to arrange your trip.`);
      }
    });
  });

  const closeModal = () => document.body.classList.remove("modal-open");
  modal.addEventListener("close", closeModal);
  modal.addEventListener("click", event => {
    // Clicking the shaded backdrop closes the dialog.
    if (event.target === modal) modal.close();
  });

  // Demo enquiry: create a pre-filled email. Replace the address with your real inbox.
  bookingForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;

    const formData = new FormData(bookingForm);
    const subject = `Tour enquiry — ${selectedPackage.textContent}`;
    const body = [
      `Package: ${selectedPackage.textContent}`,
      `Name: ${formData.get("name")}`,
      `Email: ${formData.get("email")}`,
      `Preferred date: ${formData.get("date") || "Flexible"}`,
      `Message: ${formData.get("message") || "No additional details"}`
    ].join("\n");

    window.location.href = `mailto:hello@ceylonodysseytravels.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    modal.close();
    bookingForm.reset();
  });

  // Dynamic copyright year.
  document.querySelector("#year").textContent = new Date().getFullYear();
});

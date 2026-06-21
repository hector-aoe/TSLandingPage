// =====================================================================
// THE SPOT — coming soon page behavior
// 1. Loads the right background video for the screen/connection
// 2. Handles the email + SMS signup form
// =====================================================================

(function () {
  const video = document.querySelector(".bg-video");
  const body = document.body;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prefersReducedData = navigator.connection && navigator.connection.saveData;

  if (prefersReducedMotion || prefersReducedData) {
    // Skip the video entirely — show the gradient fallback from style.css instead.
    body.classList.add("no-video");
  } else {
    loadVideo();
  }

  function loadVideo() {
    const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;

    // On phones, try a lighter mobile-cropped file first. If it doesn't
    // exist, this list quietly falls through to the next option until
    // one loads. You only NEED media/coming-soon.mp4 for this to work —
    // everything else is an optional speed boost. See README.md.
    const candidates = isSmallScreen
      ? [
          "media/coming-soon-mobile.webm",
          "media/coming-soon-mobile.mp4",
          "media/coming-soon.webm",
          "media/coming-soon.mp4",
        ]
      : ["media/coming-soon.webm", "media/coming-soon.mp4"];

    tryNext(0);

    function tryNext(i) {
      if (i >= candidates.length) {
        body.classList.add("no-video");
        return;
      }
      video.src = candidates[i];
      video.muted = true; // belt-and-suspenders — required for autoplay to be allowed
      video.load();
      attemptPlay();
      video.onerror = () => tryNext(i + 1);
    }

    function attemptPlay() {
      const playPromise = video.play();
      if (!playPromise || typeof playPromise.catch !== "function") return;

      playPromise.catch(() => {
        // Autoplay was blocked (common on first load on phones). Retry on
        // the visitor's very first tap/click anywhere on the page — that
        // user gesture is enough to satisfy the browser's autoplay rules.
        const retry = () => video.play().catch(() => {});
        document.addEventListener("click", retry, { once: true });
        document.addEventListener("touchstart", retry, { once: true });
      });
    }
  }

  // -------------------------------------------------------------------
  // Signup form (email + SMS notify-me)
  // -------------------------------------------------------------------

  const form = document.getElementById("signupForm");
  const status = document.getElementById("signupStatus");
  const emailInput = document.getElementById("email");
  const honeypot = document.getElementById("website");

  // Paste your form backend URL here once you have one — see README.md
  // for how to get one for free (Formspree, Getform, etc).
  const SIGNUP_ENDPOINT = "https://script.google.com/macros/s/AKfycbxfQE0mO_2xRY5WjAUF-CY2jJUXr3Tzh7FSZp1qHg1y6kp8QODoHvORuR9Q_29HXPVQ/exec";

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (honeypot && honeypot.value) {
      // Only a bot would have filled this in — pretend success and stop,
      // without ever hitting the real backend.
      status.textContent = "You're on the list. See you in the lineup.";
      form.reset();
      return;
    }

    if (!emailInput.checkValidity()) {
      status.textContent = "That email doesn't look right — give it another check.";
      emailInput.focus();
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    if (SIGNUP_ENDPOINT.startsWith("REPLACE")) {
      // No backend connected yet. Show a friendly placeholder confirmation
      // so the page still feels finished while you're testing it.
      console.warn("Signup form has no backend yet — see README.md to connect one.");
      status.textContent = "You're on the list. (Connect a real backend in README.md to start collecting signups.)";
      form.reset();
      submitButton.disabled = false;
      return;
    }

    try {
      const response = await fetch(SIGNUP_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data && data.result === "success") {
        status.textContent = "You're on the list. See you in the lineup.";
        form.reset();
      } else if (data && data.message) {
        // Real, specific message from the backend (e.g. rate-limited).
        status.textContent = data.message;
      } else {
        status.textContent = "Something went wrong — try again in a moment.";
      }
    } catch (err) {
      status.textContent = "Couldn't reach the server — check your connection and try again.";
    } finally {
      submitButton.disabled = false;
    }
  });
})();

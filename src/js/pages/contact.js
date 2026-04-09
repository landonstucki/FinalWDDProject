// contact.js
(() => {
  const statusEl = document.getElementById("formStatus");
  if (!statusEl) return;

  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const error = params.get("error");

  const errorMap = {
    spam: "Spam detected.",
    name: "Check your name.",
    email: "Check your email.",
    phone: "Check your phone.",
    message: "Message is too short.",
    send: "Email failed to send.",
  };

  if (status === "success") {
    statusEl.textContent = "Thanks! Your message was sent.";
    statusEl.className = "form-status success";
  } else if (status === "error") {
    statusEl.textContent =
      "Sorry — something went wrong. " +
      (errorMap[error] ? `(${errorMap[error]})` : "");
    statusEl.className = "form-status error";
  } else {
    statusEl.textContent = "";
    statusEl.className = "form-status";
  }
})();

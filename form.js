document.addEventListener("DOMContentLoaded", function () {
  // ✅ Initialize EmailJS with your public key
  emailjs.init("M2lRr_x79Js8PS2P1");

  // ✅ Get references to form elements
  const contactForm = document.getElementById("contactForm");
  const sendButton = document.getElementById("submit-form");
  const messageBox = document.getElementById("form-message");

  // ✅ Cooldown settings (prevents spamming)
  let lastSubmissionTime = 0;
  const SUBMISSION_COOLDOWN = 5000; // 5 seconds

  // ✅ Function to sanitize user input (prevent HTML injection)
  function sanitizeInput(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
  }

  // ✅ Handle button click (instead of traditional form submit)
  sendButton.addEventListener("click", function () {
    const currentTime = Date.now();

    // ⏳ Prevent repeated submissions within cooldown period
    if (currentTime - lastSubmissionTime < SUBMISSION_COOLDOWN) {
      messageBox.textContent =
        "⚠️ Please wait a few seconds before submitting again.";
      messageBox.style.color = "orange";
      return;
    }

    // 🔄 Update button state while sending
    sendButton.textContent = "Sending...";
    sendButton.disabled = true;

    // 📝 Collect and sanitize input values
    const userEmail = sanitizeInput(document.getElementById("email").value);
    const userMessage = sanitizeInput(document.getElementById("message").value);

    // ❌ Validate: Check if all fields are filled
    if (!userEmail || !userMessage) {
      messageBox.textContent = "⚠️ Please fill in all fields.";
      messageBox.style.color = "red";
      sendButton.textContent = "Send";
      sendButton.disabled = false;
      return;
    }

    // ❌ Validate: Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      messageBox.textContent = "⚠️ Please enter a valid email address.";
      messageBox.style.color = "red";
      sendButton.textContent = "Send";
      sendButton.disabled = false;
      return;
    }

    // 📦 Prepare parameters for EmailJS template
    const templateParams = {
      reply_to: userEmail,
      message: userMessage,
    };

    // 📤 Send email via EmailJS
    emailjs
      .send("service_c83zevc", "template_il4o8qx", templateParams)
      .then(() => {
        // ✅ Success feedback
        messageBox.textContent = "✅ Your message has been sent successfully!";
        messageBox.style.color = "green";
        contactForm.reset(); // Clear form fields
        lastSubmissionTime = currentTime; // Update last submission time
      })
      .catch((error) => {
        // ❌ Error feedback
        console.error("EmailJS error:", error);
        messageBox.textContent =
          "❌ Failed to send message. Please check your EmailJS settings.";
        messageBox.style.color = "red";
      })
      .finally(() => {
        // 🔄 Reset button state
        sendButton.textContent = "Send";
        sendButton.disabled = false;
      });
  });
});



const form = document.getElementById("form");
const submitBtn = document.getElementById("submit-btn");
const successBox = document.getElementById("success");
const progressBox = document.querySelector(".progress");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const mobileInput = document.getElementById("mobile");
const ageInput = document.getElementById("age");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm");


const fields = [
  { input: nameInput, error: document.getElementById("name-error"), check: checkName, checked: false },
  { input: emailInput, error: document.getElementById("email-error"), check: checkEmail, checked: false },
  { input: mobileInput, error: document.getElementById("mobile-error"), check: checkMobile, checked: false },
  { input: ageInput, error: document.getElementById("age-error"), check: checkAge, checked: false },
  { input: passwordInput, error: document.getElementById("password-error"), check: checkPassword, checked: false },
  { input: confirmInput, error: document.getElementById("confirm-error"), check: checkConfirm, checked: false }
];


function checkName() {
  const value = nameInput.value.trim();
  if (value === "") {
    return "Please enter your full name.";
  }

  if (!/^[A-Za-z][A-Za-z' -]*$/.test(value)) {
    return "Name can only have letters, spaces, apostrophes and hyphens.";
  }
  return "";
}

function checkEmail() {
  const value = emailInput.value.trim();
  if (value === "") {
    return "Please enter your email address.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter a valid email, like name@example.com.";
  }
  return "";
}

function checkMobile() {
  const value = mobileInput.value.trim();
  if (value === "") {
    return "Please enter your mobile number.";
  }
  if (!/^[0-9]+$/.test(value)) {
    return "Mobile number can only contain digits.";
  }
  if (value.length !== 10) {
    return "Mobile number must be exactly 10 digits.";
  }
  if (!/^[6-9]/.test(value)) {
    return "Mobile number must start with 6, 7, 8 or 9.";
  }
  return "";
}

function checkAge() {
  const value = ageInput.value.trim();
  if (value === "") {
    return "Please enter your age.";
  }

  if (!/^[0-9]+$/.test(value)) {
    return "Age must be a whole number.";
  }
  const age = Number(value);
  if (age < 18 || age > 100) {
    return "Age must be between 18 and 100.";
  }
  return "";
}

function checkPassword() {
  const value = passwordInput.value;
  if (value === "") {
    return "Please enter a password.";
  }
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);
  if (value.length < 8 || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    return "Password needs 8+ characters with an uppercase letter, a lowercase letter, a number and a special character.";
  }
  return "";
}

function checkConfirm() {
  if (confirmInput.value === "") {
    return "Please confirm your password.";
  }
  if (confirmInput.value !== passwordInput.value) {
    return "Passwords do not match.";
  }
  return "";
}


function validateField(field) {
  const message = field.check();
  field.error.textContent = message;

  if (message === "") {
    field.input.classList.remove("invalid");
    field.input.classList.add("valid");
    field.input.setAttribute("aria-invalid", "false");
    return true;
  } else {
    field.input.classList.add("invalid");
    field.input.classList.remove("valid");
    field.input.setAttribute("aria-invalid", "true");
    return false;
  }
}

function updateProgress() {
  let done = 0;
  for (const field of fields) {
    if (field.check() === "") {
      done++;
    }
  }
  document.getElementById("bar-fill").style.width = (done / fields.length) * 100 + "%";
  document.getElementById("progress-text").textContent = done + " of 6 fields complete";
}

function updateStrength() {
  const value = passwordInput.value;
  const meter = document.getElementById("meter");
  const label = document.getElementById("meter-label");


  let points = 0;
  if (value.length >= 8) points++;
  if (/[A-Z]/.test(value)) points++;
  if (/[a-z]/.test(value)) points++;
  if (/[0-9]/.test(value)) points++;
  if (/[^A-Za-z0-9]/.test(value)) points++;

  if (value === "") {
    meter.setAttribute("data-level", "0");
    label.textContent = "";
  } else if (points <= 2) {
    meter.setAttribute("data-level", "1");
    label.textContent = "Strength: Weak";
  } else if (points <= 4) {
    meter.setAttribute("data-level", "2");
    label.textContent = "Strength: Medium";
  } else {
    meter.setAttribute("data-level", "3");
    label.textContent = "Strength: Strong";
  }
}


for (const field of fields) {

  field.input.addEventListener("blur", function () {
    field.checked = true;
    validateField(field);
  });

  field.input.addEventListener("input", function () {
    if (field.checked) {
      validateField(field);
    }
    updateProgress();
  });
}

nameInput.addEventListener("input", function () {
  document.getElementById("name-count").textContent = nameInput.value.length + "/50";
});

passwordInput.addEventListener("input", function () {
  updateStrength();
  const confirmField = fields[5];
  if (confirmField.checked || confirmInput.value !== "") {
    confirmField.checked = true;
    validateField(confirmField);
  }
});


const toggleButtons = document.querySelectorAll(".toggle");
for (const button of toggleButtons) {
  button.addEventListener("click", function () {
    const input = document.getElementById(button.getAttribute("data-target"));
    if (input.type === "password") {
      input.type = "text";
      button.setAttribute("aria-pressed", "true");
    } else {
      input.type = "password";
      button.setAttribute("aria-pressed", "false");
    }
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let firstInvalid = null;
  for (const field of fields) {
    field.checked = true;
    const isValid = validateField(field);
    if (!isValid && firstInvalid === null) {
      firstInvalid = field.input;
    }
  }

  if (firstInvalid !== null) {
    firstInvalid.focus();
    return;
  }

  form.hidden = true;
  progressBox.hidden = true;
  successBox.hidden = false;
  successBox.focus();
});

function resetForm() {
  form.reset();
  for (const field of fields) {
    field.checked = false;
    field.error.textContent = "";
    field.input.classList.remove("invalid", "valid");
    field.input.removeAttribute("aria-invalid");
  }
  for (const button of toggleButtons) {
    document.getElementById(button.getAttribute("data-target")).type = "password";
    button.setAttribute("aria-pressed", "false");
  }
  form.hidden = false;
  progressBox.hidden = false;
  successBox.hidden = true;
  document.getElementById("name-count").textContent = "0/50";
  updateStrength();
  updateProgress();
}

document.getElementById("reset-btn").addEventListener("click", resetForm);
document.getElementById("again-btn").addEventListener("click", resetForm);
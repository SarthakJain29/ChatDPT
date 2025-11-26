const input = document.getElementById("input");
const chatContainer = document.getElementById("chatContainer");
const askBtn = document.getElementById("ask");

input?.addEventListener("keyup", handleEnter);
askBtn.addEventListener("click", handleAsk);

function generate(text) {
  // 1. append msg to ui
  // 2. send it to the llm
  // 3. append response to ui
  const msg = document.createElement("div");
  msg.textContent = text;
  msg.className = "my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit";
  chatContainer.appendChild(msg);
  input.value = "";
}

function handleAsk(e) {
  const text = input.value.trim();
  if (!text) {
    return;
  }
  generate(text);
}

function handleEnter(e) {
  if (e.key === "Enter") {
    const text = input.value.trim();
    if (!text) {
      return;
    }
    generate(text);
  }
}

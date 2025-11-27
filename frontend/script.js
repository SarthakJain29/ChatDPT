const input = document.getElementById("input");
const chatContainer = document.getElementById("chatContainer");
const askBtn = document.getElementById("ask");

//generating an unique session id
const threadId = Date.now().toString(36) + Math.random().toString(36).substring(2,8);  

input?.addEventListener("keyup", handleEnter);
askBtn.addEventListener("click", handleAsk);

const loading = document.createElement('div');
loading.className = 'my-6 animate-pulse'
loading.textContent = "Thinking..."

async function generate(text) {
  // 1. append msg to ui
  // 2. send it to the llm
  // 3. append response to ui
  const msg = document.createElement("div");
  msg.textContent = text;
  msg.className = "my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit";
  chatContainer.appendChild(msg);
  input.value = "";

  chatContainer.appendChild(loading);  

  const assistantResponse = await callServer(text);

  const assistantMsg = document.createElement("div");
  assistantMsg.textContent = assistantResponse;
  assistantMsg.className = "max-w-fit";
  loading.remove();
  chatContainer.appendChild(assistantMsg);
}

async function callServer(inputText) {
  const response = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ threadId, message: inputText }),
  });

  if (!response.ok) {
    throw new Error("Error generating the response");
  }

  const result = await response.json();
  return result.message;
}

async function handleAsk(e) {
  const text = input.value.trim();
  if (!text) {
    return;
  }
  await generate(text);
}

async function handleEnter(e) {
  if (e.key === "Enter") {
    const text = input.value.trim();
    if (!text) {
      return;
    }
    await generate(text);
  }
}

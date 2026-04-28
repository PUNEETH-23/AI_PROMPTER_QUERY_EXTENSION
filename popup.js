const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const saveBtn = document.getElementById("saveBtn");

const inputText = document.getElementById("inputText");
const mode = document.getElementById("mode");
const output = document.getElementById("output");

// Generate Prompt
generateBtn.addEventListener("click", () => {
  const input = inputText.value.trim();

  if (!input) {
    output.value = "Please enter a topic.";
    return;
  }

  output.value = "Generating...";

  chrome.runtime.sendMessage(
    {
      type: "GENERATE_PROMPT",
      input: input,
      mode: mode.value
    },
    (response) => {
      if (chrome.runtime.lastError) {
        output.value = "Extension error. Reload extension.";
        return;
      }

      if (response && response.success) {
        output.value = response.output;
      } else {
        output.value = "Error: " + (response?.error || "Unknown error");
      }
    }
  );
});

// Copy
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(output.value);
});

// Save
saveBtn.addEventListener("click", () => {
  const prompt = output.value;

  if (!prompt) return;

  chrome.storage.local.get(["savedPrompts"], (result) => {
    const prompts = result.savedPrompts || [];
    prompts.push(prompt);

    chrome.storage.local.set({ savedPrompts: prompts }, () => {
      alert("Prompt saved!");
    });
  });
});
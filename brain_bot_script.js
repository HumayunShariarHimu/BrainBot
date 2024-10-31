const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

// brlink
const brLink = document.createElement("a");
brLink.textContent = "Discovery Mind!";
brLink.href = "https://www.discoverymind.xyz";
brLink.style.color = "red";
brLink.target = "_blank";
brLink.style.textDecoration = "none";
let userText = null;
const API_KEY = "your-api-key-here"; // Replace with your OpenAI API key

let predefinedQA = {};

// Load predefined questions and answers from file
const loadQuestions = async () => {
  try {
    const response = await fetch("/question.txt");
    const data = await response.text();
    const lines = data.split("\n");
    lines.forEach((line) => {
      const [question, answer] = line.split("::");
      if (question && answer) {
        predefinedQA[question.trim()] = answer.trim();
      }
    });
    // Load second file (question_question_one.txt)
    const response1 = await fetch("./question_one.txt");
    const data1 = await response1.text();
    const lines1 = data1.split("\n");

    lines1.forEach((line) => {
      const [question, answer] = line.split("::");
      if (question && answer) {
        const trimmedQuestion = question.trim();
        const trimmedAnswer = answer.trim();

        // Assuming the answer is a URL that you want to convert into a hyperlink
        const linkElement = `<a href="${trimmedAnswer}" target="_blank">${trimmedAnswer}</a>`;

        // Display the question with the hyperlink answer
        predefinedQA[trimmedQuestion] = linkElement;
      }
    });
  } catch (error) {
    console.error("Error loading questions:", error);
  }
};

// Set default chat text when starting
const setDefaultChatText = () => {
  const defaultText = `<div class="default-text">
    <a class="BrainBot" href="https://humayunshariarhimu.github.io/BrainBot" target="_blank"><img src="https://raw.githubusercontent.com/HumayunShariarHimu/BrainBot/refs/heads/main/favicon.png" alt="BrainBot" width="100px;" height="100px"></a>
                            <h1 class="rainbowText">BrainBot</h1>
                            <b><p class="rainbowText">A Psychological Bot of Discovery Mind</p></b>
                            <p class="rainbowText">Find Your Psychological Fact By Typing Keyword & Enter the Link to Enjoy on Discovery Mind!</p>
                        </div>`;

  chatContainer.innerHTML = defaultText;
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

// Create a chat element
const createChatElement = (content, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = content;
  return chatDiv;
};

// Play a random audio file with a timeout to stop after 10 seconds
let currentAudio = null;

const playRandomAudio = () => {
  const audioFiles = [
    "https://github.com/HumayunShariarHimu/BrainBot/raw/refs/heads/main/alpha.ogg",
    "https://github.com/HumayunShariarHimu/BrainBot/raw/refs/heads/main/beta.ogg",
    "https://github.com/HumayunShariarHimu/BrainBot/raw/refs/heads/main/delta.ogg",
    "https://github.com/HumayunShariarHimu/BrainBot/raw/refs/heads/main/gamma.ogg",
    "https://github.com/HumayunShariarHimu/BrainBot/raw/refs/heads/main/theta.ogg",
    // Add more audio files as needed
  ];

  // Stop the current audio if it's playing
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const randomIndex = Math.floor(Math.random() * audioFiles.length);
  currentAudio = new Audio(audioFiles[randomIndex]);
  currentAudio.play();

  // Stop audio after 60 seconds
  setTimeout(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
  }, 60000); // 60 seconds (60000 milliseconds)
};
// Function to get chatbot response
const getChatResponse = async (incomingChatDiv) => {
  const API_URL = "https://api.openai.com/v1/completions";
  const pElement = document.createElement("p");

  pElement.textContent = `Oops! Something went Wrong! Please select your specific Topic by typing Keyword OR You can just type ★ to shown All content Otherwise Go to `;
  pElement.appendChild(brLink);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: userText,
      max_tokens: 2048,
      temperature: 0.2,
      n: 1,
      stop: null,
    }),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    pElement.textContent = data.choices[0].text.trim();
    playRandomAudio(); // Play audio after receiving response
  } catch (error) {
    pElement.classList.add("error");

    // pElement.textContent = fullText;
  }

  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

// Function to copy response text
const copyResponse = (copyBtn) => {
  const responseTextElement = copyBtn.parentElement.querySelector("p");
  navigator.clipboard.writeText(responseTextElement.textContent);
  copyBtn.textContent = "done";
  setTimeout(() => (copyBtn.textContent = "content_copy"), 1000);
};

// Function to show typing animation
const showTypingAnimation = () => {
  const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="https://raw.githubusercontent.com/HumayunShariarHimu/BrainBot/refs/heads/main/BrainBot.png" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;
  const incomingChatDiv = createChatElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  getChatResponse(incomingChatDiv);
};

// Handle outgoing chat interaction
const handleOutgoingChat = () => {
  userText = chatInput.value.trim();
  if (!userText) return;

  chatInput.value = "";
  chatInput.style.height = `${initialInputHeight}px`;

  const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="https://raw.githubusercontent.com/HumayunShariarHimu/BrainBot/refs/heads/main/HumayunShariarHimu.png" alt="user-img">
                        <p class="usertext">${userText}</p>
                    </div>
                </div>`;

  const outgoingChatDiv = createChatElement(html, "outgoing");
  chatContainer.querySelector(".default-text")?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);

  setTimeout(() => {
    const responseText = predefinedQA[userText];
    if (responseText) {
      const incomingHtml = `<div class="chat-content">
                                    <div class="chat-details">
                                        <img src="https://raw.githubusercontent.com/HumayunShariarHimu/BrainBot/refs/heads/main/BrainBot.png" alt="chatbot-img">
                                        <p>${responseText}</p>
                                    </div>
                                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                                  </div>`;
      const incomingChatDiv = createChatElement(incomingHtml, "incoming");
      chatContainer.appendChild(incomingChatDiv);
      chatContainer.scrollTo(0, chatContainer.scrollHeight);
      playRandomAudio(); // Call audio play function after appending response
    } else {
      showTypingAnimation();
    }
  }, 500);
};

// Function to show keyword suggestions
const showSuggestions = () => {
  const suggestionsContainer = document.querySelector(".suggestions-container");
  suggestionsContainer.innerHTML = ""; // Clear previous suggestions
  const userInput = chatInput.value.toLowerCase();
  if (!userInput) return;

  const matchingQuestions = Object.keys(predefinedQA).filter((question) =>
    question.toLowerCase().includes(userInput)
  );

  matchingQuestions.forEach((question) => {
    const suggestionDiv = document.createElement("div");
    suggestionDiv.classList.add("suggestion");
    suggestionDiv.textContent = question;
    suggestionDiv.addEventListener("click", () => {
      chatInput.value = question;
      suggestionsContainer.innerHTML = ""; // Clear suggestions after selecting one
    });
    suggestionsContainer.appendChild(suggestionDiv);
  });
};

// Event listener for delete button
deleteButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all the chats?")) {
    setDefaultChatText();
  }
});

// Event listener for theme button
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

// Input event listener for adjusting input height and showing suggestions
chatInput.addEventListener("input", () => {
  chatInput.style.height = `${initialInputHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
  showSuggestions(); // Show keyword suggestions as user types
});

// Keydown event listener for handling enter key press
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleOutgoingChat();
  }
});

// Load questions and set default chat text
loadQuestions().then(() => {
  setDefaultChatText();
  sendButton.addEventListener("click", handleOutgoingChat);
});

// Function to handle translation (dummy function, replace with actual translation logic)
const translateToEnglish = () => {
  // Example: Translate all text inside .chat-container to English
  const chatElements = document.querySelectorAll(".chat p");
  chatElements.forEach((element) => {
    // Dummy translation logic: Replace with actual translation API usage
    element.textContent = "Translation Not Available";
    element.style.color = "#E55865";
  });
};

// Event listener for translate button
const translateButton = document.querySelector("#translate-btn");
translateButton.addEventListener("click", translateToEnglish);

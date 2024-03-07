const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.getElementById("send-btn");
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY = "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";

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application.json",
            "Authorization" : 'Bearer ${API_KEY}'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages:[{role: "user", content: userMessage}]
        })
    }

    fetch(API_URL,requestOptions).then(res => res.json()).then(data =>{
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) =>{
        messageElement.textContent = "Oops! Something went wrong.Please try again."
    })
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming")
        chatbox.appendChild(incomingChatLi);
        generateResponse(incomingChatLi);
    },600);
    
    // Clear the input after sending the message
    chatInput.value = "";

    // Scroll to the bottom of the chatbox
    chatbox.scrollTop = chatbox.scrollHeight;
}

sendChatBtn.addEventListener("click", handleChat);

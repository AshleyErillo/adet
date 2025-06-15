// Global variables
let chatStarted = false;
let currentChatId = null;
let chatHistory = [];
let chatCounter = 0;

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const welcomeSection = document.getElementById('welcomeSection');
const typingIndicator = document.getElementById('typingIndicator');
const sidebar = document.getElementById('sidebar');
const historyList = document.getElementById('historyList');
const sidebarToggle = document.getElementById('sidebarToggle');
const newChatBtn = document.getElementById('newChatBtn');

// Enhanced severe condition detection with multiple severity levels
const severeConditions = {
    criticalEmergency: [
        'bloat', 'GDV', 'gastric dilatation', 'torsion', 'twisted stomach',
        'seizure', 'convulsion', 'fitting', 'epileptic attack', 'status epilepticus',
        'poisoning', 'poison', 'toxic', 'toxicity', 'ingested poison', 'ate poison',
        'difficulty breathing', 'can\'t breathe', 'gasping', 'choking', 'respiratory distress',
        'unconscious', 'unresponsive', 'collapsed', 'coma', 'won\'t wake up',
        'severe bleeding', 'blood loss', 'hemorrhage', 'bleeding out', 'massive bleeding',
        'heatstroke', 'heat exhaustion', 'overheating', 'hyperthermia',
        'broken bone', 'fracture', 'dislocation', 'compound fracture',
        'eye injury', 'eye trauma', 'vision loss', 'eye puncture', 'blind',
        'spinal injury', 'paralysis', 'can\'t move legs', 'back injury',
        'hit by car', 'vehicle accident', 'trauma', 'fell from height',
        'blue gums', 'white gums', 'pale gums', 'cold to touch'
    ],
    
    severeDiseases: [
        'parvo', 'parvovirus', 'distemper', 'rabies', 'rabid',
        'heartworm', 'cancer', 'tumor', 'malignant', 'lymphoma',
        'kidney failure', 'renal failure', 'liver failure', 'heart failure',
        'diabetes', 'diabetic', 'hypoglycemia', 'insulin shock', 'diabetic coma',
        'urinary blockage', 'bladder obstruction', 'blocked', 'can\'t urinate',
        'pancreatitis', 'gastric torsion', 'intestinal blockage', 'obstruction',
        'pyometra', 'uterine infection', 'sepsis', 'blood poisoning'
    ],
    
    urgentSymptoms: [
        'vomiting blood', 'bloody vomit', 'blood in stool', 'bloody diarrhea',
        'severe diarrhea', 'continuous vomiting', 'won\'t stop vomiting',
        'extreme lethargy', 'completely lethargic', 'won\'t move',
        'high fever', 'burning up', 'very hot', 'shivering uncontrollably',
        'severe pain', 'excruciating pain', 'screaming in pain', 'crying in pain',
        'swollen abdomen', 'distended belly', 'bloated stomach',
        'labored breathing', 'panting heavily', 'wheezing', 'coughing blood'
    ]
};

// Enhanced response database with more categories
const petHealthResponses = {
    greetings: [
        "Hello! I'm your PetHealth AI assistant. How can I help you with your furry friend today?",
        "Hi there! I'm here to help with any questions about your pet's health and wellbeing.",
        "Welcome! Tell me about your pet and how I can assist you today.",
        "Hello! I'm ready to help you take the best care of your pet. What's on your mind?",
        "Hi! Whether it's health, nutrition, or behavior questions, I'm here to help with your pet!"
    ],
    
    criticalEmergency: [
        "🚨 CRITICAL EMERGENCY 🚨\n\nThis is a life-threatening situation! Stop reading and call your emergency vet NOW or rush to the nearest animal hospital immediately!\n\n⚡ URGENT ACTIONS:\n• Call ahead while driving there\n• Keep your pet calm and still\n• Don't give food, water, or medications\n• Handle very gently\n• Note exact time symptoms started\n• Bring all current medications\n\n⏰ TIME IS CRITICAL - Every minute counts!",
        
        "🚨 IMMEDIATE EMERGENCY 🚨\n\nWhat you're describing requires IMMEDIATE professional intervention. Please go to an emergency veterinary clinic RIGHT NOW!\n\n🆘 BEFORE YOU LEAVE:\n• Call the clinic to alert them you're coming\n• Keep your pet warm but not hot\n• Monitor breathing and pulse\n• Don't attempt home treatment\n• Gather medical records quickly\n• Drive safely but urgently\n\n⚠️ This cannot wait - seek help immediately!",
        
        "🚨 VETERINARY EMERGENCY 🚨\n\nI'm very concerned about these symptoms - this requires emergency veterinary care WITHOUT DELAY!\n\n🏥 EMERGENCY STEPS:\n• Contact emergency vet clinic NOW\n• Prepare pet carrier or blanket stretcher\n• Stay calm - your pet needs you focused\n• Don't give anything by mouth\n• Note any symptom changes\n• Remove hazards from pet's area\n\n📞 Call them while someone else drives!"
    ],
    
    severe: [
        "This sounds very serious and needs urgent veterinary attention. While not immediately life-threatening, these symptoms require professional care soon.\n\n🏥 IMPORTANT ACTIONS:\n• Contact your vet within the next few hours\n• Monitor symptoms closely for any worsening\n• Keep your pet comfortable and quiet\n• Note when symptoms started and any triggers\n• Don't wait if symptoms get worse\n• Prepare to visit the vet today if possible\n\n📋 Keep a symptom log to help your vet diagnose.",
        
        "I'm concerned about what you're describing. These symptoms suggest a condition that needs veterinary evaluation soon, though not necessarily emergency care.\n\n⚕️ RECOMMENDED STEPS:\n• Schedule a vet appointment today if possible\n• Monitor your pet's condition carefully\n• Ensure they stay hydrated and comfortable\n• Restrict activity until evaluated\n• Document all symptoms and timing\n• Call your vet if symptoms worsen\n\n🔍 Early intervention often leads to better outcomes."
    ],
    
    health: [
        "I understand you're concerned about your pet's health. Can you describe the specific symptoms you've noticed? This will help me provide better guidance. Remember, persistent or worsening symptoms always warrant a vet visit.",
        
        "Pet health concerns should be taken seriously. While I can provide general guidance, a veterinary examination is often the best way to get accurate diagnosis and treatment. What specific symptoms have you observed?",
        
        "I'm here to help with general pet health information. What specific symptoms or behaviors have you observed? Please also let me know your pet's species, age, and breed if possible - this helps me give more targeted advice.",
        
        "Health changes in pets can have many causes. To better assist you, could you describe: What symptoms you've noticed? When they started? Your pet's eating, drinking, and energy levels? Any recent changes in routine?"
    ],
    
    nutrition: [
        "Great question about pet nutrition! A balanced diet is crucial for your pet's health. What type of pet do you have, their age, size, and any current health conditions? This helps me provide specific dietary guidance.",
        
        "Nutrition plays a vital role in pet health. The best diet depends on species, age, size, activity level, and health status. Are you asking about general nutrition, specific dietary concerns, or feeding problems?",
        
        "Proper nutrition is key to a healthy pet! Different life stages and health conditions require different nutritional approaches. Tell me more about your pet and their current diet situation.",
        
        "Pet nutrition can be complex with so many food options available. What specific nutritional guidance are you looking for? General diet advice, weight management, special dietary needs, or feeding schedules?"
    ],
    
    exercise: [
        "Exercise is essential for your pet's physical and mental health! Requirements vary greatly by species, breed, age, and health status. What kind of pet do you have and what's their current activity level?",
        
        "Regular exercise keeps pets healthy and happy! Dogs typically need daily walks and playtime, cats benefit from interactive play, and other pets have their own needs. What exercise questions do you have?",
        
        "Exercise needs are very individual. A young Border Collie needs much more activity than a senior Pug, for example. Can you tell me about your pet's breed, age, current fitness level, and any physical limitations?"
    ],
    
    emergency: [
        "If you believe your pet is experiencing a medical emergency, please contact your veterinarian or emergency animal hospital immediately. I can provide general guidance, but emergency situations require professional care.",
        
        "For urgent health concerns, please seek immediate veterinary care. Common emergency signs include difficulty breathing, severe bleeding, unconsciousness, extreme lethargy, or signs of severe pain.",
        
        "Emergency situations require immediate professional attention. Don't hesitate to contact your vet or emergency animal hospital if your pet is in distress. It's always better to be safe than sorry."
    ],
    
    vaccination: [
        "Vaccinations are crucial for preventing serious diseases! Core vaccines protect against the most dangerous conditions, while non-core vaccines depend on lifestyle and risk factors. What vaccination questions do you have?",
        
        "Keeping up with vaccinations helps protect your pet from preventable diseases. Puppies and kittens need a series of initial vaccines, while adults need regular boosters. What's your pet's vaccination status?",
        
        "Regular vaccinations are one of the best investments in your pet's health. The schedule varies by species, age, and risk factors. Have you discussed a vaccination plan with your veterinarian?"
    ],
    
    grooming: [
        "Regular grooming is important for health and comfort! Grooming needs vary dramatically by breed and coat type. Long-haired breeds need daily brushing, while short-haired pets need less frequent care. What grooming questions do you have?",
        
        "Proper grooming prevents skin issues, matting, and other health problems. It's also a great way to bond with your pet and check for health changes. What specific grooming guidance are you looking for?",
        
        "Grooming isn't just about appearance - it's essential for health! Regular brushing, nail trims, ear cleaning, and dental care all contribute to wellbeing. Tell me about your pet's grooming needs!"
    ],
    
    behavior: [
        "Pet behavior often reflects their health and wellbeing. Sudden behavior changes can indicate medical issues, stress, or environmental factors. What behavioral changes have you noticed and when did they start?",
        
        "Understanding your pet's behavior helps ensure they're happy and healthy. Changes in behavior patterns should always be evaluated, as they can signal underlying problems. Can you describe what you've observed?",
        
        "Behavioral issues sometimes have medical causes, so it's important to rule out health problems first. What specific behaviors are concerning you, and have there been any other changes in routine, environment, or health?"
    ],
    
    preventive: [
        "Preventive care is the best way to keep your pet healthy! This includes regular vet checkups, vaccinations, parasite prevention, dental care, and proper nutrition. What preventive care questions do you have?",
        
        "An ounce of prevention is worth a pound of cure! Regular wellness exams can catch problems early when they're easier and less expensive to treat. When was your pet's last checkup?"
    ],
    
    senior: [
        "Senior pets have special health needs as they age. Regular checkups become even more important, and you might notice changes in mobility, appetite, or behavior. How old is your pet and what changes have you noticed?",
        
        "Aging pets benefit from modified care including more frequent vet visits, adjusted exercise routines, specialized diets, and careful monitoring for age-related conditions. What senior pet concerns do you have?"
    ],
    
    puppy_kitten: [
        "Puppies and kittens have special needs during their rapid growth phase! This includes vaccination series, socialization, training, proper nutrition, and frequent health monitoring. How old is your young pet?",
        
        "Young pets require extra attention to set them up for a healthy life. This includes proper nutrition, vaccination schedules, socialization, and establishing good routines. What questions do you have about your puppy or kitten?"
    ]
};

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
    loadChatHistory();
    
    // Add event listeners
    sidebarToggle.addEventListener('click', toggleSidebar);
    newChatBtn.addEventListener('click', startNewChat);
    
    // Add click events to action cards
    document.querySelectorAll('.action-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            const messages = [
                "My pet seems unwell",
                "What should I feed my pet?",
                "How often should I exercise my dog?",
                "When should I take my pet to the vet?"
            ];
            startChat(messages[index]);
        });
    });
});

// Initialize chat functionality
function initializeChat() {
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    messageInput.focus();
    
    messageInput.addEventListener('input', function() {
        sendButton.disabled = this.value.trim() === '';
        
        // Auto-resize textarea based on content
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    
    sendButton.addEventListener('click', sendMessage);
    sendButton.disabled = true;
}

// Sidebar functionality
function toggleSidebar() {
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
    } else {
        sidebar.classList.toggle('collapsed');
    }
}

// Start new chat
function startNewChat() {
    if (chatStarted && currentChatId) {
        saveChatToHistory();
    }
    
    chatStarted = false;
    currentChatId = null;
    chatMessages.innerHTML = '';
    welcomeSection.style.display = 'block';
    chatMessages.style.display = 'none';
    messageInput.focus();
    
    // Reset input height
    messageInput.style.height = 'auto';
    
    document.querySelectorAll('.history-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }
}

// Save chat to history
function saveChatToHistory() {
    if (!chatStarted || !currentChatId) return;
    
    const messages = Array.from(chatMessages.children).map(msg => {
        const isUser = msg.classList.contains('user');
        const content = msg.querySelector('.message-content').textContent;
        const time = msg.querySelector('.message-time').textContent;
        return { isUser, content, time };
    });
    
    if (messages.length === 0) return;
    
    const firstUserMessage = messages.find(msg => msg.isUser);
    const title = firstUserMessage ? firstUserMessage.content : 'New Chat';
    
    const existingChatIndex = chatHistory.findIndex(chat => chat.id === currentChatId);
    const chatData = {
        id: currentChatId,
        title: title.length > 50 ? title.substring(0, 50) + '...' : title,
        messages: messages,
        timestamp: new Date().toISOString(),
        lastUpdated: new Date().toLocaleString()
    };
    
    if (existingChatIndex >= 0) {
        chatHistory[existingChatIndex] = chatData;
    } else {
        chatHistory.unshift(chatData);
    }
    
    if (chatHistory.length > 20) {
        chatHistory = chatHistory.slice(0, 20);
    }
    
    renderChatHistory();
}

// Load chat from history
function loadChatFromHistory(chatId) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;
    
    if (chatStarted && currentChatId && currentChatId !== chatId) {
        saveChatToHistory();
    }
    
    currentChatId = chatId;
    chatStarted = true;
    
    chatMessages.innerHTML = '';
    
    chat.messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.isUser ? 'user' : 'bot'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.style.whiteSpace = 'pre-wrap'; // Preserve line breaks
        messageContent.textContent = msg.content;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = msg.time;
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        chatMessages.appendChild(messageDiv);
    });
    
    welcomeSection.style.display = 'none';
    chatMessages.style.display = 'block';
    
    document.querySelectorAll('.history-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-chat-id="${chatId}"]`)?.classList.add('active');
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }
    
    messageInput.focus();
}

// Render chat history
function renderChatHistory() {
    historyList.innerHTML = '';
    
    if (chatHistory.length === 0) {
        historyList.innerHTML = '<div style="color: #B0C4C7; font-size: 12px; text-align: center; padding: 2rem; opacity: 0.7;">No chat history yet</div>';
        return;
    }
    
    chatHistory.forEach(chat => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.setAttribute('data-chat-id', chat.id);
        historyItem.addEventListener('click', () => loadChatFromHistory(chat.id));
        
        if (chat.id === currentChatId) {
            historyItem.classList.add('active');
        }
        
        historyItem.innerHTML = `
            <div class="history-item-title">${chat.title}</div>
            <div class="history-item-time">${chat.lastUpdated}</div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

function loadChatHistory() {
    renderChatHistory();
}

// Start chat with predefined message
function startChat(message) {
    if (!chatStarted) {
        currentChatId = 'chat_' + Date.now();
        welcomeSection.style.display = 'none';
        chatMessages.style.display = 'block';
        chatStarted = true;
    }
    
    messageInput.value = message;
    sendMessage();
}

// Send message function
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    if (!chatStarted) {
        currentChatId = 'chat_' + Date.now();
        welcomeSection.style.display = 'none';
        chatMessages.style.display = 'block';
        chatStarted = true;
    }

    addMessage(message, 'user');
    messageInput.value = '';
    messageInput.style.height = 'auto'; // Reset input height
    messageInput.disabled = true;
    sendButton.disabled = true;

    showTypingIndicator();

    // Vary response time based on message complexity
    const responseTime = message.length > 100 ? 2000 + Math.random() * 1500 : 1500 + Math.random() * 1000;

    setTimeout(() => {
        hideTypingIndicator();
        const botResponse = generateResponse(message);
        addMessage(botResponse, 'bot');
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
        
        if (chatStarted && currentChatId) {
            saveChatToHistory();
        }
    }, responseTime);
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.style.whiteSpace = 'pre-wrap'; // Preserve line breaks and formatting
    messageContent.textContent = text;
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = new Date().toLocaleTimeString([], {
        hour: '2-digit', 
        minute: '2-digit'
    });
    
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    chatMessages.appendChild(messageDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    typingIndicator.style.display = 'flex';
    setTimeout(() => {
        typingIndicator.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Hide typing indicator
function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

// Enhanced severity detection with multiple levels
function detectSeverityLevel(message) {
    const originalMessage = message;
    const lowerMessage = message.toLowerCase();
    
    // Critical Emergency - highest priority
    for (let symptom of severeConditions.criticalEmergency) {
        if (originalMessage.includes(symptom) || lowerMessage.includes(symptom.toLowerCase())) {
            return 'critical';
        }
    }
    
    // Severe diseases
    for (let disease of severeConditions.severeDiseases) {
        if (originalMessage.includes(disease) || lowerMessage.includes(disease.toLowerCase())) {
            return 'critical';
        }
    }
    
    // Urgent symptoms
    for (let symptom of severeConditions.urgentSymptoms) {
        if (originalMessage.includes(symptom) || lowerMessage.includes(symptom.toLowerCase())) {
            return 'severe';
        }
    }
    
    // Critical emergency patterns
    const criticalPatterns = [
        /\b(not breathing|stopped breathing|gasping for air|turning blue)\b/i,
        /\b(massive bleeding|blood everywhere|won't stop bleeding|bleeding heavily)\b/i,
        /\b(ate poison|poisoned|toxic substance|chocolate|xylitol|antifreeze)\b/i,
        /\b(hit by car|vehicle accident|fell from height|major trauma)\b/i,
        /\b(won't wake up|completely unresponsive|unconscious|coma)\b/i,
        /\b(severe pain|excruciating pain|screaming in pain|howling in pain)\b/i,
        /\b(twisted stomach|bloated stomach|distended abdomen|hard belly)\b/i,
        /\b(blue gums|white gums|very pale|cold to touch)\b/i
    ];
    
    if (criticalPatterns.some(pattern => pattern.test(message))) {
        return 'critical';
    }
    
    // Severe but not immediately critical patterns
    const severePatterns = [
        /\b(vomiting blood|bloody vomit|blood in stool|bloody diarrhea)\b/i,
        /\b(severe diarrhea|continuous vomiting|won't stop vomiting)\b/i,
        /\b(extreme lethargy|won't move|completely lethargic)\b/i,
        /\b(high fever|burning up|shivering uncontrollably)\b/i,
        /\b(labored breathing|panting heavily|wheezing|difficulty breathing)\b/i,
        /\b(swollen abdomen|distended belly|bloated)\b/i
    ];
    
    if (severePatterns.some(pattern => pattern.test(message))) {
        return 'severe';
    }
    
    return 'normal';
}

// Enhanced response generation with better categorization
function generateResponse(message) {
    const lowerMessage = message.toLowerCase();
    const severityLevel = detectSeverityLevel(message);
    
    // Handle severity levels first
    if (severityLevel === 'critical') {
        return getRandomResponse(petHealthResponses.criticalEmergency);
    }
    
    if (severityLevel === 'severe') {
        return getRandomResponse(petHealthResponses.severe);
    }
    
    // Age-specific responses
    if (/(puppy|kitten|young|baby|weeks old|months old)/i.test(lowerMessage) && /(puppy|kitten)/i.test(lowerMessage)) {
        return getRandomResponse(petHealthResponses.puppy_kitten);
    }
    
    if (/(senior|old|elderly|aged|geriatric|years old)/i.test(lowerMessage) && !/(months old|weeks old)/i.test(lowerMessage)) {
        return getRandomResponse(petHealthResponses.senior);
    }
    
    // Check for preventive care topics
    if (/(checkup|wellness|preventive|prevention|annual|routine|healthy)/i.test(lowerMessage)) {
        return getRandomResponse(petHealthResponses.preventive);
    }
    
    // Standard emergency keywords (less severe than critical)
    if (/(emergency|urgent|help|dying|bleeding|unconscious|choking)/i.test(lowerMessage)) {
        return getRandomResponse(petHealthResponses.emergency);
    }
    
    // Health-related keywords with more specific matching
    if (/(sick|ill|not well|unwell|vomit|diarrhea|lethargic|not eating|fever|pain|hurt|injury|wound|symptom)/i.test(lowerMessage)) {
        return getRandomResponse(petHealthResponses.health);
    }
    
    // Nutrition-related with expanded keywords
    if (/(food|feed|diet|eat|nutrition|meal|feeding|recipe|treat|snack|hungry|overweight|underweight|weight)/i.test(lowerMessage)) {
        return getRandomResponse(petHealthResponses.nutrition);
    }
    
    // Exercise-related with more keywords
    if (/(exercise|walk|run|play|activity|energy|fit|tired|lazy|active|sport)/i.test(lowerMessage)) {
        return getRandomResponse(petHealthResponses.exercise);
    }
    
    // Vaccination-related
    if (/(vaccine|vaccination|shot|immunization|rabies|distemper|parvo|booster|shots)/i.test(lowerMessage)) {
        return getRandomResponse(petHealthResponses.vaccination);
    }
    
    // Grooming-related with expanded keywords
    if (/(groom|grooming|bath|bathe|brush|brushing|nail|trim|haircut|cut|clean|teeth|dental|hygiene)/i.test(lowerMessage)) {
        return getRandomResponse(petHealthResponses.grooming);
    }
    
    // Behavior-related with more keywords
    if (/(behavior|behave|aggressive|bark|barking|meow|scratch|bite|chew|dig|anxiety|stress|training|discipline)/i.test(lowerMessage)) {
        return getRandomResponse(petHealthResponses.behavior);
    }
    
    // Default greeting response for general queries
    return getRandomResponse(petHealthResponses.greetings);
}

// Get random response from array
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}
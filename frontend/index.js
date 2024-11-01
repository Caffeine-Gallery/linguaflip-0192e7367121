import { backend } from "declarations/backend";

const sourceText = document.getElementById('sourceText');
const targetLang = document.getElementById('targetLang');
const translateBtn = document.getElementById('translateBtn');
const translatedText = document.getElementById('translatedText');
const speakBtn = document.getElementById('speakBtn');
const translateSpinner = document.getElementById('translateSpinner');
const historyList = document.getElementById('historyList');

async function translateText(text, targetLanguage) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.responseData.translatedText;
}

async function updateHistory() {
    const history = await backend.getTranslationHistory();
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item history-item';
        li.innerHTML = `
            <div><strong>English:</strong> ${item.sourceText}</div>
            <div><strong>${item.targetLanguage}:</strong> ${item.translatedText}</div>
        `;
        historyList.appendChild(li);
    });
}

translateBtn.addEventListener('click', async () => {
    const text = sourceText.value.trim();
    if (!text) return;

    translateBtn.disabled = true;
    translateSpinner.classList.remove('d-none');
    speakBtn.disabled = true;

    try {
        const translation = await translateText(text, targetLang.value);
        translatedText.textContent = translation;
        speakBtn.disabled = false;

        // Store in backend
        await backend.addTranslation(text, translation, targetLang.value);
        await updateHistory();
    } catch (error) {
        translatedText.textContent = 'Translation error. Please try again.';
    } finally {
        translateBtn.disabled = false;
        translateSpinner.classList.add('d-none');
    }
});

speakBtn.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(translatedText.textContent);
    utterance.lang = targetLang.value;
    window.speechSynthesis.speak(utterance);
});

// Initialize
updateHistory();

const textSamples = [
    "The river Nile was a kind friend but occasionally it was a hard taskmaster. It taught the people who lived along its banks the noble art of 'team-work'.",
    "In a small part of the city West of Washington Square, the streets have gone wild. They turn in different directions. They are broken into small pieces called 'places.'",
    "Those cowbells are nothing more than elements. This could be, or perhaps before stockings, thoughts were only opinions. A coil of the exclamation is assumed to be a hurtless toy.",
    "India is poised to become the world’s most populous country this year – surpassing China, which has held the distinction since at least 1950, when the United Nations population records begin.",
    "The tiger, Panthera tigris, one of the world's most magnificent and revered animals, faces possible extinction in the wild. Since the turn of the century, its habitat and numbers have been reduced by 95 percent.",
    "Now the way that the book winds up is this: Tom and me found the money that the robbers hid in the cave, and it made us rich. We got six thousand dollars apiece -- all gold. It was an awful sight of money when it was piled up.",
    "Finally, in the year 89 B.C., the Romans came. The last Egyptian queen, Cleopatra, tried her best to save the country. Her beauty and charm were more dangerous to the Roman generals than half a dozen Egyptian army corps."
];

const displayText = document.querySelector(".typing-text p");
const inputArea = document.querySelector(".wrapper .input-field");
const retryButton = document.querySelector(".content button");
const timeDisplay = document.querySelector(".time span b");
const errorDisplay = document.querySelector(".mistake span");
const speedDisplay = document.querySelector(".wpm span");

let countdown;
let totalTime = 60;
let remainingTime = totalTime;
let currentCharIndex = 0;
let errorCount = 0;
let typingActive = false;

function initializeText() {
    const randomIndex = Math.floor(Math.random() * textSamples.length);
    displayText.innerHTML = "";
    textSamples[randomIndex].split("").forEach(character => {
        const spanElement = `<span>${character}</span>`;
        displayText.innerHTML += spanElement;
    });
    displayText.querySelector("span").classList.add("active");
    document.addEventListener("keydown", () => inputArea.focus());
    displayText.addEventListener("click", () => inputArea.focus());
}

function startTyping() {
    const characters = displayText.querySelectorAll("span");
    const currentChar = inputArea.value.split("")[currentCharIndex];

    if (currentCharIndex < characters.length - 1 && remainingTime > 0) {
        if (!typingActive) {
            countdown = setInterval(updateTimer, 1000);
            typingActive = true;
        }

        if (currentChar == null) {
            if (currentCharIndex > 0) {
                currentCharIndex--;
                if (characters[currentCharIndex].classList.contains("incorrect")) {
                    errorCount--;
                }
                characters[currentCharIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if (characters[currentCharIndex].innerText === currentChar) {
                characters[currentCharIndex].classList.add("correct");
            } else {
                errorCount++;
                characters[currentCharIndex].classList.add("incorrect");
            }
            currentCharIndex++;
        }

        characters.forEach(span => span.classList.remove("active"));
        characters[currentCharIndex].classList.add("active");

        const wordsPerMinute = Math.round(((currentCharIndex - errorCount) / 5) / (totalTime - remainingTime) * 60);
        speedDisplay.innerText = wordsPerMinute > 0 && isFinite(wordsPerMinute) ? wordsPerMinute : 0;
        errorDisplay.innerText = errorCount;
    } else {
        clearInterval(countdown);
        inputArea.value = "";
    }
}

function updateTimer() {
    if (remainingTime > 0) {
        remainingTime--;
        timeDisplay.innerText = remainingTime;
        const wordsPerMinute = Math.round(((currentCharIndex - errorCount) / 5) / (totalTime - remainingTime) * 60);
        speedDisplay.innerText = wordsPerMinute;
    } else {
        clearInterval(countdown);
    }
}

function restartGame() {
    initializeText();
    clearInterval(countdown);
    remainingTime = totalTime;
    currentCharIndex = 0;
    errorCount = 0;
    typingActive = false;
    inputArea.value = "";
    timeDisplay.innerText = remainingTime;
    speedDisplay.innerText = 0;
    errorDisplay.innerText = 0;
}

initializeText();
inputArea.addEventListener("input", startTyping);
retryButton.addEventListener("click", restartGame);

const nextBtn1 = document.getElementById('nextBtn1');
const nextBtn2 = document.getElementById('nextBtn2');
const steps = document.querySelectorAll('.step');

let studentData = {
    fullname: '',
    isAccepted: null,
    university: '',
    score: '',
    type: ''
};

const GOOGLE_WEB_APP_URL = "https://google.com";

function showStep(stepId) {
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById(stepId).classList.add('active');
}

nextBtn1.addEventListener('click', () => {
    const nameInput = document.getElementById('fullname').value.trim();
    if (!nameInput) {
        alert("Iltimos, ism va familiyangizni kiriting!");
        return;
    }
    studentData.fullname = nameInput;
    showStep('step2');
});

document.getElementById('statusYes').addEventListener('click', () => {
    studentData.isAccepted = true;
    showStep('step3');
});

document.getElementById('statusNo').addEventListener('click', () => {
    studentData.isAccepted = false;
    studentData.university = "O'qishga kirmagan";
    studentData.score = "0";
    studentData.type = "fail";
    
    sendDataAndFinish(); 
});

document.getElementById('submitBtn').addEventListener('click', () => {
    const uni = document.getElementById('university').value.trim();
    const score = document.getElementById('score').value.trim();
    const type = document.getElementById('type').value;

    if (!uni || !score) {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
        return;
    }

    studentData.university = uni;
    studentData.score = score;
    studentData.type = type;

    sendDataAndFinish();
});

function sendDataAndFinish() {
    const queryParams = new URLSearchParams({
        fullname: studentData.fullname,
        isAccepted: studentData.isAccepted,
        university: studentData.university,
        score: studentData.score,
        type: studentData.type
    }).toString();

    const script = document.createElement('script');
    script.src = `${GOOGLE_WEB_APP_URL}?${queryParams}&prefix=handleGoogleResponse`;
    
    script.onload = () => script.remove();
    script.onerror = () => script.remove();

    document.body.appendChild(script);

    showStep('stepResult');
    
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');

    if (studentData.isAccepted) {
        resultIcon.innerText = "🚀";
        resultTitle.innerHTML = "O'qishlaringizga omad tilaymiz! 🎓";
        resultText.innerHTML = `Talabalik muborak bo'lsin, <b>${studentData.fullname}</b>!<br>Kelajakdagi o'qish va ishlaringizda ulkan zafarlar tilayman. So'rovnomani to'ldirganingiz uchun rahmat!`;
    } else {
        resultIcon.innerText = "❤️";
        resultTitle.innerHTML = "Kelajakdagi ishlaringizga omad! 💪";
        resultText.innerHTML = `Aziz <b>${studentData.fullname}</b>, hech qachon tushkunlikka tushmang!<br>Oldinda sizni bundan ham buyuk muvaffaqiyatlar kutmoqda. So'rovnomani to'ldirganingiz uchun rahmat!`;
    }
}

window.handleGoogleResponse = function(response) {
    console.log("Yuborildi:", response);
};
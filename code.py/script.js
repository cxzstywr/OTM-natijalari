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

// SIZNING GOOGLE APPS SCRIPT MANZILINGIZ
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyNkTEO_W89iD0vzJAHdzezBbFLpKwuZvjAVZ8lleEp2FNmkLuKXGpF1WkQElDGP7CTnQ/exec";

function showStep(stepId) {
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById(stepId).classList.add('active');
}

// 1-bosqich: Ism kiritish va tekshirish
nextBtn1.addEventListener('click', () => {
    const nameInput = document.getElementById('fullname').value.trim();
    if (!nameInput) {
        alert("Iltimos, ism va familiyangizni kiriting!");
        return;
    }
    studentData.fullname = nameInput;
    showStep('step2');
});

// 2-bosqich: HA tugmasi bosilganda
document.getElementById('statusYes').addEventListener('click', () => {
    studentData.isAccepted = true;
    showStep('step3');
});

// 2-bosqich: YO'Q tugmasi bosilganda
document.getElementById('statusNo').addEventListener('click', () => {
    studentData.isAccepted = false;
    studentData.university = "O'qishga kirmagan";
    studentData.score = "0";
    studentData.type = "fail";
    
    sendDataAndFinish(); 
});

// 3-bosqich: Ma'lumotlarni yuborish va yakunlash
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

// Ma'lumotni Google Apps Script'ga CORS cheklovisiz (JSONP) yuborish mantiqi
function sendDataAndFinish() {
    // 1. Obyekt ma'lumotlarini ssilka parametrlariga o'tkazish
    const queryParams = new URLSearchParams({
        fullname: studentData.fullname,
        isAccepted: studentData.isAccepted,
        university: studentData.university,
        score: studentData.score,
        type: studentData.type
    }).toString();

    // 2. Dinamik ravishda sahifaga o'rnatiladigan script yaratish (Brauzer buni cheklamaydi)
    const script = document.createElement('script');
    script.src = `${GOOGLE_WEB_APP_URL}?${queryParams}&prefix=handleGoogleResponse`;
    
    // So'rov yakunlangach, yaratilgan vaqtinchalik elementni o'chirib tashlaymiz
    script.onload = () => script.remove();
    script.onerror = () => script.remove();

    document.body.appendChild(script);

    // 3. Google ma'lumotni qabul qilguncha kutmasdan, foydalanuvchiga darhol yakuniy silliq ekranni ko'rsatish
    showStep('stepResult');
    
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');

    if (studentData.isAccepted) {
        resultIcon.innerText = "🚀";
        resultTitle.innerHTML = "O'qishlaringizga omad tilaymiz! 🎓";
        resultText.innerHTML = `Talabalik muborak bo'lsin, <b>${studentData.fullname}</b>!<br>Kelajakdagi o'qish va ishlaringizda ulkan zafarlar tilayman. So'rovnomani to'ldirganingiz uchun rahmat!`;
        triggerConfettiEffect();
    } else {
        resultIcon.innerText = "❤️";
        resultTitle.innerHTML = "Kelajakdagi ishlaringizga omad! 💪";
        resultText.innerHTML = `Aziz <b>${studentData.fullname}</b>, hech qachon tushkunlikka tushmang!<br>Oldinda sizni bundan ham buyuk muvaffaqiyatlar kutmoqda. So'rovnomani to'ldirganingiz uchun rahmat!`;
    }
}

// Google Apps Script javobini ushlash uchun global funksiya (Xatolik chiqmasligi uchun)
window.handleGoogleResponse = function(response) {
    console.log("Google Apps Script javobi:", response);
};

// Chiroyli rang-barang premium konfetti bayramona effekti
function triggerConfettiEffect() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 }
        });
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

const nextBtn1 = document.getElementById('nextBtn1');
const steps = document.querySelectorAll('.step');

let studentData = {
    fullname: '',
    isAccepted: null,
    university: '',
    score: '',
    type: ''
};

// Google Apps Script havongiz (agar bo'lsa)
const GOOGLE_WEB_APP_URL = "https://google.com"; 

function showStep(stepId) {
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById(stepId).classList.add('active');
}

// 1-bosqich: Ismni tekshirish
nextBtn1.addEventListener('click', () => {
    const nameInput = document.getElementById('fullname').value.trim();
    if (!nameInput) {
        alert("Iltimos, ism va familiyangizni kiriting!");
        return;
    }
    studentData.fullname = nameInput;
    showStep('step2');
});

// 2-bosqich: Ha tugmasi
document.getElementById('statusYes').addEventListener('click', () => {
    studentData.isAccepted = true;
    showStep('step3');
});

// 2-bosqich: Yo'q tugmasi
document.getElementById('statusNo').addEventListener('click', () => {
    studentData.isAccepted = false;
    studentData.university = "O'qishga kirmagan";
    studentData.score = "0";
    studentData.type = "fail";
    
    saveAndDisplayData(); 
});

// 3-bosqich: Yakuniy yuborish
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

    saveAndDisplayData();
});

// Ma'lumotlarni saqlash, Google'ga yuborish va ekranga chiqarish funksiyasi
function saveAndDisplayData() {
    // 1. Mahalliy xotiraga (localStorage) massiv shaklida saqlash
    let allResults = JSON.parse(localStorage.getItem('otm_students_list')) || [];
    allResults.push({ ...studentData });
    localStorage.setItem('otm_students_list', JSON.stringify(allResults));

    // 2. Google Sheets API'ga yuborish logikasi (Sizning kodingiz)
    if(GOOGLE_WEB_APP_URL !== "https://google.com") {
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
    }

    // 3. Yakuniy matnlarni yangilash
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

    // 4. Jadvalni yangilab ro'yxatni ko'rsatish
    renderResultsTable();
}

// Xotiradagi barcha ma'lumotlarni o'qib, HTML ro'yxat tuzuvchi funksiya
function renderResultsTable() {
    const resultsListHtml = document.getElementById('resultsList');
    if(!resultsListHtml) return;

    let allResults = JSON.parse(localStorage.getItem('otm_students_list')) || [];
    resultsListHtml.innerHTML = ""; // Tozalash

    // Ro'yxatni teskari tartibda (oxirgi qo'shilganlar tepada) ko'rsatish
    allResults.reverse().forEach(item => {
        let badgeClass = 'badge-fail';
        let badgeText = 'Yiqildi';

        if(item.type === 'grant') { badgeClass = 'badge-grant'; badgeText = 'Grant 🟢'; }
        else if(item.type === 'kontrakt') { badgeClass = 'badge-kontrakt'; badgeText = 'Kontrakt 🟡'; }
        else if(item.type === 'super') { badgeClass = 'badge-super'; badgeText = 'Super 🔴'; }

        const itemElement = document.createElement('div');
        itemElement.className = 'result-item';
        itemElement.innerHTML = `
            <div class="result-info">
                <div class="student-name">${item.fullname}</div>
                <div class="student-uni">${item.university} (${item.score} ball)</div>
            </div>
            <span class="result-badge ${badgeClass}">${badgeText}</span>
        `;
        resultsListHtml.appendChild(itemElement);
    });
}

// Sahifa yuklanganda jadval avtomatik tayyor turishi uchun (agar foydalanuvchi oxirgi sahifada bo'lsa)
document.addEventListener("DOMContentLoaded", renderResultsTable);

window.handleGoogleResponse = function(response) {
    console.log("Yuborildi:", response);
};
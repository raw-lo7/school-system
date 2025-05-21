// وظائف لوحة الطالب
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// بيانات تجريبية للواجبات
let homeworks = [
    { title: 'واجب رياضيات', publish: '2025-05-20', due: '2025-05-25', link: '', file: '', status: 'لم يُسلّم' }
];
// بيانات الطالب
let student = { name: 'أحمد محمد', absences: 0 };

function renderStudentHomework() {
    const tbody = document.querySelector('#student-homework-table tbody');
    tbody.innerHTML = '';
    homeworks.forEach((h, i) => {
        let fileLink = h.link || h.file ? `<a href='${h.link || h.file}' target='_blank'>رابط/ملف</a>` : '-';
        let submitBtn = h.status !== 'تم التسليم' ? `<button onclick='submitHomework(${i})'>تسليم</button>` : 'تم التسليم';
        tbody.innerHTML += `<tr><td>${h.title}</td><td>${h.publish}</td><td>${h.due}</td><td>${fileLink}</td><td>${h.status || 'لم يُسلّم'}</td><td>${submitBtn}</td></tr>`;
    });
}
function submitHomework(idx) {
    // نافذة رفع ملف (اختياري)
    const form = document.createElement('form');
    form.innerHTML = `
        <label>رفع ملف الحل (اختياري):<input type='file' id='student-file'></label><br>
        <button type='submit'>تسليم</button>
        <button type='button' onclick='this.parentElement.remove()'>إلغاء</button>
    `;
    form.style.background = '#fff';
    form.style.position = 'fixed';
    form.style.top = '50%';
    form.style.left = '50%';
    form.style.transform = 'translate(-50%,-50%)';
    form.style.padding = '2rem';
    form.style.zIndex = '9999';
    form.style.borderRadius = '12px';
    form.style.boxShadow = '0 2px 16px rgba(0,0,0,0.18)';
    document.body.appendChild(form);
    form.onsubmit = function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('student-file');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            homeworks[idx].studentFile = URL.createObjectURL(file);
        }
        homeworks[idx].status = 'تم التسليم';
        saveData();
        renderStudentHomework();
        showNotification('تم تسليم الواجب بنجاح', 'success');
        form.remove();
    };
}
function renderAbsences() {
    document.getElementById('student-absences').innerText = student.absences;
}

// نظام إشعارات مبسط
function showNotification(msg, type = 'info') {
    let notif = document.getElementById('notif-box');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'notif-box';
        notif.style.position = 'fixed';
        notif.style.top = '30px';
        notif.style.left = '50%';
        notif.style.transform = 'translateX(-50%)';
        notif.style.zIndex = '9999';
        notif.style.padding = '1rem 2.5rem';
        notif.style.borderRadius = '10px';
        notif.style.fontWeight = 'bold';
        notif.style.fontSize = '1.1rem';
        notif.style.boxShadow = '0 2px 8px rgba(0,0,0,0.13)';
        document.body.appendChild(notif);
    }
    notif.innerText = msg;
    notif.style.background = type === 'success' ? '#43a047' : (type === 'error' ? '#d32f2f' : '#f57c00');
    notif.style.color = '#fff';
    notif.style.display = 'block';
    setTimeout(() => { notif.style.display = 'none'; }, 2500);
}

// تفعيل الوضع الليلي
function toggleNightMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('nightMode', document.body.classList.contains('dark-mode'));
}
window.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('nightMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    // زر الوضع الليلي في الأعلى
    let btn = document.createElement('button');
    btn.className = 'night-btn';
    btn.innerText = 'الوضع الليلي';
    btn.onclick = toggleNightMode;
    document.body.appendChild(btn);
});

// حفظ بيانات الواجبات وعدد الغيابات في LocalStorage
function saveData() {
    localStorage.setItem('student_homeworks', JSON.stringify(homeworks));
    localStorage.setItem('student_absences', student.absences);
}
function loadData() {
    const h = localStorage.getItem('student_homeworks');
    if (h) homeworks = JSON.parse(h);
    const a = localStorage.getItem('student_absences');
    if (a) student.absences = parseInt(a);
}

// عرض رسائل الطالب
function renderMessages() {
    const user = JSON.parse(localStorage.getItem('user')||'{}');
    const messages = JSON.parse(localStorage.getItem('messages')||'[]');
    const tbody = document.querySelector('#msg-table tbody');
    tbody.innerHTML = '';
    messages.filter(m=>m.to===user.username).forEach(m => {
        tbody.innerHTML += `<tr><td>${m.from}</td><td>${m.title}</td><td>${m.body}</td><td>${m.date}</td></tr>`;
    });
}
window.onload = function() {
    loadData();
    const name = localStorage.getItem('siteName') || 'النظام المدرسي';
    document.getElementById('site-title').innerText = name;
    renderStudentHomework();
    renderAbsences();
    renderMessages();
};

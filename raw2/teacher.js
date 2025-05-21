// وظائف لوحة المدرس
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}


// بيانات تجريبية للطلاب
let students = [
    { name: 'أحمد محمد', class: 'KG1', absences: 0 },
    { name: 'سارة علي', class: 'KG2', absences: 2 },
    { name: 'يوسف خالد', class: 'KG1', absences: 1 }
];

function renderAttendance() {
    const tbody = document.querySelector('#attendance-table tbody');
    tbody.innerHTML = '';
    students.forEach((s, i) => {
        tbody.innerHTML += `<tr><td>${s.name}</td><td>${s.class}</td><td><button onclick="markPresent(${i})">حاضر</button> <button onclick="markAbsent(${i})">غائب</button></td></tr>`;
    });
}
function markPresent(idx) {
    alert('تم تسجيل حضور الطالب: ' + students[idx].name);
}
function markAbsent(idx) {
    students[idx].absences++;
    saveData();
    alert('تم تسجيل غياب الطالب: ' + students[idx].name);
    renderAttendance();
}

// بيانات تجريبية للواجبات
let homeworks = [
    { title: 'واجب رياضيات', publish: '2025-05-20', due: '2025-05-25', link: '', file: '' }
];
function renderHomework() {
    const tbody = document.querySelector('#homework-table tbody');
    tbody.innerHTML = '';
    homeworks.forEach((h, i) => {
        tbody.innerHTML += `<tr><td>${h.title}</td><td>${h.publish}</td><td>${h.due}</td><td>${h.link || h.file ? '<a href="'+(h.link||h.file)+'" target="_blank">رابط/ملف</a>' : '-'}</td></tr>`;
    });
}

// رفع ملف للواجبات (للمعلم)
function showAddHomework() {
    // نافذة إدخال متقدمة
    const form = document.createElement('form');
    form.innerHTML = `
        <label>عنوان الواجب:<input type='text' id='hw-title' required></label><br>
        <label>تاريخ النشر:<input type='date' id='hw-publish' value='${new Date().toISOString().slice(0,10)}' required></label><br>
        <label>تاريخ الانتهاء:<input type='date' id='hw-due' required></label><br>
        <label>رابط اختياري:<input type='url' id='hw-link'></label><br>
        <label>ملف اختياري:<input type='file' id='hw-file'></label><br>
        <button type='submit'>إضافة</button>
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
        const title = document.getElementById('hw-title').value;
        const publish = document.getElementById('hw-publish').value;
        const due = document.getElementById('hw-due').value;
        const link = document.getElementById('hw-link').value;
        const fileInput = document.getElementById('hw-file');
        let fileUrl = '';
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            fileUrl = URL.createObjectURL(file);
        }
        homeworks.push({ title, publish, due, link, file: fileUrl });
        saveData();
        renderHomework();
        showNotification('تم إضافة الواجب بنجاح', 'success');
        form.remove();
    };
}

// بيانات تجريبية للدرجات
let grades = [
    { student: 'أحمد محمد', class: 'KG1', grade: 95 },
    { student: 'سارة علي', class: 'KG2', grade: 88 }
];
function renderGrades() {
    const tbody = document.querySelector('#grades-table tbody');
    tbody.innerHTML = '';
    grades.forEach(g => {
        tbody.innerHTML += `<tr><td>${g.student}</td><td>${g.class}</td><td>${g.grade}</td></tr>`;
    });
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

// إضافة بحث سريع في جدول الحضور
function filterTable(inputId, tableId) {
    const input = document.getElementById(inputId);
    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? '' : 'none';
    });
}

// حفظ بيانات الطلاب والواجبات والدرجات في LocalStorage
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('homeworks', JSON.stringify(homeworks));
    localStorage.setItem('grades', JSON.stringify(grades));
}
function loadData() {
    const s = localStorage.getItem('students');
    if (s) students = JSON.parse(s);
    const h = localStorage.getItem('homeworks');
    if (h) homeworks = JSON.parse(h);
    const g = localStorage.getItem('grades');
    if (g) grades = JSON.parse(g);
}

// عرض رسائل المدرس
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
    renderAttendance();
    renderHomework();
    renderGrades();
    renderMessages();
    // إضافة حقل البحث
    const attSearch = document.createElement('input');
    attSearch.className = 'table-search';
    attSearch.placeholder = 'بحث عن طالب...';
    attSearch.id = 'att-search';
    attSearch.oninput = () => filterTable('att-search', 'attendance-table');
    document.querySelector('section h2').after(attSearch);
};

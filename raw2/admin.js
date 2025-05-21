// وظائف لوحة الإدارة
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function showAddStudent() {
    // نافذة إدخال متقدمة لإضافة طالب
    const form = document.createElement('form');
    form.innerHTML = `
        <label>الاسم الكامل:<input type='text' id='student-name' required></label><br>
        <label>الصف:<input type='text' id='student-class' required></label><br>
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
        const name = document.getElementById('student-name').value;
        const sclass = document.getElementById('student-class').value;
        students.push({ name, class: sclass, absences: 0 });
        saveData();
        renderStudents();
        showNotification('تمت إضافة الطالب بنجاح', 'success');
        form.remove();
    };
}
function showAddTeacher() {
    // نافذة إدخال متقدمة لإضافة مدرس
    const form = document.createElement('form');
    form.innerHTML = `
        <label>الاسم الكامل:<input type='text' id='teacher-name' required></label><br>
        <label>المادة:<input type='text' id='teacher-subject' required></label><br>
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
        const name = document.getElementById('teacher-name').value;
        const subject = document.getElementById('teacher-subject').value;
        teachers.push({ name, subject });
        saveData();
        renderTeachers();
        showNotification('تمت إضافة المدرس بنجاح', 'success');
        form.remove();
    };
}
function changeSiteName() {
    const name = document.getElementById('site-name-input').value;
    localStorage.setItem('siteName', name);
    document.getElementById('site-title').innerText = name;
    alert('تم تغيير اسم الموقع!');
}
// عند تحميل الصفحة، تحديث اسم الموقع من التخزين
window.onload = function() {
    const name = localStorage.getItem('siteName') || 'النظام المدرسي';
    document.getElementById('site-title').innerText = name;
    document.getElementById('site-name-input').value = name;
};

// بيانات تجريبية للطلاب
let students = [
    { name: 'أحمد محمد', class: 'KG1', absences: 0 },
    { name: 'سارة علي', class: 'KG2', absences: 2 },
    { name: 'يوسف خالد', class: 'KG1', absences: 1 }
];

// بيانات تجريبية للمدرسين
let teachers = [
    { name: 'أ. منى', subject: 'رياضيات' },
    { name: 'أ. سامي', subject: 'لغة عربية' }
];

// بيانات تجريبية للفواتير
let bills = [
    { student: 'أحمد محمد', amount: 500, status: 'غير مدفوع' },
    { student: 'سارة علي', amount: 500, status: 'مدفوع' }
];

// نظام الرسائل
let messages = JSON.parse(localStorage.getItem('messages') || '[]');
function renderMessages() {
    const tbody = document.querySelector('#msg-table tbody');
    tbody.innerHTML = '';
    messages.forEach(m => {
        tbody.innerHTML += `<tr><td>${m.from}</td><td>${m.to}</td><td>${m.title}</td><td>${m.body}</td><td>${m.date}</td></tr>`;
    });
}
document.getElementById('msg-form').onsubmit = function(e) {
    e.preventDefault();
    const from = JSON.parse(localStorage.getItem('user')||'{}').username || 'admin';
    const to = document.getElementById('msg-to').value.trim();
    const title = document.getElementById('msg-title').value.trim();
    const body = document.getElementById('msg-body').value.trim();
    if(!to || !title || !body) return showNotification('يرجى تعبئة جميع الحقول','error');
    messages.push({ from, to, title, body, date: new Date().toLocaleString() });
    localStorage.setItem('messages', JSON.stringify(messages));
    renderMessages();
    showNotification('تم إرسال الرسالة بنجاح','success');
    this.reset();
};

function renderStudents() {
    const tbody = document.querySelector('#students-table tbody');
    tbody.innerHTML = '';
    students.forEach((s, i) => {
        tbody.innerHTML += `<tr><td>${s.name}</td><td>${s.class}</td><td>${s.absences}</td><td><button onclick="removeStudent(${i})">حذف</button></td></tr>`;
    });
}
function renderTeachers() {
    const tbody = document.querySelector('#teachers-table tbody');
    tbody.innerHTML = '';
    teachers.forEach((t, i) => {
        tbody.innerHTML += `<tr><td>${t.name}</td><td>${t.subject}</td><td><button onclick="removeTeacher(${i})">حذف</button></td></tr>`;
    });
}
function renderBills() {
    const tbody = document.querySelector('#bills-table tbody');
    tbody.innerHTML = '';
    bills.forEach((b, i) => {
        tbody.innerHTML += `<tr><td>${b.student}</td><td>${b.amount}</td><td>${b.status}</td><td><button onclick="payBill(${i})">دفع</button></td></tr>`;
    });
}

// إضافة بحث سريع في جدول الطلاب
function filterTable(inputId, tableId) {
    const input = document.getElementById(inputId);
    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? '' : 'none';
    });
}

// حفظ بيانات الطلاب والمدرسين والفواتير في LocalStorage
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('teachers', JSON.stringify(teachers));
    localStorage.setItem('bills', JSON.stringify(bills));
}
function loadData() {
    const s = localStorage.getItem('students');
    if (s) students = JSON.parse(s);
    const t = localStorage.getItem('teachers');
    if (t) teachers = JSON.parse(t);
    const b = localStorage.getItem('bills');
    if (b) bills = JSON.parse(b);
}

function removeStudent(idx) {
    if(confirm('هل أنت متأكد من حذف الطالب؟')) {
        students.splice(idx, 1);
        saveData();
        renderStudents();
        showNotification('تم حذف الطالب بنجاح', 'success');
    }
}
function removeTeacher(idx) {
    if(confirm('هل أنت متأكد من حذف المدرس؟')) {
        teachers.splice(idx, 1);
        saveData();
        renderTeachers();
        showNotification('تم حذف المدرس بنجاح', 'success');
    }
}
function payBill(idx) {
    bills[idx].status = 'مدفوع';
    saveData();
    renderBills();
    showNotification('تم دفع الفاتورة بنجاح', 'success');
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

window.onload = function() {
    loadData();
    const name = localStorage.getItem('siteName') || 'النظام المدرسي';
    document.getElementById('site-title').innerText = name;
    document.getElementById('site-name-input').value = name;
    renderStudents();
    renderTeachers();
    renderBills();
    renderMessages();

    // إضافة حقول البحث
    const studentSearch = document.createElement('input');
    studentSearch.className = 'table-search';
    studentSearch.placeholder = 'بحث عن طالب...';
    studentSearch.id = 'student-search';
    studentSearch.oninput = () => filterTable('student-search', 'students-table');
    document.querySelector('section h2').after(studentSearch);

    // تحديث الإحصائيات
    document.getElementById('stats-students').innerText = students.length;
    document.getElementById('stats-teachers').innerText = teachers.length;
    document.getElementById('stats-bills').innerText = bills.filter(b=>b.status!=='مدفوع').length;
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

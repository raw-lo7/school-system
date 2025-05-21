// إدارة المدرسين - teachers_admin.js
let teachers = [];

function loadTeachers() {
    const t = localStorage.getItem('teachers');
    teachers = t ? JSON.parse(t) : [];
}

function saveTeachers() {
    localStorage.setItem('teachers', JSON.stringify(teachers));
}

function renderTeachers() {
    const tbody = document.querySelector('#teachers-admin-table tbody');
    tbody.innerHTML = '';
    teachers.forEach((t, i) => {
        tbody.innerHTML += `<tr><td>${t.name}</td><td>${t.subject}</td><td><button onclick="removeTeacher(${i})">حذف</button></td></tr>`;
    });
}

function showAddTeacher() {
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
        saveTeachers();
        renderTeachers();
        showNotification('تمت إضافة المدرس بنجاح', 'success');
        form.remove();
    };
}

function removeTeacher(idx) {
    if(confirm('هل أنت متأكد من حذف المدرس؟')) {
        teachers.splice(idx, 1);
        saveTeachers();
        renderTeachers();
        showNotification('تم حذف المدرس بنجاح', 'success');
    }
}

function filterTeachers() {
    const filter = document.getElementById('teacher-search').value.toLowerCase();
    const rows = document.querySelectorAll('#teachers-admin-table tbody tr');
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? '' : 'none';
    });
}

// إشعارات
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
    loadTeachers();
    renderTeachers();
};

// إدارة الطلاب - students_admin.js
let students = [];

function loadStudents() {
    const s = localStorage.getItem('students');
    students = s ? JSON.parse(s) : [];
}

function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

function renderStudents() {
    const tbody = document.querySelector('#students-admin-table tbody');
    tbody.innerHTML = '';
    students.forEach((s, i) => {
        tbody.innerHTML += `<tr><td>${s.name}</td><td>${s.class}</td><td>${s.absences || 0}</td><td><button onclick="removeStudent(${i})">حذف</button></td></tr>`;
    });
}

function showAddStudent() {
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
        saveStudents();
        renderStudents();
        showNotification('تمت إضافة الطالب بنجاح', 'success');
        form.remove();
    };
}

function removeStudent(idx) {
    if(confirm('هل أنت متأكد من حذف الطالب؟')) {
        students.splice(idx, 1);
        saveStudents();
        renderStudents();
        showNotification('تم حذف الطالب بنجاح', 'success');
    }
}

function filterStudents() {
    const filter = document.getElementById('student-search').value.toLowerCase();
    const rows = document.querySelectorAll('#students-admin-table tbody tr');
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
    loadStudents();
    renderStudents();
};

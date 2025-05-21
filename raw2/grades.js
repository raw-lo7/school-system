// grades.js
// إدارة الدرجات للمدير والمعلم

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('grades-form');
    const studentSelect = document.getElementById('grades-student');
    const subjectInput = document.getElementById('grades-subject');
    const valueInput = document.getElementById('grades-value');
    const reasonInput = document.getElementById('grades-reason');
    const tableBody = document.getElementById('grades-table-body');

    // جلب الطلاب من LocalStorage
    function getStudents() {
        return JSON.parse(localStorage.getItem('students') || '[]');
    }

    // تعبئة قائمة الطلاب
    function renderStudentOptions() {
        const students = getStudents();
        studentSelect.innerHTML = '';
        students.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.name;
            opt.textContent = s.name + (s.class ? ' - ' + s.class : '');
            studentSelect.appendChild(opt);
        });
    }

    // تحميل الدرجات
    function loadGrades() {
        tableBody.innerHTML = '';
        const grades = JSON.parse(localStorage.getItem('gradesRecords') || '[]');
        grades.forEach((g, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${g.name}</td><td>${g.subject}</td><td>${g.value}</td><td>${g.reason || ''}</td><td><button class='delete-btn' data-idx='${idx}'>حذف</button></td>`;
            tableBody.appendChild(tr);
        });
    }

    // إضافة أو تحديث درجة
    form.onsubmit = function(e) {
        e.preventDefault();
        const name = studentSelect.value;
        const subject = subjectInput.value.trim();
        const value = valueInput.value;
        const reason = reasonInput.value.trim();
        if (!name || !subject || value === '' || !reason) return;
        let grades = JSON.parse(localStorage.getItem('gradesRecords') || '[]');
        // إذا كانت الدرجة لنفس الطالب والمادة موجودة، حدثها
        const idx = grades.findIndex(g => g.name === name && g.subject === subject);
        if (idx !== -1) {
            grades[idx].value = value;
            grades[idx].reason = reason;
        } else {
            grades.push({ name, subject, value, reason });
        }
        localStorage.setItem('gradesRecords', JSON.stringify(grades));
        form.reset();
        renderStudentOptions();
        loadGrades();
    };

    // حذف درجة
    tableBody.addEventListener('click', function(e) {
        if(e.target.classList.contains('delete-btn')) {
            const idx = e.target.getAttribute('data-idx');
            let grades = JSON.parse(localStorage.getItem('gradesRecords') || '[]');
            grades.splice(idx, 1);
            localStorage.setItem('gradesRecords', JSON.stringify(grades));
            loadGrades();
        }
    });

    // فلترة الدرجات حسب البحث
    document.getElementById('grades-search').addEventListener('input', function() {
        const search = this.value.trim().toLowerCase();
        const grades = JSON.parse(localStorage.getItem('gradesRecords') || '[]');
        tableBody.innerHTML = '';
        grades.forEach((g, idx) => {
            if (g.name.toLowerCase().includes(search)) {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${g.name}</td><td>${g.subject}</td><td>${g.value}</td><td>${g.reason || ''}</td><td><button class='delete-btn' data-idx='${idx}'>حذف</button></td>`;
                tableBody.appendChild(tr);
            }
        });
    });

    renderStudentOptions();
    loadGrades();
});

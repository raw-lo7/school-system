// teacher_attendance.js
// صفحة حضور وغياب للمعلم

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('teacher-attendance-form');
    const dateInput = document.getElementById('attendance-date');
    const studentsListDiv = document.getElementById('students-attendance-list');
    const studentSearchInput = document.getElementById('student-search-input');
    const tableBody = document.getElementById('attendance-table-body');
    const attendanceRecordSearch = document.getElementById('attendance-record-search');
    const classFilter = document.getElementById('attendance-class-filter');

    // جلب الطلاب من LocalStorage
    function getStudents() {
        return JSON.parse(localStorage.getItem('students') || '[]');
    }

    // تعبئة قائمة الصفوف
    function renderClassOptions() {
        const students = getStudents();
        const classes = Array.from(new Set(students.map(s => s.class))).filter(Boolean);
        classFilter.innerHTML = '<option value="">كل الصفوف</option>';
        classes.forEach(cls => {
            const opt = document.createElement('option');
            opt.value = cls;
            opt.textContent = cls;
            classFilter.appendChild(opt);
        });
    }

    // توليد قائمة الطلاب مع خيارات الحضور/الغياب حسب الصف المختار وحسب البحث
    function renderStudentsAttendance() {
        const students = getStudents();
        const selectedClass = classFilter ? classFilter.value : '';
        const searchValue = studentSearchInput ? studentSearchInput.value.trim().toLowerCase() : '';
        studentsListDiv.innerHTML = '';
        let filtered = students;
        if (selectedClass) {
            filtered = filtered.filter(s => s.class === selectedClass);
        }
        if (searchValue) {
            filtered = filtered.filter(s => s.name.toLowerCase().includes(searchValue));
        }
        if (filtered.length === 0) {
            studentsListDiv.innerHTML = '<div style="color:#d32f2f">لا يوجد طلاب في هذا الصف أو لا يوجد نتائج مطابقة.</div>';
            return;
        }
        filtered.forEach((s, i) => {
            const row = document.createElement('div');
            row.className = 'student-att-row';
            row.innerHTML = `
                <span class="student-name">${s.name}</span>
                <label><input type="radio" name="att-${i}" value="حاضر" required> حاضر</label>
                <label><input type="radio" name="att-${i}" value="غائب"> غائب</label>
            `;
            studentsListDiv.appendChild(row);
        });
    }

    function loadAttendance() {
        tableBody.innerHTML = '';
        const records = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
        const searchValue = attendanceRecordSearch ? attendanceRecordSearch.value.trim().toLowerCase() : '';
        let filteredRecords = records;
        if (searchValue) {
            filteredRecords = records.filter(rec => rec.name.toLowerCase().includes(searchValue));
        }
        filteredRecords.forEach((rec, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${rec.name}</td><td>${rec.date}</td><td>${rec.status}</td><td><button class='delete-btn' data-idx='${idx}'>حذف</button></td>`;
            tableBody.appendChild(tr);
        });
    }

    // تعيين تاريخ اليوم تلقائياً
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;

    form.onsubmit = function(e) {
        e.preventDefault();
        const students = getStudents();
        const date = dateInput.value;
        if (!date) return;
        let added = false;
        students.forEach((s, i) => {
            const status = form.querySelector(`input[name="att-${i}"]:checked`);
            if (status) {
                const rec = {
                    name: s.name,
                    date: date,
                    status: status.value
                };
                const records = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
                records.push(rec);
                localStorage.setItem('attendanceRecords', JSON.stringify(records));
                added = true;
            }
        });
        if (added) {
            form.reset();
            renderStudentsAttendance();
            loadAttendance();
        }
    };

    tableBody.addEventListener('click', function(e) {
        if(e.target.classList.contains('delete-btn')) {
            const idx = e.target.getAttribute('data-idx');
            const records = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
            records.splice(idx, 1);
            localStorage.setItem('attendanceRecords', JSON.stringify(records));
            loadAttendance();
        }
    });

    if (studentSearchInput) {
        studentSearchInput.addEventListener('input', renderStudentsAttendance);
    }
    if (attendanceRecordSearch) {
        attendanceRecordSearch.addEventListener('input', loadAttendance);
    }
    if (classFilter) {
        classFilter.addEventListener('change', renderStudentsAttendance);
    }

    renderClassOptions();
    renderStudentsAttendance();
    loadAttendance();
});

// report_card.js
// عرض وطباعة شهادة نهاية الفصل/السنة للطالب

// بيانات تجريبية (يمكن ربطها بقاعدة البيانات لاحقاً)
const students = JSON.parse(localStorage.getItem('students')||'[]');
const grades = JSON.parse(localStorage.getItem('grades')||'[]');

// بيانات المواد الافتراضية (يمكن تعديلها)
const defaultCourses = [
    { name: 'الدراسات الإسلامية', en: 'Islamic studies', credits: 0.5 },
    { name: 'اللغة الإنجليزية', en: 'English Language & Literature', credits: 1 },
    { name: 'اللغة العربية', en: 'Arabic Language', credits: 1 },
    { name: 'التربية البدنية والصحية', en: 'Physical and Health Education', credits: 1 },
    { name: 'الفنون البصرية', en: 'Visual Arts', credits: 0.5 },
    { name: 'الكيمياء', en: 'Chemistry', credits: 1 },
    { name: 'مدخل إلى الأعمال', en: 'Introduction to Business', credits: 0.5 },
    { name: 'الجبر 2', en: 'Algebra2', credits: 0.5 },
    { name: 'الهندسة', en: 'Geometry', credits: 0.5 },
    { name: 'التاريخ', en: 'History', credits: 1 }
];

const gradingScale = [
    { letter: 'A+', min: 97, max: 100, points: 4.0 },
    { letter: 'A', min: 93, max: 96, points: 4.0 },
    { letter: 'A-', min: 90, max: 92, points: 3.7 },
    { letter: 'B+', min: 87, max: 89, points: 3.3 },
    { letter: 'B', min: 83, max: 86, points: 3.0 },
    { letter: 'B-', min: 80, max: 82, points: 2.7 },
    { letter: 'C+', min: 77, max: 79, points: 2.3 },
    { letter: 'C', min: 73, max: 76, points: 2.0 },
    { letter: 'C-', min: 70, max: 72, points: 1.7 },
    { letter: 'D+', min: 67, max: 69, points: 1.3 },
    { letter: 'D', min: 65, max: 66, points: 1.0 },
    { letter: 'F', min: 0, max: 64, points: 0.0 }
];

function getLetterGrade(score) {
    for (const g of gradingScale) {
        if (score >= g.min && score <= g.max) return g.letter;
    }
    return 'F';
}
function getGradePoints(score) {
    for (const g of gradingScale) {
        if (score >= g.min && score <= g.max) return g.points;
    }
    return 0.0;
}

function renderStudentOptions() {
    const sel = document.getElementById('student-select');
    sel.innerHTML = '';
    students.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id || s.name;
        opt.textContent = s.name + (s.class ? ' - ' + s.class : '');
        sel.appendChild(opt);
    });
}

function renderReport(studentId) {
    const student = students.find(s => (s.id || s.name) == studentId);
    if (!student) return;
    // بيانات الدرجات
    const studentGrades = grades.filter(g => g.student === student.name);
    // بناء جدول المواد
    let totalCredits = 0, totalPoints = 0, totalScore = 0, totalCourses = 0;
    let rows = '';
    defaultCourses.forEach(course => {
        const g = studentGrades.find(x => x.subject === course.name);
        const score = g ? Number(g.grade) : '';
        const letter = g ? getLetterGrade(score) : '';
        const points = g ? getGradePoints(score) : '';
        rows += `<tr><td>${course.en}<br><span style='font-size:0.95em;color:#888'>${course.name}</span></td><td>${course.credits}</td><td>${score}</td><td>${letter}</td><td>${points}</td></tr>`;
        if (g) {
            totalCredits += course.credits;
            totalPoints += points * course.credits;
            totalScore += score;
            totalCourses++;
        }
    });
    const gpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : '-';
    const percent = totalCourses ? (totalScore / totalCourses).toFixed(1) : '-';
    // بيانات الغياب
    const absences = student.absences || 0;
    // بيانات عامة
    const year = new Date().getFullYear();
    const term = 2;
    const reportDate = new Date().toISOString().slice(0,10);
    // إخراج التقرير
    document.getElementById('report-content').innerHTML = `
        <div class="report-header">
            <img src="https://i.imgur.com/2Q2R2Qb.png" alt="logo" style="height:60px;">
            <div style="text-align:center;flex:1;">
                <div class="report-title">Report Card<br><span style='font-size:1.1rem;'>American Curriculum</span></div>
            </div>
            <img src="https://i.imgur.com/8Qw2QwF.png" alt="uae" style="height:60px;">
        </div>
        <table style="width:100%;margin-bottom:1rem;font-size:1.05rem;">
            <tr><td><b>Student Name:</b> ${student.name}</td><td><b>Academic Year:</b> ${year}-${year+1}</td></tr>
            <tr><td><b>Student ID:</b> ${student.id||'-'}</td><td><b>Term:</b> ${term}</td></tr>
            <tr><td><b>Student Date of Birth:</b> ${student.dob||'-'}</td><td><b>Class:</b> ${student.class||'-'}</td></tr>
            <tr><td></td><td><b>Date of Report:</b> ${reportDate}</td></tr>
        </table>
        <table class="report-table">
            <thead><tr><th>Courses</th><th>Credits</th><th>Numeric Grade</th><th>Letter Grade</th><th>Grade Points</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
        <div class="report-summary">
            <div><b>Behavior :</b> 100</div>
            <div><b>Total Credits Earned :</b> ${totalCredits.toFixed(1)}</div>
            <div><b>GPA :</b> ${gpa}</div>
            <div><b>Total Percentage :</b> ${percent}</div>
        </div>
        <div class="report-scale">
            <div>
                <b>Grading Scale</b><br>
                A+ [4] = 97-100<br>A [4] = 93-96<br>A- [3.7] = 90-92<br>B+ [3.3] = 87-89<br>B [3] = 83-86<br>B- [2.7] = 80-82<br>C+ [2.3] = 77-79<br>C [2] = 73-76<br>C- [1.7] = 70-72<br>D+ [1.3] = 67-69<br>D [1] = 65-66<br>F [0] = 0-64
            </div>
            <div>
                <b>Academic Summary</b><br>
                1. Cumulative GPA=4.00<br>
                2. Credit Required: 28<br>
                3. Grade range from 0 to 100 with 60% as the passing grade for any subject<br>
                4. GPA Calculation is based on 4 point scale
            </div>
        </div>
        <div class="report-footer">
            <div class="report-footer-box">
                <b>Days of Absence</b><br>
                Excused Absences: 2<br>
                Unexcused Absences: ${absences}
            </div>
            <div class="report-footer-box">
                <img src="https://i.imgur.com/2Q2R2Qb.png" alt="logo" style="height:40px;">
                <div style="margin-top:10px;font-size:0.95em;color:#888;">هذه الشهادة صادرة عن إدارة المدرسة<br>ومعتمدة رسمياً</div>
                <img src="https://i.imgur.com/0yQFQwF.png" alt="stamp" style="height:48px;margin-top:8px;">
            </div>
            <div class="report-footer-box">
                <b>Principal</b><br>
                Marah Kaddoura
                <div style="margin-top:10px;font-size:0.95em;color:#888;">التاريخ: ${reportDate}</div>
            </div>
        </div>
    `;
}

window.addEventListener('DOMContentLoaded', function() {
    renderStudentOptions();
    const sel = document.getElementById('student-select');
    if (students.length) {
        renderReport(sel.value);
    }
    sel.onchange = function() {
        renderReport(this.value);
    };
});

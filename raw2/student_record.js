// سجل الطالب: حضور، درجات، دفعات
// بيانات تجريبية
const attendance = [
    { date: '2025-05-01', status: 'حاضر' },
    { date: '2025-05-02', status: 'غائب' },
    { date: '2025-05-03', status: 'حاضر' }
];
const grades = [
    { subject: 'رياضيات', grade: 95, date: '2025-05-10' },
    { subject: 'لغة عربية', grade: 88, date: '2025-05-12' }
];
const payments = [
    { date: '2025-05-01', amount: 500, status: 'مدفوع' },
    { date: '2025-06-01', amount: 500, status: 'غير مدفوع' }
];
function renderAttendance() {
    const tbody = document.querySelector('#attendance-record tbody');
    tbody.innerHTML = '';
    attendance.forEach(a => {
        tbody.innerHTML += `<tr><td>${a.date}</td><td>${a.status}</td></tr>`;
    });
}
function renderGrades() {
    const tbody = document.querySelector('#grades-record tbody');
    tbody.innerHTML = '';
    grades.forEach(g => {
        tbody.innerHTML += `<tr><td>${g.subject}</td><td>${g.grade}</td><td>${g.date}</td></tr>`;
    });
}
function renderPayments() {
    const tbody = document.querySelector('#payments-record tbody');
    tbody.innerHTML = '';
    payments.forEach(p => {
        tbody.innerHTML += `<tr><td>${p.date}</td><td>${p.amount}</td><td>${p.status}</td></tr>`;
    });
}
// تصدير الجداول إلى PDF (باستخدام window.print)
function exportTableToPDF(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const win = window.open('', '', 'width=900,height=700');
    win.document.write('<html><head><title>تصدير الجدول</title>');
    win.document.write('<link rel="stylesheet" href="style.css">');
    win.document.write('</head><body >');
    win.document.write(table.outerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
}
// إضافة أزرار تصدير
window.onload = function() {
    renderAttendance();
    renderGrades();
    renderPayments();
    const attBtn = document.createElement('button');
    attBtn.innerText = 'تصدير سجل الحضور PDF';
    attBtn.onclick = () => exportTableToPDF('attendance-record');
    document.querySelector('.record-section').prepend(attBtn);
    const gradesBtn = document.createElement('button');
    gradesBtn.innerText = 'تصدير سجل الدرجات PDF';
    gradesBtn.onclick = () => exportTableToPDF('grades-record');
    document.querySelectorAll('.record-section')[1].prepend(gradesBtn);
    const payBtn = document.createElement('button');
    payBtn.innerText = 'تصدير سجل الدفعات PDF';
    payBtn.onclick = () => exportTableToPDF('payments-record');
    document.querySelectorAll('.record-section')[2].prepend(payBtn);
};

// إدارة الفواتير والدفع - bills_admin.js
let bills = [];

function loadBills() {
    const b = localStorage.getItem('bills');
    bills = b ? JSON.parse(b) : [];
}

function saveBills() {
    localStorage.setItem('bills', JSON.stringify(bills));
}

function renderBills() {
    const tbody = document.querySelector('#bills-admin-table tbody');
    tbody.innerHTML = '';
    bills.forEach((b, i) => {
        let actions = '';
        if (b.status !== 'مدفوع') {
            actions = `<button onclick=\"payBill(${i})\">دفع</button>`;
        } else {
            actions = `<button onclick=\"removeStudentByBill(${i})\" style='background:#d32f2f;'>حذف الطالب</button>`;
        }
        tbody.innerHTML += `<tr><td>${b.student}</td><td>${b.amount}</td><td>${b.status}</td><td>${actions}</td></tr>`;
    });
}

function showAddBill() {
    const form = document.createElement('form');
    form.innerHTML = `
        <label>اسم الطالب:<input type='text' id='bill-student' required></label><br>
        <label>المبلغ:<input type='number' id='bill-amount' required></label><br>
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
        const student = document.getElementById('bill-student').value;
        const amount = document.getElementById('bill-amount').value;
        bills.push({ student, amount, status: 'غير مدفوع' });
        saveBills();
        renderBills();
        showNotification('تمت إضافة الفاتورة بنجاح', 'success');
        form.remove();
    };
}

function payBill(idx) {
    bills[idx].status = 'مدفوع';
    saveBills();
    renderBills();
    showNotification('تم دفع الفاتورة بنجاح', 'success');
    // بعد الدفع، عرض خيار حذف الطالب
    setTimeout(() => {
        const row = document.querySelectorAll('#bills-admin-table tbody tr')[idx];
        if (row) {
            let delBtn = document.createElement('button');
            delBtn.innerText = 'حذف الطالب';
            delBtn.style.background = '#d32f2f';
            delBtn.style.color = '#fff';
            delBtn.style.marginRight = '0.5rem';
            delBtn.onclick = function() {
                let studentName = bills[idx].student;
                let students = JSON.parse(localStorage.getItem('students') || '[]');
                students = students.filter(s => s.name !== studentName);
                localStorage.setItem('students', JSON.stringify(students));
                showNotification('تم حذف الطالب المرتبط بالفاتورة', 'success');
                delBtn.disabled = true;
            };
            row.cells[3].appendChild(delBtn);
        }
    }, 100);
}

function removeStudentByBill(idx) {
    let studentName = bills[idx].student;
    let students = JSON.parse(localStorage.getItem('students') || '[]');
    students = students.filter(s => s.name !== studentName);
    localStorage.setItem('students', JSON.stringify(students));
    // حذف الفاتورة أيضاً
    bills.splice(idx, 1);
    saveBills();
    renderBills();
    showNotification('تم حذف الطالب والفاتورة المرتبطة به', 'success');
}

function filterBills() {
    const filter = document.getElementById('bill-search').value.toLowerCase();
    const rows = document.querySelectorAll('#bills-admin-table tbody tr');
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
    loadBills();
    renderBills();
};

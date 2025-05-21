// user_accounts.js
// إدارة إضافة وعرض حسابات المستخدمين مع تشفير كلمة المرور

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('user-account-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('user-email');
    const passwordInput = document.getElementById('user-password');
    const roleInput = document.getElementById('user-role');
    const tableBody = document.getElementById('accounts-table-body');

    // تشفير كلمة المرور بنفس طريقة login.js (SHA-256)
    async function hashPassword(password) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function loadAccounts() {
        tableBody.innerHTML = '';
        const accounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
        accounts.forEach((acc, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${acc.username}</td><td>${acc.email}</td><td>${acc.role}</td><td><button class='delete-btn' data-idx='${idx}'>حذف</button></td>`;
            tableBody.appendChild(tr);
        });
    }

    form.onsubmit = async function(e) {
        e.preventDefault();
        const acc = {
            username: usernameInput.value.trim(),
            email: emailInput.value.trim(),
            password: await hashPassword(passwordInput.value),
            role: roleInput.value
        };
        if(acc.username && acc.email && acc.password && acc.role) {
            // تحقق من عدم وجود مستخدم بنفس الاسم والدور
            const accounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
            const exists = accounts.find(u => u.username === acc.username && u.role === acc.role);
            if (exists) {
                alert('يوجد مستخدم بنفس الاسم والدور بالفعل!');
                return;
            }
            accounts.push(acc);
            localStorage.setItem('userAccounts', JSON.stringify(accounts));
            form.reset();
            loadAccounts();
        }
    };

    tableBody.addEventListener('click', function(e) {
        if(e.target.classList.contains('delete-btn')) {
            const idx = e.target.getAttribute('data-idx');
            const accounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
            accounts.splice(idx, 1);
            localStorage.setItem('userAccounts', JSON.stringify(accounts));
            loadAccounts();
        }
    });

    // تمت إزالة زر إضافة الحسابات التلقائية بناءً على طلب المستخدم

    loadAccounts();
});

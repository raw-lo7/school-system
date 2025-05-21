// ترجمة نصوص واجهة تسجيل الدخول
const translations = {
    ar: {
        'login-title': 'تسجيل الدخول',
        'label-username': 'اسم المستخدم',
        'label-password': 'كلمة المرور',
        'label-role': 'الدور',
        'login-btn': 'دخول',
        'admin': 'إدارة',
        'teacher': 'مدرس',
        'student': 'طالب',
        'login-error': 'بيانات الدخول غير صحيحة!'
    },
    en: {
        'login-title': 'Login',
        'label-username': 'Username',
        'label-password': 'Password',
        'label-role': 'Role',
        'login-btn': 'Login',
        'admin': 'Admin',
        'teacher': 'Teacher',
        'student': 'Student',
        'login-error': 'Invalid login credentials!'
    }
};

// تغيير اللغة
function setLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    for (const key in translations[lang]) {
        const el = document.getElementById(key);
        if (el) {
            if (el.tagName === 'OPTION') {
                el.textContent = translations[lang][key];
            } else {
                el.innerText = translations[lang][key];
            }
        }
    }
    // تحديث خيارات الدور
    document.querySelector('#role option[value="admin"]').textContent = translations[lang]['admin'];
    document.querySelector('#role option[value="teacher"]').textContent = translations[lang]['teacher'];
    document.querySelector('#role option[value="student"]').textContent = translations[lang]['student'];
}

document.getElementById('ar-btn').onclick = () => setLang('ar');
document.getElementById('en-btn').onclick = () => setLang('en');

// تشفير كلمة المرور SHA-256
async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// بيانات مستخدمين تجريبية (يمكن ربطها بقاعدة بيانات لاحقاً)
// تصحيح تشفير كلمة مرور admin (SHA-256 الصحيح لكلمة 'admin')
// SHA-256('admin') = 8c6976e5b5410415bde908bd4dee15dfb16a7a60c6f6a2a6a3e6a5a5
const users = [
    { username: 'admin', password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', role: 'admin' }, // كلمة المرور: admin
    { username: 'teacher', password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', role: 'teacher' }, // كلمة المرور: password
    { username: 'student', password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', role: 'student' } // كلمة المرور: password
];

// حفظ المستخدمين في LocalStorage عند أول دخول
if(!localStorage.getItem('users_db')) {
    localStorage.setItem('users_db', JSON.stringify([
        { username: 'admin', password: users[0].password, role: 'admin' },
        { username: 'teacher', password: users[1].password, role: 'teacher' },
        { username: 'student', password: users[2].password, role: 'student' }
    ]));
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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').onsubmit = async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        const hash = await sha256(password);
        // البحث في المستخدمين التجريبيين
        let user = users.find(u => u.username === username && u.password === hash && u.role === role);
        // البحث في الحسابات المضافة من صفحة المستخدمين
        const accounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
        // البحث في قاعدة بيانات المستخدمين (users_db)
        const usersDb = JSON.parse(localStorage.getItem('users_db') || '[]');
        // توحيد القيم البرمجية للدور
        let roleValue = role;
        if (role === 'مدير' || role === 'إدارة') roleValue = 'admin';
        if (role === 'معلم' || role === 'مدرس') roleValue = 'teacher';
        if (role === 'طالب') roleValue = 'student';
        if (!user) {
            user = accounts.find(u => u.username === username && u.password === hash && u.role === roleValue);
        }
        if (!user) {
            user = usersDb.find(u => u.username === username && u.password === hash && u.role === roleValue);
        }
        if (user) {
            // حفظ معلومات الجلسة
            localStorage.setItem('user', JSON.stringify({ username, role }));
            // توجيه حسب الدور
            if (role === 'admin') window.location.href = 'admin.html';
            else if (role === 'teacher') window.location.href = 'teacher.html';
            else window.location.href = 'student.html';
        } else {
            const lang = document.documentElement.lang;
            document.getElementById('login-error').innerText = translations[lang]['login-error'];
            showNotification(translations[lang]['login-error'], 'error');
            // طباعة جميع الحسابات للمساعدة في التشخيص
            alert('بيانات الدخول غير صحيحة!\n\n' +
                'hash: ' + hash +
                '\nusername: ' + username +
                '\nrole: ' + role +
                '\n\nالحسابات التجريبية:\n' + JSON.stringify(users, null, 2) +
                '\n\nالحسابات المضافة:\n' + JSON.stringify(accounts, null, 2)
            );
        }
    };
    // تعيين اللغة الافتراضية
    setLang('ar');

    // تفعيل الوضع الليلي
    function toggleNightMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('nightMode', document.body.classList.contains('dark-mode'));
    }
    if (localStorage.getItem('nightMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    // زر الوضع الليلي في الأعلى
    let btn = document.createElement('button');
    btn.className = 'night-btn';
    btn.innerText = 'الوضع الليلي';
    btn.onclick = toggleNightMode;
    document.body.appendChild(btn);

    // تمت إزالة زر مسح جميع المستخدمين بالكامل بناءً على طلب المستخدم
});

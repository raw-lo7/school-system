// ملف شخصي للمستخدم
const user = JSON.parse(localStorage.getItem('user') || '{}');
const infoDiv = document.getElementById('profile-info');
const avatarImg = document.getElementById('profile-avatar');

// عرض اسم المستخدم والدور
if(user.username) {
    infoDiv.innerHTML = `<b>اسم المستخدم:</b> ${user.username}<br><b>الدور:</b> ${user.role}`;
    // تحميل صورة رمزية محفوظة
    const savedAvatar = localStorage.getItem('avatar_' + user.username);
    if(savedAvatar) avatarImg.src = savedAvatar;
} else {
    infoDiv.innerHTML = '<span style="color:red">لم يتم تسجيل الدخول!</span>';
}

// تغيير الصورة الرمزية
const avatarInput = document.getElementById('avatar-input');
avatarInput.onchange = function(e) {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            avatarImg.src = evt.target.result;
            localStorage.setItem('avatar_' + user.username, evt.target.result);
        };
        reader.readAsDataURL(file);
    }
};

// تغيير كلمة المرور
const passwordForm = document.getElementById('password-form');
const passwordSuccess = document.getElementById('password-success');
const passwordError = document.getElementById('password-error');
if(passwordForm) {
    passwordForm.onsubmit = async function(e) {
        e.preventDefault();
        passwordSuccess.style.display = 'none';
        passwordError.style.display = 'none';
        const oldPass = document.getElementById('old-password').value;
        const newPass = document.getElementById('new-password').value;
        if(!oldPass || !newPass) {
            passwordError.textContent = 'يرجى إدخال جميع الحقول';
            passwordError.style.display = 'block';
            return;
        }
        let users = JSON.parse(localStorage.getItem('users_db') || '[]');
        let idx = users.findIndex(u => u.username === user.username);
        let userUpdated = false;
        if(idx !== -1) {
            const hashOld = await sha256(oldPass);
            if(users[idx].password !== hashOld) {
                passwordError.textContent = 'كلمة المرور الحالية غير صحيحة';
                passwordError.style.display = 'block';
                return;
            }
            const hashNew = await sha256(newPass);
            users[idx].password = hashNew;
            localStorage.setItem('users_db', JSON.stringify(users));
            userUpdated = true;
        }
        // تحديث كلمة المرور في userAccounts إذا كان المستخدم من هناك
        let accounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
        let accIdx = accounts.findIndex(u => u.username === user.username && u.role === user.role);
        if(accIdx !== -1) {
            const hashOld = await sha256(oldPass);
            if(accounts[accIdx].password !== hashOld) {
                passwordError.textContent = 'كلمة المرور الحالية غير صحيحة';
                passwordError.style.display = 'block';
                return;
            }
            const hashNew = await sha256(newPass);
            accounts[accIdx].password = hashNew;
            localStorage.setItem('userAccounts', JSON.stringify(accounts));
            userUpdated = true;
        }
        if(userUpdated) {
            passwordSuccess.textContent = 'تم تغيير كلمة المرور بنجاح';
            passwordSuccess.style.display = 'block';
            passwordForm.reset();
        } else {
            passwordError.textContent = 'حدث خطأ في الحساب';
            passwordError.style.display = 'block';
        }
    };
}

// دالة sha256 (نفس المستخدمة في login.js)
async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
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

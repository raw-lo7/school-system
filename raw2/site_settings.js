// إعدادات الموقع
const siteNameInput = document.getElementById('site-name-input');
const siteLang = document.getElementById('site-lang');
const siteTheme = document.getElementById('site-theme');
const form = document.getElementById('site-settings-form');
const successDiv = document.getElementById('settings-success');

// تحميل الإعدادات من LocalStorage
window.onload = function() {
    const name = localStorage.getItem('siteName') || 'النظام المدرسي';
    siteNameInput.value = name;
    const lang = localStorage.getItem('siteLang') || 'ar';
    siteLang.value = lang;
    const theme = localStorage.getItem('siteTheme') || 'light';
    siteTheme.value = theme;
};

form.onsubmit = function(e) {
    e.preventDefault();
    localStorage.setItem('siteName', siteNameInput.value);
    localStorage.setItem('siteLang', siteLang.value);
    localStorage.setItem('siteTheme', siteTheme.value);
    successDiv.innerText = 'تم حفظ الإعدادات بنجاح!';
    setTimeout(() => { successDiv.innerText = ''; }, 2000);
    // تطبيق الإعدادات فوراً
    document.title = siteNameInput.value + ' | إعدادات الموقع';
    if(siteTheme.value === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
};

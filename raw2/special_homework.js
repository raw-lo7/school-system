// special_homework.js
// إدارة إضافة وعرض الواجبات

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('special-homework-form');
    const titleInput = document.getElementById('homework-title');
    const descInput = document.getElementById('homework-desc');
    const subjectInput = document.getElementById('homework-subject');
    const dateInput = document.getElementById('homework-date');
    const listUl = document.getElementById('homework-list-ul');
    const fileInput = document.getElementById('homework-file');
    const linkInput = document.getElementById('homework-link');

    // تحميل الواجبات من LocalStorage
    function loadHomeworks() {
        listUl.innerHTML = '';
        const homeworks = JSON.parse(localStorage.getItem('specialHomeworks') || '[]');
        homeworks.forEach((hw, idx) => {
            let fileLink = '';
            if(hw.fileName && hw.fileData) {
                fileLink = `<br><a href="${hw.fileData}" download="${hw.fileName}" style="color:#1976d2">تحميل الملف</a>`;
            }
            let extLink = '';
            if(hw.link) {
                extLink = `<br><a href="${hw.link}" target="_blank" style="color:#388e3c">رابط خارجي</a>`;
            }
            const li = document.createElement('li');
            li.innerHTML = `<strong>${hw.title}</strong> - ${hw.subject} <br> ${hw.desc} <br> <span style='color:#888'>تسليم: ${hw.date}</span>${fileLink}${extLink} <button data-idx='${idx}' class='delete-btn'>حذف</button>`;
            listUl.appendChild(li);
        });
    }

    // إضافة واجب جديد
    form.onsubmit = async function(e) {
        e.preventDefault();
        let fileName = '', fileData = '';
        if(fileInput.files && fileInput.files[0]) {
            fileName = fileInput.files[0].name;
            fileData = await toBase64(fileInput.files[0]);
        }
        const hw = {
            title: titleInput.value.trim(),
            desc: descInput.value.trim(),
            subject: subjectInput.value.trim(),
            date: dateInput.value,
            fileName,
            fileData,
            link: linkInput.value.trim()
        };
        if(hw.title && hw.desc && hw.subject && hw.date) {
            const homeworks = JSON.parse(localStorage.getItem('specialHomeworks') || '[]');
            homeworks.push(hw);
            localStorage.setItem('specialHomeworks', JSON.stringify(homeworks));
            form.reset();
            loadHomeworks();
        }
    };

    // حذف واجب
    listUl.addEventListener('click', function(e) {
        if(e.target.classList.contains('delete-btn')) {
            const idx = e.target.getAttribute('data-idx');
            const homeworks = JSON.parse(localStorage.getItem('specialHomeworks') || '[]');
            homeworks.splice(idx, 1);
            localStorage.setItem('specialHomeworks', JSON.stringify(homeworks));
            loadHomeworks();
        }
    });

    loadHomeworks();
});

// تحويل ملف إلى base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

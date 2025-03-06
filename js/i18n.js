// 获取浏览器语言设置
function getBrowserLanguage() {
    // 获取浏览器语言，并取前两位字符（如 'zh-CN' 变为 'zh'）
    const browserLang = navigator.language.substring(0, 2);
    // 检查是否支持该语言，如果不支持则返回默认语言 'zh'
    return Object.keys(translations).includes(browserLang) ? browserLang : 'zh';
}

// 获取当前语言，优先使用localStorage存储的语言，其次使用浏览器语言
let currentLang = localStorage.getItem('language') || getBrowserLanguage();

// 切换语言的函数
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    updateContent();
}

// 切换语言菜单的显示/隐藏
function toggleLangMenu() {
    const menu = document.querySelector('.lang-menu');
    menu.classList.toggle('show');
    
    // 点击其他地方关闭菜单
    const closeMenu = (e) => {
        if (!e.target.closest('.language-switcher')) {
            menu.classList.remove('show');
            document.removeEventListener('click', closeMenu);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 0);
}

// 更新当前选中的语言显示
function updateCurrentLang() {
    const currentLangElement = document.querySelector('.lang-btn .current-lang');
    if (currentLangElement) {
        currentLangElement.textContent = translations[currentLang]['currentLang'];
    }
}

// 更新页面内容
function updateContent() {
    // 更新普通文本内容
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            if (element.tagName === 'TITLE') {
                document.title = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });

    // 更新 placeholder 属性
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.placeholder = translations[currentLang][key];
        }
    });

    // 更新 HTML 标签的 lang 属性
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    
    // 更新当前语言显示
    updateCurrentLang();
}

// 页面加载完成后初始化语言
document.addEventListener('DOMContentLoaded', () => {
    updateContent();
}); 
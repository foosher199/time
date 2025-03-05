// 更新当前时间显示
function updateCurrentTime() {
    const now = new Date();
    
    // 更新当前时间
    document.getElementById('current-time').textContent = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    // 更新时间戳（秒）
    const timestampSeconds = Math.floor(now.getTime() / 1000);
    const secondsElement = document.getElementById('current-timestamp-seconds');
    secondsElement.textContent = timestampSeconds;
    
    // 更新时间戳（毫秒）
    const timestampMilliseconds = now.getTime();
    const millisecondsElement = document.getElementById('current-timestamp-milliseconds');
    millisecondsElement.textContent = timestampMilliseconds;
}

// 时间戳转换
function convertTimestamp() {
    const timestamp = document.getElementById('timestamp').value;
    const type = document.getElementById('timestamp-type').value;
    const resultElement = document.getElementById('timestamp-result');
    
    if (!timestamp) {
        resultElement.textContent = '请输入时间戳';
        return;
    }

    try {
        let milliseconds = type === 'seconds' ? timestamp * 1000 : timestamp;
        const date = new Date(Number(milliseconds));
        
        if (isNaN(date.getTime())) {
            throw new Error('无效的时间戳');
        }

        resultElement.textContent = date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    } catch (error) {
        resultElement.textContent = error.message;
    }
}

// 时区转换
function convertTimezone() {
    const datetimeInput = document.getElementById('datetime-input').value;
    const fromTimezone = document.getElementById('from-timezone').value;
    const toTimezone = document.getElementById('to-timezone').value;
    const resultElement = document.getElementById('timezone-result');

    if (!datetimeInput) {
        resultElement.textContent = '请选择时间';
        return;
    }

    try {
        const date = new Date(datetimeInput);
        
        if (fromTimezone === 'UTC' && toTimezone === 'local') {
            const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
            resultElement.textContent = localDate.toLocaleString();
        } else if (fromTimezone === 'local' && toTimezone === 'UTC') {
            const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            resultElement.textContent = utcDate.toISOString();
        }
    } catch (error) {
        resultElement.textContent = '转换出错';
    }
}

// 时间格式化
function formatTime() {
    const dateInput = document.getElementById('format-input').value;
    const formatType = document.getElementById('format-type').value;
    const resultElement = document.getElementById('format-result');

    if (!dateInput) {
        resultElement.textContent = '请选择时间';
        return;
    }

    try {
        const date = new Date(dateInput);
        
        switch (formatType) {
            case 'YYYY-MM-DD HH:mm:ss':
                resultElement.textContent = date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
                break;
            case 'MM/DD/YYYY':
                resultElement.textContent = date.toLocaleDateString('en-US');
                break;
            case 'relative':
                resultElement.textContent = getRelativeTimeString(date);
                break;
        }
    } catch (error) {
        resultElement.textContent = '格式化出错';
    }
}

// 计算相对时间
function getRelativeTimeString(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return '刚刚';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}个月前`;
    return `${Math.floor(diffInSeconds / 31536000)}年前`;
}

// 修改复制到剪贴板功能
async function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    const button = element.nextElementSibling;

    try {
        await navigator.clipboard.writeText(text);
        
        // 添加复制成功的动画效果
        button.classList.add('copy-success');
        setTimeout(() => {
            button.classList.remove('copy-success');
        }, 300);

        // 显示Toast提示
        showToast('复制成功！');
    } catch (err) {
        showToast('复制失败，请重试');
        console.error('复制失败:', err);
    }
}

// 添加Toast提示功能
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// 添加时间转时间戳功能
function convertDateToTimestamp() {
    const dateInput = document.getElementById('date-input').value;
    const outputType = document.getElementById('output-timestamp-type').value;
    const resultElement = document.getElementById('timestamp-result');

    if (!dateInput) {
        resultElement.textContent = '请选择时间';
        return;
    }

    try {
        const date = new Date(dateInput);
        const timestamp = date.getTime();
        
        if (isNaN(timestamp)) {
            throw new Error('无效的时间');
        }

        if (outputType === 'seconds') {
            resultElement.textContent = Math.floor(timestamp / 1000);
        } else {
            resultElement.textContent = timestamp;
        }
    } catch (error) {
        resultElement.textContent = error.message;
    }
}

// 修改 DOMContentLoaded 事件处理函数
document.addEventListener('DOMContentLoaded', () => {
    // 更新当前时间显示
    updateCurrentTime();
    // 每秒更新一次
    setInterval(updateCurrentTime, 1000);
    
    // 设置所有datetime-local输入框的当前时间
    const now = new Date();
    const timeString = now.toISOString().slice(0, 16);
    document.getElementById('datetime-input').value = timeString;
    document.getElementById('format-input').value = timeString;
    document.getElementById('date-input').value = timeString;

    // 添加转换模式切换功能
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新按钮状态
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 切换输入组显示
            const mode = this.dataset.mode;
            document.getElementById('timestamp-to-date-group').style.display = 
                mode === 'timestamp-to-date' ? 'flex' : 'none';
            document.getElementById('date-to-timestamp-group').style.display = 
                mode === 'date-to-timestamp' ? 'flex' : 'none';
            
            // 清空结果
            document.getElementById('timestamp-result').textContent = '';
        });
    });
}); 
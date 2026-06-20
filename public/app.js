// Định nghĩa cấu trúc lộ trình chuẩn của DailyDictation
const COURSE_CATALOG = [
    // Giai đoạn 1: Nền tảng
    { phase: 1, key: 'ipa', title: 'IPA (Phát âm)', link: '/exercises/english-pronunciation', defaultTotal: 42, levels: 'A1' },
    { phase: 1, key: 'numbers', title: 'Numbers (Chữ số)', link: '/exercises/numbers', defaultTotal: 9, levels: 'A1' },
    { phase: 1, key: 'spelling', title: 'Spelling Names (Đánh vần tên)', link: '/exercises/spelling-names', defaultTotal: 6, levels: 'A1' },
    
    // Giai đoạn 2: Giao tiếp cơ bản
    { phase: 2, key: 'conversations', title: 'Conversations (Hội thoại)', link: '/exercises/english-conversations', defaultTotal: 100, levels: 'A1-B1' },
    { phase: 2, key: 'kids', title: 'Stories for Kids (Chuyện thiếu nhi)', link: '/exercises/stories-for-kids', defaultTotal: 13, levels: 'A2-B2' },
    
    // Giai đoạn 3: Tăng tốc
    { phase: 3, key: 'stories', title: 'Short Stories (Truyện ngắn)', link: '/exercises/short-stories', defaultTotal: 289, levels: 'A1-C1' },
    { phase: 3, key: 'toeic', title: 'TOEIC Listening', link: '/exercises/toeic', defaultTotal: 600, levels: 'A2-C1' },
    { phase: 3, key: 'news', title: 'News (Tin tức)', link: '/exercises/news', defaultTotal: 207, levels: 'B1-C1' },
    
    // Giai đoạn 4: Chuyên sâu & Học thuật
    { phase: 4, key: 'ielts', title: 'IELTS Listening', link: '/exercises/ielts-listening', defaultTotal: 344, levels: 'B1-C1' },
    { phase: 4, key: 'youtube', title: 'Random Videos (Video tự do)', link: '/exercises/youtube', defaultTotal: 181, levels: 'B1-C2' },
    { phase: 4, key: 'ted', title: 'TED-Ed', link: '/exercises/ted-ed', defaultTotal: 90, levels: 'C1-C2' },
    { phase: 4, key: 'toefl', title: 'TOEFL Listening', link: '/exercises/toefl-listening', defaultTotal: 54, levels: 'B1-C2' },
    { phase: 4, key: 'medical', title: 'Medical English (OET)', link: '/exercises/medical-english-oet', defaultTotal: 80, levels: 'B1-C2' }
];

// Trạng thái ứng dụng
let appState = {
    profileName: 'Học viên',
    lastUpdated: null,
    courses: COURSE_CATALOG.map(c => ({ ...c, completed: 0, total: c.defaultTotal })),
    lessonsPerDay: 3
};

// URL gốc của DailyDictation để tạo link
const BASE_URL = 'https://dailydictation.com';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initBookmarklet();
    initModal();
    initPlannerInputs();
    initDragAndDrop();
    initSearchAndFilter();
    initNotesModal();
    initBackupRestore();
    initExcludeToggle();
    initPomodoro();
    initNotesTabs();
    initFlashcardEvents();
    initShareModal();
    fetchProgress();
});

// -------------------------------------------------------------
// Quản lý Giao diện (Theme)
// -------------------------------------------------------------
function initTheme() {
    const btnToggle = document.getElementById('btn-theme-toggle');
    const icon = document.getElementById('theme-icon');
    
    let currentTheme = localStorage.getItem('appTheme') || 'dark';
    applyTheme(currentTheme);

    if (btnToggle) {
        btnToggle.addEventListener('click', () => {
            let targetTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
            applyTheme(targetTheme);
            localStorage.setItem('appTheme', targetTheme);
        });
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            if (icon) icon.className = 'bi bi-moon-fill';
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            if (icon) icon.className = 'bi bi-sun-fill';
        }
    }
}

// -------------------------------------------------------------
// Thiết lập Bookmarklet
// -------------------------------------------------------------
function initBookmarklet() {
    const appOrigin = window.location.origin;
    // Bộ mã dấu trang nâng cao quét chi tiết từng khóa học để đếm sao vàng
    const jsCode = `javascript:(async()=>{if(!window.location.hostname.includes('dailydictation.com')){alert('⚠️ Ní ơi, hãy mở trang web dailydictation.com/exercises và đăng nhập trước rồi mới bấm nút dấu trang này nha!');return;}var links=['/exercises/english-pronunciation','/exercises/numbers','/exercises/spelling-names','/exercises/english-conversations','/exercises/stories-for-kids','/exercises/short-stories','/exercises/toeic','/exercises/news','/exercises/ielts-listening','/exercises/youtube','/exercises/ted-ed','/exercises/toefl-listening','/exercises/medical-english-oet'];var l=document.createElement('div');Object.assign(l.style,{position:'fixed',top:'20px',right:'20px',padding:'16px 24px',background:'#6366f1',color:'#fff',borderRadius:'8px',zIndex:'999999',fontFamily:'sans-serif',boxShadow:'0 4px 12px rgba(0,0,0,0.2)'});l.innerText='⏳ Đang đồng bộ... 0%';document.body.appendChild(l);var name='Học viên';var nav=document.querySelector('.navbar .dropdown-toggle, [data-test="login-link"]');if(nav&&!nav.innerText.includes('Login'))name=nav.innerText.trim();var courses=[];var parser=new DOMParser();for(var i=0;i<links.length;i++){var link=links[i];try{var res=await fetch(link);if(res.ok){var html=await res.text();var doc=parser.parseFromString(html,'text/html');var comp=doc.querySelectorAll('.bi-star-fill').length;var tot=doc.querySelectorAll('.bi-star, .bi-star-fill').length;var titleEl=doc.querySelector('h1');var title=titleEl?titleEl.innerText.trim():link.split('/').pop();courses.push({title:title,link:link,completed:comp,total:tot>0?tot:10});}}catch(e){console.error(e);}l.innerText='⏳ Đang đồng bộ... '+Math.round(((i+1)/links.length)*100)+'%';}var payload={profileName:name,timestamp:new Date().toISOString(),courses:courses};var payloadStr=JSON.stringify(payload);var b64=btoa(unescape(encodeURIComponent(payloadStr)));try{var sync=await fetch('http://localhost:3000/api/sync',{method:'POST',headers:{'Content-Type':'application/json'},body:payloadStr});l.remove();if(sync.ok){alert('🎉 Đồng bộ tiến độ thành công! Hãy F5 lại trang localhost:3000 để xem kết quả nhé!');}else{throw new Error();}}catch(err){l.remove();window.location.href='${appOrigin}/#data='+b64;}})();`;
    
    const bookmarkLink = document.getElementById('bookmarklet-btn');
    if (bookmarkLink) {
        bookmarkLink.setAttribute('href', jsCode);
    }
}

// -------------------------------------------------------------
// Xử lý Modal Hướng dẫn
// -------------------------------------------------------------
function initModal() {
    const modal = document.getElementById('sync-modal');
    const btnOpen = document.getElementById('btn-sync-modal');
    const btnClose = document.getElementById('btn-close-modal');

    btnOpen.addEventListener('click', () => modal.classList.add('show'));
    btnClose.addEventListener('click', () => modal.classList.remove('show'));

    // Đóng khi click ra ngoài
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// -------------------------------------------------------------
// Xử lý mục tiêu học tập (Planner Inputs)
// -------------------------------------------------------------
function initPlannerInputs() {
    const inputDays = document.getElementById('lessons-per-day');
    const inputWeeks = document.getElementById('lessons-per-week');
    
    // Đọc mục tiêu cũ nếu có
    const savedTarget = localStorage.getItem('lessonsPerDay');
    if (savedTarget) {
        appState.lessonsPerDay = parseInt(savedTarget, 10);
        if (inputDays) inputDays.value = appState.lessonsPerDay;
    }

    if (inputDays) {
        inputDays.addEventListener('input', (e) => {
            let val = parseInt(e.target.value, 10);
            if (isNaN(val) || val < 1) val = 1;
            appState.lessonsPerDay = val;
            localStorage.setItem('lessonsPerDay', val);
            updateCalculations();
        });
    }

    if (inputWeeks) {
        const savedTargetWeek = localStorage.getItem('lessonsPerWeek') || 15;
        appState.lessonsPerWeek = parseInt(savedTargetWeek, 10);
        inputWeeks.value = appState.lessonsPerWeek;

        inputWeeks.addEventListener('input', (e) => {
            let val = parseInt(e.target.value, 10);
            if (isNaN(val) || val < 1) val = 1;
            appState.lessonsPerWeek = val;
            localStorage.setItem('lessonsPerWeek', val);
            updateCalculations();
        });
    }
}

// -------------------------------------------------------------
// Kéo thả và Tải file Tiến trình thủ công
// -------------------------------------------------------------
function initDragAndDrop() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    if (!dropZone || !fileInput) return;

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

function handleFiles(files) {
    if (files.length === 0) return;
    const file = files[0];
    if (file.type !== "application/json" && !file.name.endsWith('.json')) {
        alert('Vui lòng chọn file JSON có tên "dailydictation_progress.json"');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            uploadProgressData(data);
        } catch (err) {
            alert('Lỗi định dạng file JSON. Vui lòng tải lại đúng file tải về từ bookmarklet.');
        }
    };
    reader.readAsText(file);
}

// Gửi file JSON lên backend để lưu
async function uploadProgressData(payload) {
    // Lưu vào localStorage trước tiên để hỗ trợ serverless
    saveProgressAndLogCompletions(payload);

    try {
        const res = await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
            alert('Đồng bộ file thành công!');
            document.getElementById('sync-modal').classList.remove('show');
            fetchProgress();
        } else {
            alert('Đã đồng bộ cục bộ vào trình duyệt! (Server local không khả dụng để ghi file)');
            document.getElementById('sync-modal').classList.remove('show');
            fetchProgress();
        }
    } catch (err) {
        alert('Đã đồng bộ cục bộ vào trình duyệt!');
        document.getElementById('sync-modal').classList.remove('show');
        fetchProgress();
    }
}

// Giải mã và lưu dữ liệu tiến độ từ URL hash
function checkUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#data=')) {
        try {
            const base64Data = hash.substring(6);
            const decodedStr = decodeURIComponent(escape(atob(base64Data)));
            const payload = JSON.parse(decodedStr);
            
            // Lưu vào localStorage
            saveProgressAndLogCompletions(payload);
            
            // Gửi lên backend nếu có chạy local
            fetch('/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(e => {});
            
            // Xóa hash trên URL mà không load lại trang
            history.replaceState(null, null, ' ');
            alert('🎉 Đồng bộ tiến độ học tập thành công!');
            return payload;
        } catch (e) {
            console.error('Lỗi giải mã hash data:', e);
        }
    }
    return null;
}

// Map dữ liệu tiến độ vào danh mục chuẩn
function mapProgressData(serverCourses) {
    return COURSE_CATALOG.map(catalog => {
        const matched = serverCourses.find(srv => 
            srv.link === catalog.link || 
            srv.title.toLowerCase() === catalog.title.toLowerCase()
        );
        
        return {
            ...catalog,
            completed: matched ? matched.completed : 0,
            total: matched ? matched.total : catalog.defaultTotal
        };
    });
}

// Lấy dữ liệu Tiến độ từ API hoặc LocalStorage
// -------------------------------------------------------------
async function fetchProgress() {
    // 1. Kiểm tra xem có dữ liệu trên hash URL không
    const hashData = checkUrlHash();
    if (hashData) {
        appState.profileName = hashData.profileName || 'Học viên';
        appState.lastUpdated = hashData.timestamp || new Date().toISOString();
        appState.courses = mapProgressData(hashData.courses);
        updateUI();
        return;
    }

    // 2. Kiểm tra dữ liệu trong LocalStorage
    const localData = localStorage.getItem('userProgress');
    if (localData) {
        try {
            const data = JSON.parse(localData);
            appState.profileName = data.profileName || 'Học viên';
            appState.lastUpdated = data.timestamp || data.lastUpdated;
            appState.courses = mapProgressData(data.courses);
            updateUI();
            
            // Đồng bộ ngầm với backend nếu khả dụng
            fetch('/api/progress')
                .then(res => res.json())
                .then(srvData => {
                    if (srvData.lastUpdated && new Date(srvData.lastUpdated) > new Date(appState.lastUpdated)) {
                        appState.profileName = srvData.profileName;
                        appState.lastUpdated = srvData.lastUpdated;
                        appState.courses = mapProgressData(srvData.courses);
                        localStorage.setItem('userProgress', JSON.stringify({
                            profileName: srvData.profileName,
                            timestamp: srvData.lastUpdated,
                            courses: srvData.courses
                        }));
                        updateUI();
                    }
                }).catch(e => {});
            return;
        } catch(e) {}
    }

    // 3. Lấy từ API cục bộ (Backend Express)
    try {
        const res = await fetch('/api/progress');
        const data = await res.json();
        
        if (data.courses && data.courses.length > 0) {
            appState.profileName = data.profileName || 'Học viên';
            appState.lastUpdated = data.lastUpdated;
            appState.courses = mapProgressData(data.courses);
            
            localStorage.setItem('userProgress', JSON.stringify({
                profileName: data.profileName,
                timestamp: data.lastUpdated,
                courses: data.courses
            }));
        }
        updateUI();
    } catch (err) {
        console.error('Không thể tải tiến độ từ server', err);
        updateUI();
    }
}

// -------------------------------------------------------------
// Cập nhật Giao diện người dùng
// -------------------------------------------------------------
function updateUI() {
    // 1. Cập nhật thông tin Header
    document.getElementById('profile-name').innerText = appState.profileName;
    if (appState.lastUpdated) {
        const date = new Date(appState.lastUpdated);
        document.getElementById('sync-time').innerText = `Đã cập nhật: ${date.toLocaleTimeString()} - ${date.toLocaleDateString('vi-VN')}`;
    } else {
        document.getElementById('sync-time').innerText = 'Chưa đồng bộ dữ liệu học tập';
    }

    // 2. Render các khóa học theo từng Giai đoạn
    for (let phase = 1; phase <= 4; phase++) {
        renderPhaseCourses(phase);
    }

    // 3. Tính toán và cập nhật biểu đồ tổng
    updateCalculations();
}

let currentFilter = 'all';
let searchQuery = '';

function renderPhaseCourses(phaseNum) {
    const container = document.getElementById(`phase-${phaseNum}-courses`);
    if (!container) return;
    
    container.innerHTML = '';
    let phaseCourses = appState.courses.filter(c => c.phase === phaseNum);
    
    // Áp dụng bộ lọc tìm kiếm
    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        phaseCourses = phaseCourses.filter(c => 
            c.title.toLowerCase().includes(query) || 
            c.levels.toLowerCase().includes(query)
        );
    }

    // Áp dụng bộ lọc trạng thái & bỏ qua khóa học
    const excludedCourses = JSON.parse(localStorage.getItem('excludedCourses')) || {};
    
    if (currentFilter !== 'all') {
        phaseCourses = phaseCourses.filter(c => {
            const isExcluded = excludedCourses[c.key] === true;
            if (isExcluded) return false;

            const isCompleted = c.completed >= c.total && c.total > 0;
            const isLearning = !isCompleted && c.completed > 0;
            const isUnstarted = c.completed === 0;

            if (currentFilter === 'completed') return isCompleted;
            if (currentFilter === 'learning') return isLearning;
            if (currentFilter === 'unstarted') return isUnstarted;
            return true;
        });
    }

    // Ẩn/hiện Giai đoạn nếu không có khóa học nào khớp
    const phaseEl = document.getElementById(`phase-${phaseNum}`);
    if (phaseEl) {
        if (phaseCourses.length === 0) {
            phaseEl.style.display = 'none';
        } else {
            phaseEl.style.display = 'block';
        }
    }

    const notes = JSON.parse(localStorage.getItem('courseNotes')) || {};

    phaseCourses.forEach(course => {
        const pct = course.total > 0 ? Math.round((course.completed / course.total) * 100) : 0;
        
        const isCompleted = course.completed >= course.total && course.total > 0;
        const isExcluded = excludedCourses[course.key] === true;
        const isActive = !isExcluded && !isCompleted && (course.completed > 0 || isCourseNextInQueue(course));
        
        let statusClass = '';
        let statusIcon = '<i class="bi bi-circle"></i>';
        
        if (isExcluded) {
            statusClass = 'excluded';
            statusIcon = '<i class="bi bi-eye-slash-fill text-danger"></i>';
        } else if (isCompleted) {
            statusClass = 'completed';
            statusIcon = '<i class="bi bi-check-circle-fill"></i>';
        } else if (isActive) {
            statusClass = 'active';
            statusIcon = '<i class="bi bi-play-circle-fill"></i>';
        }

        const hasNote = notes[course.key] && notes[course.key].trim() !== '';
        const noteBtnColor = hasNote ? 'color: var(--primary-color);' : 'color: var(--text-dark);';
        const noteBtnTitle = hasNote ? 'Xem/Sửa ghi chú (Đã có ghi chú)' : 'Thêm ghi chú';

        const excludeBtnColor = isExcluded ? 'color: var(--color-danger);' : 'color: var(--text-dark);';
        const excludeBtnTitle = isExcluded ? 'Khôi phục khóa học' : 'Bỏ qua khóa học';
        const excludeIcon = isExcluded ? 'bi-eye-slash-fill' : 'bi-eye-slash';
        
        const cardHtml = `
            <div class="course-item ${statusClass}">
                <div class="course-item-header">
                    <a href="${BASE_URL}${course.link}" target="_blank" class="course-item-title">${course.title}</a>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button class="btn-note" data-course-key="${course.key}" title="${noteBtnTitle}" style="${noteBtnColor}">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn-exclude" data-course-key="${course.key}" title="${excludeBtnTitle}" style="${excludeBtnColor}">
                            <i class="bi ${excludeIcon}"></i>
                        </button>
                        <span class="course-status-icon">${statusIcon}</span>
                    </div>
                </div>
                <div class="course-meta">
                    <span class="course-level">Lv: ${course.levels}</span>
                    <span class="course-lessons">${course.completed}/${course.total} bài</span>
                </div>
                <div class="course-progress-container">
                    <div class="course-progress-bar">
                        <div class="fill" style="width: ${pct}%;"></div>
                    </div>
                    <span class="course-pct">${pct}%</span>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHtml);
    });
}

// Kiểm tra xem khóa học có phải là bài học tiếp theo cần làm không
function isCourseNextInQueue(course) {
    const excludedCourses = JSON.parse(localStorage.getItem('excludedCourses')) || {};
    if (excludedCourses[course.key]) return false;

    const activePhase = getActivePhase();
    if (course.phase !== activePhase) return false;
    
    const uncompletedInPhase = appState.courses.filter(c => c.phase === activePhase && c.completed < c.total && !excludedCourses[c.key]);
    return uncompletedInPhase.length > 0 && uncompletedInPhase[0].key === course.key;
}

// Lấy giai đoạn hoạt động hiện tại (giai đoạn có bài chưa học đầu tiên)
function getActivePhase() {
    const excludedCourses = JSON.parse(localStorage.getItem('excludedCourses')) || {};
    for (let phase = 1; phase <= 4; phase++) {
        const phaseCourses = appState.courses.filter(c => c.phase === phase && !excludedCourses[c.key]);
        if (phaseCourses.length === 0) continue;
        const allCompleted = phaseCourses.every(c => c.completed >= c.total && c.total > 0);
        if (!allCompleted) {
            return phase;
        }
    }
    return 4; // Nếu xong hết hoặc chưa học gì, mặc định là Giai đoạn cuối
}

// -------------------------------------------------------------
// Tính toán tiến trình và thời gian dự kiến
// -------------------------------------------------------------
function updateCalculations() {
    let totalCompleted = 0;
    let totalLessons = 0;
    
    const phaseStats = {
        1: { completed: 0, total: 0 },
        2: { completed: 0, total: 0 },
        3: { completed: 0, total: 0 },
        4: { completed: 0, total: 0 }
    };

    const excludedCourses = JSON.parse(localStorage.getItem('excludedCourses')) || {};

    appState.courses.forEach(course => {
        const isExcluded = excludedCourses[course.key] === true;
        if (isExcluded) return; // Bỏ qua khóa học đã loại trừ

        totalCompleted += course.completed;
        totalLessons += course.total;
        
        phaseStats[course.phase].completed += course.completed;
        phaseStats[course.phase].total += course.total;
    });

    const overallPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

    // 1. Cập nhật Vòng tròn tiến độ Tổng
    document.getElementById('overall-percent').innerText = `${overallPct}%`;
    document.getElementById('overall-count').innerText = `${totalCompleted}/${totalLessons} bài`;
    
    // Cập nhật hiệu ứng SVG circle (chu vi = 2 * PI * r = 2 * 3.14159 * 45 = 282.7)
    const circle = document.getElementById('overall-circle');
    if (circle) {
        const strokeOffset = 283 - (overallPct / 100) * 283;
        circle.style.strokeDashoffset = strokeOffset;
    }

    // 2. Cập nhật tiến độ của từng Giai đoạn
    for (let phase = 1; phase <= 4; phase++) {
        const stats = phaseStats[phase];
        const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
        
        document.getElementById(`phase-${phase}-progress-text`).innerText = `${stats.completed}/${stats.total} bài`;
        document.getElementById(`phase-${phase}-progress-fill`).style.width = `${pct}%`;
        
        const phaseEl = document.getElementById(`phase-${phase}`);
        if (phaseEl) {
            phaseEl.classList.remove('active', 'completed');
            if (stats.completed >= stats.total && stats.total > 0) {
                phaseEl.classList.add('completed');
            } else if (phase === getActivePhase()) {
                phaseEl.classList.add('active');
            }
        }
    }

    // Cập nhật Badge Giai đoạn hoạt động ở Header Roadmap
    const activePhase = getActivePhase();
    const activeBadge = document.getElementById('active-phase-badge');
    if (activeBadge) {
        activeBadge.innerText = `Đang học: GĐ ${activePhase}`;
    }

    // 3. Tính toán mục tiêu học tập (Planner Card)
    const remainingLessons = totalLessons - totalCompleted;
    const daysRemaining = Math.ceil(remainingLessons / appState.lessonsPerDay);
    
    document.getElementById('days-remaining').innerText = remainingLessons > 0 ? `${daysRemaining} ngày` : 'Đã hoàn thành';
    
    if (remainingLessons > 0) {
        const estDate = new Date();
        estDate.setDate(estDate.getDate() + daysRemaining);
        document.getElementById('completion-date').innerText = estDate.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else {
        document.getElementById('completion-date').innerText = 'Chúc mừng bạn đã xong!';
    }

    // 3.5 Cập nhật thời gian đã học
    const totalMinutes = totalCompleted * 6; // trung bình 6 phút/bài
    const totalHours = (totalMinutes / 60).toFixed(1);
    const studyTimeEl = document.getElementById('total-study-time');
    if (studyTimeEl) {
        studyTimeEl.innerText = `${totalHours} giờ (${totalCompleted} bài)`;
    }

    // 3.6 Cập nhật mục tiêu tuần
    const weeklyInfo = getLessonsCompletedThisWeek();
    const weeklyCount = weeklyInfo.count;
    const weeklyTarget = appState.lessonsPerWeek || 15;
    const weeklyPct = Math.min(100, Math.round((weeklyCount / weeklyTarget) * 100));
    
    const weeklyProgressText = document.getElementById('weekly-progress-text');
    if (weeklyProgressText) weeklyProgressText.innerText = `${weeklyCount}/${weeklyTarget} bài`;
    
    const weeklyProgressFill = document.getElementById('weekly-progress-fill');
    if (weeklyProgressFill) weeklyProgressFill.style.width = `${weeklyPct}%`;
    
    const daySpans = document.querySelectorAll('.weekly-days-row span');
    daySpans.forEach(span => {
        const dayNum = parseInt(span.getAttribute('data-day'), 10);
        if (weeklyInfo.studiedDays.has(dayNum)) {
            span.classList.add('active');
        } else {
            span.classList.remove('active');
        }
    });

    // 3.7 Ước tính điểm thi (Dự kiến khoảng điểm nghe thực tế)
    const toeic = appState.courses.find(c => c.key === 'toeic');
    const estToeicEl = document.getElementById('est-toeic');
    if (toeic && estToeicEl) {
        if (toeic.completed === 0) {
            estToeicEl.innerText = `-- / 495 L`;
        } else {
            const baseScore = 110 + (toeic.completed / toeic.total) * 385;
            const roundTo5 = (val) => Math.round(val / 5) * 5;
            const minScore = Math.max(110, roundTo5(baseScore - 20));
            const maxScore = Math.min(495, roundTo5(baseScore + 20));
            estToeicEl.innerText = `${minScore} - ${maxScore} / 495 L`;
        }
    }

    const ielts = appState.courses.find(c => c.key === 'ielts');
    const estIeltsEl = document.getElementById('est-ielts');
    if (ielts && estIeltsEl) {
        if (ielts.completed === 0) {
            estIeltsEl.innerText = `-- / 9.0 L`;
        } else {
            const baseBand = 4.0 + (ielts.completed / ielts.total) * 5.0;
            const roundToHalf = (val) => Math.round(val * 2) / 2;
            const minBand = Math.max(4.0, roundToHalf(baseBand - 0.25)).toFixed(1);
            const maxBand = Math.min(9.0, roundToHalf(baseBand + 0.25)).toFixed(1);
            estIeltsEl.innerText = `Band ${minBand} - ${maxBand} / 9.0 L`;
        }
    }

    // 4. Cập nhật gợi ý học tiếp theo
    updateRecommendations();

    // 5. Cập nhật Chuỗi ngày học liên tục (Streak)
    checkAndRenderStreak(totalCompleted);

    // 6. Cập nhật Nhật ký học hôm nay
    renderTodayActivity();

    // 7. Cập nhật Huy chương thành tích
    checkAndRenderBadges(totalCompleted);

    // 8. Kiểm tra lời nhắc hàng ngày
    checkDailyReminder();

    // V2: Render biểu đồ 7 ngày
    renderStudyHistoryChart();

    // V2: Render heatmap 30 ngày
    renderStudyHeatmap();

    // V2: Thống kê thói quen học
    renderHabitAnalytics();
}

// -------------------------------------------------------------
// Kiểm tra và hiển thị chuỗi ngày học liên tục (Streak)
// -------------------------------------------------------------
function checkAndRenderStreak(totalCompleted) {
    if (totalCompleted === 0) return;
    
    const streakData = JSON.parse(localStorage.getItem('studyStreak')) || { count: 0, lastActiveDate: null, lastCompletedCount: 0 };
    const todayStr = new Date().toLocaleDateString('en-CA'); // Định dạng YYYY-MM-DD
    
    if (!streakData.lastActiveDate) {
        streakData.count = 1;
        streakData.lastActiveDate = todayStr;
        streakData.lastCompletedCount = totalCompleted;
    } else {
        const lastDate = new Date(streakData.lastActiveDate);
        const today = new Date(todayStr);
        
        // Tính khoảng cách ngày
        const diffTime = today - lastDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            // Cùng một ngày
            if (totalCompleted > streakData.lastCompletedCount) {
                streakData.lastCompletedCount = totalCompleted;
            }
        } else if (diffDays === 1) {
            // Ngày hôm sau (Tiếp tục Streak)
            if (totalCompleted > streakData.lastCompletedCount) {
                streakData.count += 1;
                streakData.lastActiveDate = todayStr;
                streakData.lastCompletedCount = totalCompleted;
            }
        } else if (diffDays > 1) {
            // Bị đứt chuỗi ngày học
            if (totalCompleted > streakData.lastCompletedCount) {
                streakData.count = 1; // Bắt đầu chuỗi mới hôm nay
                streakData.lastActiveDate = todayStr;
                streakData.lastCompletedCount = totalCompleted;
            } else {
                streakData.count = 0; // Đứt chuỗi và chưa học bài mới nào hôm nay
            }
        }
    }
    
    localStorage.setItem('studyStreak', JSON.stringify(streakData));
    
    const container = document.getElementById('streak-badge-container');
    const countSpan = document.getElementById('streak-count');
    if (container && countSpan) {
        if (streakData.count > 0) {
            countSpan.innerText = streakData.count;
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    }
}

// -------------------------------------------------------------
// Gợi ý bài học tiếp theo (Next Recommendations)
// -------------------------------------------------------------
function updateRecommendations() {
    const listContainer = document.getElementById('recommendations-list');
    if (!listContainer) return;

    // Lọc các khóa học chưa hoàn thành và không bị bỏ qua (exclude)
    const excludedCourses = JSON.parse(localStorage.getItem('excludedCourses')) || {};
    const uncompletedCourses = appState.courses.filter(c => c.completed < c.total && !excludedCourses[c.key]);

    if (uncompletedCourses.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-trophy-fill text-warning" style="font-size: 2.5rem;"></i>
                <p class="text-success fw-bold">Tuyệt vời! Bạn đã hoàn thành 100% lộ trình DailyDictation!</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = '';
    
    // Đề xuất tối đa 3 khóa học chưa học xong tiếp theo
    const nextThree = uncompletedCourses.slice(0, 3);
    
    nextThree.forEach((course, index) => {
        // Lấy bài tiếp theo để gợi ý (ví dụ bài: completed + 1)
        const nextLessonNum = course.completed + 1;
        
        let priorityBadge = '';
        if (index === 0) {
            priorityBadge = `<span class="badge" style="background: rgba(16, 185, 129, 0.15); color: var(--color-success); border-color: rgba(16, 185, 129, 0.2);">Ưu tiên 1</span>`;
        } else {
            priorityBadge = `<span class="badge" style="background: rgba(255, 255, 255, 0.05); color: var(--text-muted); border-color: rgba(255, 255, 255, 0.1);">Ưu tiên ${index + 1}</span>`;
        }

        const itemHtml = `
            <a href="${BASE_URL}${course.link}" target="_blank" class="recommendation-item">
                <div class="rec-icon">
                    <i class="bi bi-book"></i>
                </div>
                <div class="rec-info">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                        <span class="rec-title">${course.title}</span>
                        ${priorityBadge}
                    </div>
                    <span class="rec-subtitle">Bài học tiếp theo: Bài #${nextLessonNum} (Giai đoạn ${course.phase})</span>
                </div>
                <div class="rec-action">
                    <i class="bi bi-arrow-right-short"></i>
                </div>
            </a>
        `;
        listContainer.insertAdjacentHTML('beforeend', itemHtml);
    });
}

// -------------------------------------------------------------
// KHỞI TẠO CÁC HÀM HỖ TRỢ VÀ TÍNH NĂNG MỚI (FEATURES 3 TO 10)
// -------------------------------------------------------------

// Danh sách huy hiệu thành tích
const BADGES = [
    { id: 'ipa_complete', title: 'Chiến Binh IPA', desc: 'Hoàn thành 100% khóa học IPA', icon: 'bi-mic-fill', color: '#10b981' },
    { id: 'phase1_complete', title: 'Khởi Đầu Vững Chắc', desc: 'Hoàn thành Giai đoạn 1', icon: 'bi-mortarboard-fill', color: '#3b82f6' },
    { id: 'streak_7', title: 'Chăm Chỉ', desc: 'Đạt chuỗi streak liên tục 7 ngày', icon: 'bi-fire', color: '#f59e0b' },
    { id: 'streak_30', title: 'Chiến Thần Kỷ Luật', desc: 'Đạt chuỗi streak liên tục 30 ngày', icon: 'bi-lightning-charge-fill', color: '#ef4444' },
    { id: 'lessons_100', title: 'Nỗ Lực Không Ngừng', desc: 'Hoàn thành tổng cộng 100 bài học', icon: 'bi-activity', color: '#8b5cf6' },
    { id: 'lessons_500', title: 'Cao Thủ Nghe Hiểu', desc: 'Hoàn thành tổng cộng 500 bài học', icon: 'bi-stars', color: '#ec4899' },
    { id: 'all_complete', title: 'Tốt Nghiệp Vô Song', desc: 'Hoàn thành toàn bộ lộ trình', icon: 'bi-gem', color: '#06b6d4' }
];

// So sánh tiến độ cũ và mới để ghi nhận bài tập hoàn thành trong ngày
function saveProgressAndLogCompletions(payload) {
    const oldProgressStr = localStorage.getItem('userProgress');
    let oldCourses = [];
    if (oldProgressStr) {
        try {
            const oldProgress = JSON.parse(oldProgressStr);
            oldCourses = oldProgress.courses || [];
        } catch (e) {
            console.error('Error parsing old progress:', e);
        }
    }

    const deltas = [];
    const todayStr = new Date().toLocaleDateString('en-CA');
    
    if (payload.courses && Array.isArray(payload.courses)) {
        payload.courses.forEach(newCourse => {
            const oldCourse = oldCourses.find(c => 
                c.link === newCourse.link || 
                c.title.toLowerCase() === newCourse.title.toLowerCase()
            );
            const oldCompleted = oldCourse ? oldCourse.completed : 0;
            const delta = newCourse.completed - oldCompleted;
            
            if (delta > 0) {
                deltas.push({
                    title: newCourse.title,
                    delta: delta
                });
            }
        });
    }

    if (deltas.length > 0) {
        const activityLog = JSON.parse(localStorage.getItem('studyActivityLog')) || {};
        if (!activityLog[todayStr]) {
            activityLog[todayStr] = [];
        }
        
        deltas.forEach(d => {
            const existing = activityLog[todayStr].find(item => item.title === d.title);
            if (existing) {
                existing.delta += d.delta;
            } else {
                activityLog[todayStr].push(d);
            }
        });
        
        localStorage.setItem('studyActivityLog', JSON.stringify(activityLog));

        // Thống kê thói quen học tập theo giờ
        const currentHour = new Date().getHours();
        const hourlyLog = JSON.parse(localStorage.getItem('syncHabitHistory')) || Array(24).fill(0);
        hourlyLog[currentHour]++;
        localStorage.setItem('syncHabitHistory', JSON.stringify(hourlyLog));

        // Nổ pháo hoa chúc mừng
        celebrateCompletion();
    }

    localStorage.setItem('userProgress', JSON.stringify({
        profileName: payload.profileName || 'Học viên',
        timestamp: payload.timestamp || new Date().toISOString(),
        courses: payload.courses
    }));
}

// Render hoạt động học tập hôm nay
function renderTodayActivity() {
    const listContainer = document.getElementById('today-activity-list');
    if (!listContainer) return;

    const todayStr = new Date().toLocaleDateString('en-CA');
    const activityLog = JSON.parse(localStorage.getItem('studyActivityLog')) || {};
    const todayActivities = activityLog[todayStr] || [];

    if (todayActivities.length === 0) {
        listContainer.innerHTML = '<li>Chưa có hoạt động nào hôm nay. Cố lên ní!</li>';
        return;
    }

    listContainer.innerHTML = '';
    todayActivities.forEach(act => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.padding = '4px 0';
        li.style.borderBottom = '1px dashed rgba(255, 255, 255, 0.04)';
        li.innerHTML = `
            <span style="display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><i class="bi bi-play-circle text-success"></i> ${act.title}</span>
            <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: var(--color-success); border: 1px solid rgba(16, 185, 129, 0.2); font-size: 0.75rem; font-weight: 600; padding: 2px 6px; border-radius: 4px; flex-shrink: 0;">+${act.delta} bài</span>
        `;
        listContainer.appendChild(li);
    });
}

// Khởi tạo tính năng tìm kiếm và bộ lọc
function initSearchAndFilter() {
    const searchInput = document.getElementById('roadmap-search');
    const filterBtns = document.querySelectorAll('.btn-filter');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            for (let phase = 1; phase <= 4; phase++) {
                renderPhaseCourses(phase);
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            for (let phase = 1; phase <= 4; phase++) {
                renderPhaseCourses(phase);
            }
        });
    });
}

// Khởi tạo modal ghi chú từ vựng
let activeNoteCourseKey = null;
function initNotesModal() {
    const modal = document.getElementById('notes-modal');
    const btnClose = document.getElementById('btn-close-notes-modal');
    const btnCancel = document.getElementById('btn-cancel-notes');
    const btnSave = document.getElementById('btn-save-notes');
    const textarea = document.getElementById('notes-textarea');
    const titleSpan = document.getElementById('notes-modal-course-title');

    if (!modal || !btnClose || !btnCancel || !btnSave || !textarea || !titleSpan) return;

    // Tạo phần tử bubble dùng chung cho việc tra từ nhanh khi bôi đen
    let bubble = document.getElementById('dict-bubble');
    if (!bubble) {
        bubble = document.createElement('button');
        bubble.id = 'dict-bubble';
        bubble.className = 'btn btn-primary btn-sm';
        bubble.style.cssText = `
            position: absolute;
            z-index: 100000;
            display: none;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
            border-radius: 20px;
            padding: 6px 14px;
            font-size: 0.78rem;
            font-weight: 600;
            gap: 6px;
            align-items: center;
            border: 1px solid rgba(255, 255, 255, 0.15);
            background: linear-gradient(135deg, #6366f1, #a855f7);
            color: #ffffff;
            cursor: pointer;
            transition: transform 0.1s ease;
            font-family: inherit;
        `;
        bubble.innerHTML = '<i class="bi bi-search"></i> Tra từ nhanh';
        document.body.appendChild(bubble);
    }

    const hideBubble = () => {
        bubble.style.display = 'none';
    };

    let lastMouseX = 0;
    let lastMouseY = 0;
    let selectedWord = '';

    textarea.addEventListener('mouseup', (e) => {
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
        
        setTimeout(() => {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            if (start !== undefined && end !== undefined && end > start) {
                const text = textarea.value.substring(start, end).trim();
                const cleanWord = text.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');
                if (cleanWord && !cleanWord.includes(' ') && cleanWord.length >= 2 && cleanWord.length <= 30) {
                    selectedWord = cleanWord;
                    bubble.style.left = `${lastMouseX - 40}px`;
                    bubble.style.top = `${lastMouseY - 45}px`;
                    bubble.style.display = 'inline-flex';
                    return;
                }
            }
            hideBubble();
        }, 10);
    });

    textarea.addEventListener('keyup', () => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        if (start === end) {
            hideBubble();
        }
    });

    bubble.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (selectedWord) {
            const dictTabBtn = document.querySelector('.tab-btn[data-tab="tab-dict"]');
            if (dictTabBtn) {
                dictTabBtn.click();
            }
            
            const dictInput = document.getElementById('dict-search-input');
            const btnDictSearch = document.getElementById('btn-dict-search');
            if (dictInput && btnDictSearch) {
                dictInput.value = selectedWord;
                btnDictSearch.click();
            }
        }
        hideBubble();
    });

    document.addEventListener('mousedown', (e) => {
        if (e.target !== bubble && !bubble.contains(e.target) && e.target !== textarea) {
            hideBubble();
        }
    });

    const closeModal = () => {
        modal.classList.remove('show');
        hideBubble();
    };

    btnClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);

    btnSave.addEventListener('click', () => {
        if (activeNoteCourseKey) {
            const notes = JSON.parse(localStorage.getItem('courseNotes')) || {};
            notes[activeNoteCourseKey] = textarea.value;
            localStorage.setItem('courseNotes', JSON.stringify(notes));
            closeModal();
            // Vẽ lại toàn bộ để cập nhật icon bút chì
            for (let phase = 1; phase <= 4; phase++) {
                renderPhaseCourses(phase);
            }
        }
    });

    // Ủy quyền sự kiện click mở modal
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-note');
        if (btn) {
            e.preventDefault();
            const courseKey = btn.getAttribute('data-course-key');
            const course = appState.courses.find(c => c.key === courseKey);
            if (course) {
                activeNoteCourseKey = courseKey;
                titleSpan.innerText = course.title;
                const notes = JSON.parse(localStorage.getItem('courseNotes')) || {};
                textarea.value = notes[courseKey] || '';
                modal.classList.add('show');
            }
        }
    });

    // Đóng khi click ngoài backdrop
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Khởi tạo cơ chế bỏ qua khóa học
function initExcludeToggle() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-exclude');
        if (btn) {
            e.preventDefault();
            const courseKey = btn.getAttribute('data-course-key');
            const excludedCourses = JSON.parse(localStorage.getItem('excludedCourses')) || {};
            excludedCourses[courseKey] = !excludedCourses[courseKey];
            localStorage.setItem('excludedCourses', JSON.stringify(excludedCourses));
            
            // Render lại giao diện
            for (let phase = 1; phase <= 4; phase++) {
                renderPhaseCourses(phase);
            }
            updateCalculations();
        }
    });
}

// Khởi tạo tính năng Sao lưu & Khôi phục
function initBackupRestore() {
    const btnBackup = document.getElementById('btn-backup-data');
    const restoreInput = document.getElementById('restore-input');

    if (btnBackup) {
        btnBackup.addEventListener('click', () => {
            const keys = ['userProgress', 'studyStreak', 'studyActivityLog', 'courseNotes', 'excludedCourses', 'lessonsPerDay', 'reminderClosedDate', 'appTheme'];
            const backupData = {};
            keys.forEach(k => {
                backupData[k] = localStorage.getItem(k);
            });

            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dailydictation_planner_backup_${new Date().toLocaleDateString('en-CA')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    if (restoreInput) {
        restoreInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length === 0) return;
            const file = files[0];

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const backupData = JSON.parse(event.target.result);
                    if (backupData.userProgress || backupData.studyStreak || backupData.studyActivityLog) {
                        Object.keys(backupData).forEach(k => {
                            if (backupData[k] !== null) {
                                localStorage.setItem(k, backupData[k]);
                            }
                        });
                        alert('🎉 Khôi phục dữ liệu thành công! Trang web sẽ tự động tải lại.');
                        window.location.reload();
                    } else {
                        alert('File chọn không hợp lệ hoặc không chứa dữ liệu sao lưu.');
                    }
                } catch (err) {
                    alert('Lỗi định dạng file JSON.');
                }
            };
            reader.readAsText(file);
        });
    }
}

// Kiểm tra lời nhắc học tập hàng ngày
function checkDailyReminder() {
    const banner = document.getElementById('daily-reminder-banner');
    const btnClose = document.getElementById('btn-close-reminder');
    if (!banner || !btnClose) return;

    const todayStr = new Date().toLocaleDateString('en-CA');
    const reminderClosedDate = localStorage.getItem('reminderClosedDate');
    if (reminderClosedDate === todayStr) {
        banner.style.display = 'none';
        return;
    }

    const activityLog = JSON.parse(localStorage.getItem('studyActivityLog')) || {};
    const todayActivities = activityLog[todayStr] || [];

    if (todayActivities.length === 0) {
        banner.style.display = 'flex';
    } else {
        banner.style.display = 'none';
    }

    btnClose.onclick = () => {
        banner.style.display = 'none';
        localStorage.setItem('reminderClosedDate', todayStr);
    };
}

// Kiểm tra và hiển thị huy chương thành tích
function checkAndRenderBadges(totalCompleted) {
    const grid = document.getElementById('badges-grid');
    if (!grid) return;

    const streakData = JSON.parse(localStorage.getItem('studyStreak')) || { count: 0 };
    const streakCount = streakData.count || 0;

    // 1. IPA hoàn thành
    const ipaCourse = appState.courses.find(c => c.key === 'ipa');
    const ipaComplete = ipaCourse ? (ipaCourse.completed >= ipaCourse.total) : false;

    // 2. Giai đoạn 1 hoàn thành
    const phase1Courses = appState.courses.filter(c => c.phase === 1);
    const phase1Complete = phase1Courses.length > 0 && phase1Courses.every(c => c.completed >= c.total);

    // 3. Toàn bộ hoàn thành
    const allComplete = appState.courses.length > 0 && appState.courses.every(c => c.completed >= c.total);

    const unlockedBadges = {
        ipa_complete: ipaComplete,
        phase1_complete: phase1Complete,
        streak_7: streakCount >= 7,
        streak_30: streakCount >= 30,
        lessons_100: totalCompleted >= 100,
        lessons_500: totalCompleted >= 500,
        all_complete: allComplete
    };

    grid.innerHTML = '';
    BADGES.forEach(b => {
        const isUnlocked = unlockedBadges[b.id];
        const badgeClass = isUnlocked ? 'unlocked' : 'locked';
        let style = '';
        if (isUnlocked) {
            style = `background: ${b.color}15; color: ${b.color}; border-color: ${b.color}40;`;
        }
        
        const badgeHtml = `
            <div class="badge-item ${badgeClass}" title="${b.title}: ${b.desc}" style="${style}">
                <i class="bi ${b.icon}" style="font-size: 1.6rem; margin-bottom: 4px;"></i>
                <span style="font-size: 0.65rem; font-weight: 600; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${b.title}</span>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', badgeHtml);
    });
}

// -------------------------------------------------------------
// V2 BỔ SUNG CÁC HÀM XỬ LÝ (FEATURES V2)
// -------------------------------------------------------------

// Tính số bài học hoàn thành trong tuần này (Monday - Sunday)
function getLessonsCompletedThisWeek() {
    const activityLog = JSON.parse(localStorage.getItem('studyActivityLog')) || {};
    const today = new Date();
    const currentDay = today.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - distanceToMonday);
    monday.setHours(0,0,0,0);

    let count = 0;
    const studiedDays = new Set();

    for (let i = 0; i < 7; i++) {
        const checkDate = new Date(monday);
        checkDate.setDate(monday.getDate() + i);
        const dateStr = checkDate.toLocaleDateString('en-CA');
        const dayLogs = activityLog[dateStr] || [];
        let daySum = 0;
        dayLogs.forEach(l => {
            daySum += l.delta;
        });
        if (daySum > 0) {
            count += daySum;
            studiedDays.add(checkDate.getDay());
        }
    }
    return { count, studiedDays };
}

// Vẽ biểu đồ lịch sử học tập 7 ngày qua
function renderStudyHistoryChart() {
    const barsContainer = document.getElementById('history-chart-bars');
    const labelsContainer = document.getElementById('history-chart-labels');
    if (!barsContainer || !labelsContainer) return;

    barsContainer.innerHTML = '';
    labelsContainer.innerHTML = '';

    const activityLog = JSON.parse(localStorage.getItem('studyActivityLog')) || {};
    
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d);
    }

    let maxVal = appState.lessonsPerDay || 3;
    const dayValues = days.map(d => {
        const dateStr = d.toLocaleDateString('en-CA');
        const logs = activityLog[dateStr] || [];
        const sum = logs.reduce((acc, curr) => acc + curr.delta, 0);
        if (sum > maxVal) maxVal = sum;
        return sum;
    });

    days.forEach((d, index) => {
        const val = dayValues[index];
        const heightPct = Math.max(8, (val / maxVal) * 100); // Tối thiểu 8% để có cột nhỏ nhìn thấy được
        const dateLabel = d.getDate().toString().padStart(2, '0') + '/' + (d.getMonth() + 1).toString().padStart(2, '0');

        const barHtml = `
            <div class="chart-bar-wrapper">
                <div class="chart-bar" style="height: ${heightPct}%;" data-value="+${val}" title="Ngày ${dateLabel}: +${val} bài"></div>
            </div>
        `;
        const labelHtml = `
            <span style="flex: 1; text-align: center; font-size: 0.65rem;">${dateLabel}</span>
        `;
        barsContainer.insertAdjacentHTML('beforeend', barHtml);
        labelsContainer.insertAdjacentHTML('beforeend', labelHtml);
    });
}

// Phát âm thanh tiếng bíp chúc mừng bằng Web Audio API
function playBeep(frequency, duration, type = 'sine') {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.error('AudioContext error:', e);
    }
}

// Khởi chạy Pomodoro Focus Timer
let pomodoroInterval = null;
let pomodoroSeconds = 25 * 60;
let pomodoroMode = 'study';

function initPomodoro() {
    const timeEl = document.getElementById('pomodoro-time');
    const statusEl = document.getElementById('pomodoro-status');
    const btnStart = document.getElementById('btn-pomodoro-start');
    const btnPause = document.getElementById('btn-pomodoro-pause');
    const btnReset = document.getElementById('btn-pomodoro-reset');

    if (!timeEl || !statusEl || !btnStart || !btnPause || !btnReset) return;

    function updateDisplay() {
        const m = Math.floor(pomodoroSeconds / 60).toString().padStart(2, '0');
        const s = (pomodoroSeconds % 60).toString().padStart(2, '0');
        timeEl.innerText = `${m}:${s}`;
    }

    btnStart.addEventListener('click', () => {
        btnStart.style.display = 'none';
        btnPause.style.display = 'inline-flex';
        statusEl.innerText = pomodoroMode === 'study' ? '🔥 Đang tập trung học...' : '🍵 Đang giải lao thư giãn...';
        statusEl.style.color = pomodoroMode === 'study' ? 'var(--color-danger)' : 'var(--color-success)';

        playBeep(440, 0.1); // Beep starting

        pomodoroInterval = setInterval(() => {
            pomodoroSeconds--;
            updateDisplay();

            if (pomodoroSeconds <= 0) {
                clearInterval(pomodoroInterval);
                
                // Tiếng bíp chúc mừng (ascending chord C-E-G)
                playBeep(523.25, 0.15);
                setTimeout(() => playBeep(659.25, 0.25), 150);
                setTimeout(() => playBeep(783.99, 0.35), 300);
                
                if (pomodoroMode === 'study') {
                    pomodoroMode = 'break';
                    pomodoroSeconds = 5 * 60;
                    statusEl.innerText = '🎉 Hết giờ học! Hãy nghỉ giải lao 5 phút.';
                    alert('🎉 Ní ơi! Đã hết 25 phút tập trung học. Hãy đứng dậy đi lại và uống nước nhé!');
                } else {
                    pomodoroMode = 'study';
                    pomodoroSeconds = 25 * 60;
                    statusEl.innerText = '⏰ Nghỉ xong rồi! Bắt đầu học tiếp thôi.';
                }
                
                btnStart.style.display = 'inline-flex';
                btnPause.style.display = 'none';
                updateDisplay();
            }
        }, 1000);
    });

    btnPause.addEventListener('click', () => {
        clearInterval(pomodoroInterval);
        btnStart.style.display = 'inline-flex';
        btnPause.style.display = 'none';
        statusEl.innerText = '⏸️ Đang tạm dừng';
        statusEl.style.color = 'var(--color-warning)';
    });

    btnReset.addEventListener('click', () => {
        clearInterval(pomodoroInterval);
        pomodoroMode = 'study';
        pomodoroSeconds = 25 * 60;
        updateDisplay();
        btnStart.style.display = 'inline-flex';
        btnPause.style.display = 'none';
        statusEl.innerText = 'Sẵn sàng học tập';
        statusEl.style.color = 'var(--color-warning)';
    });
}

// Bắn pháo hoa ăn mừng đồng bộ thành công bài mới
function celebrateCompletion() {
    // 1. Phát nhạc chúc mừng (hợp âm đô trưởng vui vẻ)
    playBeep(523.25, 0.1, 'sine');
    setTimeout(() => playBeep(659.25, 0.1, 'sine'), 100);
    setTimeout(() => playBeep(783.99, 0.1, 'sine'), 200);
    setTimeout(() => playBeep(1046.50, 0.35, 'sine'), 300);

    // 2. Chạy hiệu ứng pháo hoa
    const loadAndLaunch = () => {
        if (window.confetti) {
            window.confetti({
                particleCount: 160,
                spread: 80,
                origin: { y: 0.6 }
            });
        }
    };

    if (window.confetti) {
        loadAndLaunch();
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
        script.onload = loadAndLaunch;
        document.head.appendChild(script);
    }
}

// Render lưới đóng dấu 30 ngày (Study Heatmap)
function renderStudyHeatmap() {
    const grid = document.getElementById('heatmap-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const activityLog = JSON.parse(localStorage.getItem('studyActivityLog')) || {};
    
    const days = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d);
    }

    days.forEach(d => {
        const dateStr = d.toLocaleDateString('en-CA');
        const logs = activityLog[dateStr] || [];
        const sum = logs.reduce((acc, curr) => acc + curr.delta, 0);

        let colorStyle = 'background: rgba(255, 255, 255, 0.03);';
        if (sum > 0) {
            if (sum <= 2) {
                colorStyle = 'background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.3);';
            } else if (sum <= 5) {
                colorStyle = 'background: rgba(16, 185, 129, 0.55); border: 1px solid rgba(16, 185, 129, 0.6);';
            } else {
                colorStyle = 'background: rgba(16, 185, 129, 0.9); border: 1px solid rgba(16, 185, 129, 1.0);';
            }
        }

        const dateLabel = d.getDate().toString().padStart(2, '0') + '/' + (d.getMonth() + 1).toString().padStart(2, '0');
        const tile = document.createElement('div');
        tile.className = 'heatmap-tile';
        tile.style.cssText = colorStyle;
        tile.title = `${dateLabel}: +${sum} bài`;
        grid.appendChild(tile);
    });
}

// Xử lý chuyển tab trong modal ghi chú
function initNotesTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            tabs.forEach(t => {
                t.classList.remove('active');
                t.style.borderBottomColor = 'transparent';
                t.style.color = 'var(--text-muted)';
            });
            tab.classList.add('active');
            tab.style.borderBottomColor = 'var(--primary-color)';
            tab.style.color = 'var(--text-main)';

            // Hide all tab content
            const targetId = tab.getAttribute('data-tab');
            const contents = document.querySelectorAll('#notes-modal .tab-content');
            contents.forEach(c => {
                c.style.display = 'none';
            });
            
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.style.display = 'block';
            }

            if (targetId === 'tab-flash') {
                setupFlashcards();
            }
        });
    });

    // Tra từ điển bằng API miễn phí
    const btnDictSearch = document.getElementById('btn-dict-search');
    const dictInput = document.getElementById('dict-search-input');
    const dictResult = document.getElementById('dict-result');

    if (btnDictSearch && dictInput && dictResult) {
        btnDictSearch.addEventListener('click', async (e) => {
            e.preventDefault();
            const query = dictInput.value.trim();
            if (query === '') return;

            dictResult.innerHTML = '⏳ Đang tra cứu từ điển...';
            try {
                const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
                if (res.ok) {
                    const data = await res.json();
                    const entry = data[0];
                    const phonetic = entry.phonetic || (entry.phonetics && entry.phonetics[0] && entry.phonetics[0].text) || '';
                    
                    const meanings = entry.meanings.slice(0, 3).map(m => {
                        const definitions = m.definitions.slice(0, 2).map(d => `<li>${d.definition}</li>`).join('');
                        return `
                            <div style="margin-top: 6px;">
                                <strong style="color: var(--primary-color);">[${m.partOfSpeech}]</strong>
                                <ul style="padding-left: 16px; margin-top: 2px;">${definitions}</ul>
                            </div>
                        `;
                    }).join('');

                    dictResult.innerHTML = `
                        <div style="font-size: 1.1rem; font-weight: 700; color: #ffffff; display: flex; align-items: center; gap: 8px;">
                            ${entry.word}
                            <span style="font-size: 0.8rem; font-weight: 400; color: var(--accent-color);">${phonetic}</span>
                        </div>
                        <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 4px;">
                            ${meanings}
                        </div>
                    `;
                } else {
                    dictResult.innerHTML = '❌ Không tìm thấy từ này trong từ điển.';
                }
            } catch (err) {
                dictResult.innerHTML = '❌ Lỗi kết nối dịch vụ từ điển.';
            }
        });
    }
}

// Cấu hình Flashcard ôn tập từ vựng
let currentFlashcardIndex = 0;
let flashcards = [];

function setupFlashcards() {
    const notesText = document.getElementById('notes-textarea').value || '';
    const frontText = document.getElementById('flash-front-text');
    const backText = document.getElementById('flash-back-text');
    const counter = document.getElementById('flash-counter');
    const cardInner = document.getElementById('flash-card-inner');

    if (!frontText || !backText || !counter || !cardInner) return;

    cardInner.classList.remove('flipped');

    flashcards = [];
    const lines = notesText.split('\n');
    lines.forEach(line => {
        let splitChar = null;
        if (line.includes('-')) splitChar = '-';
        else if (line.includes(':')) splitChar = ':';

        if (splitChar) {
            const parts = line.split(splitChar);
            const front = parts[0].trim();
            const back = parts.slice(1).join(splitChar).trim();
            if (front !== '' && back !== '') {
                flashcards.push({ front, back });
            }
        }
    });

    if (flashcards.length === 0) {
        frontText.innerText = 'Không có Flashcard';
        backText.innerText = 'Hãy viết ghi chú dạng "từ - nghĩa" (mỗi dòng một cặp) để tạo thẻ lật học tập!';
        counter.innerText = '0/0 thẻ';
        return;
    }

    currentFlashcardIndex = 0;
    showFlashcard();
}

function showFlashcard() {
    const frontText = document.getElementById('flash-front-text');
    const backText = document.getElementById('flash-back-text');
    const counter = document.getElementById('flash-counter');
    const cardInner = document.getElementById('flash-card-inner');

    cardInner.classList.remove('flipped');
    
    const card = flashcards[currentFlashcardIndex];
    frontText.innerText = card.front;
    backText.innerText = card.back;
    counter.innerText = `${currentFlashcardIndex + 1}/${flashcards.length} thẻ`;
}

function initFlashcardEvents() {
    const cardContainer = document.getElementById('flash-card-container');
    const cardInner = document.getElementById('flash-card-inner');
    const btnPrev = document.getElementById('btn-flash-prev');
    const btnNext = document.getElementById('btn-flash-next');

    if (!cardContainer || !cardInner || !btnPrev || !btnNext) return;

    cardContainer.addEventListener('click', (e) => {
        e.preventDefault();
        cardInner.classList.toggle('flipped');
    });

    btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (flashcards.length === 0) return;
        currentFlashcardIndex = (currentFlashcardIndex - 1 + flashcards.length) % flashcards.length;
        showFlashcard();
    });

    btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (flashcards.length === 0) return;
        currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcards.length;
        showFlashcard();
    });
}

// Thống kê thói quen học tập (Habit Analytics)
function renderHabitAnalytics() {
    const habitEl = document.getElementById('habit-analytics-text');
    if (!habitEl) return;

    const hourlyLog = JSON.parse(localStorage.getItem('syncHabitHistory')) || Array(24).fill(0);
    const maxVal = Math.max(...hourlyLog);
    if (maxVal === 0) {
        habitEl.innerHTML = `<i class="bi bi-info-circle text-info"></i> Hãy học nhiều hơn để thống kê khung giờ hiệu quả nhất.`;
        return;
    }

    const maxHour = hourlyLog.indexOf(maxVal);
    let timeLabel = "Đêm muộn";
    if (maxHour >= 5 && maxHour < 12) timeLabel = "Buổi sáng";
    else if (maxHour >= 12 && maxHour < 18) timeLabel = "Buổi chiều";
    else if (maxHour >= 18 && maxHour < 22) timeLabel = "Buổi tối";

    const formattedHour = `${maxHour.toString().padStart(2, '0')}:00 - ${(maxHour+1).toString().padStart(2, '0')}:00`;
    habitEl.innerHTML = `<i class="bi bi-lightning-fill text-warning"></i> Giờ học hiệu quả nhất của ní: ${formattedHour} (${timeLabel})`;
}

// Khởi tạo Modal Chia sẻ thiệp thành tích
function initShareModal() {
    const modal = document.getElementById('share-modal');
    const btnOpen = document.getElementById('btn-share-modal');
    const btnClose = document.getElementById('btn-close-share-modal');
    const btnDownload = document.getElementById('btn-download-share-card');

    if (btnOpen && modal) {
        btnOpen.addEventListener('click', (e) => {
            e.preventDefault();
            
            document.getElementById('share-card-name').innerText = appState.profileName;
            
            const streakData = JSON.parse(localStorage.getItem('studyStreak')) || { count: 0 };
            document.getElementById('share-card-streak').innerText = streakData.count;

            let totalCompleted = 0;
            let totalLessons = 0;
            const excludedCourses = JSON.parse(localStorage.getItem('excludedCourses')) || {};
            appState.courses.forEach(course => {
                if (excludedCourses[course.key]) return;
                totalCompleted += course.completed;
                totalLessons += course.total;
            });
            
            const totalHours = ((totalCompleted * 6) / 60).toFixed(1);
            document.getElementById('share-card-hours').innerText = totalHours;

            const overallPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
            document.getElementById('share-card-pct-label').innerText = `${overallPct}%`;
            document.getElementById('share-card-progress-bar').style.width = `${overallPct}%`;

            modal.classList.add('show');
        });
    }

    if (btnClose) btnClose.addEventListener('click', () => modal.classList.remove('show'));

    // Đóng khi click ngoài backdrop
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            btnDownload.innerText = '⏳ Đang tạo ảnh...';
            btnDownload.disabled = true;

            const loadScriptAndDownload = () => {
                const card = document.getElementById('share-card-canvas');
                window.html2canvas(card, {
                    backgroundColor: null,
                    scale: 2 // Tạo ảnh nét gấp đôi
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = `dailydictation_achievement_${appState.profileName}.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                    
                    btnDownload.innerHTML = '<i class="bi bi-download"></i> Tải ảnh về máy (.png)';
                    btnDownload.disabled = false;
                }).catch(err => {
                    console.error('Lỗi khi vẽ canvas:', err);
                    btnDownload.innerHTML = '<i class="bi bi-download"></i> Tải ảnh về máy (.png)';
                    btnDownload.disabled = false;
                    alert('Không thể tạo ảnh chia sẻ trên trình duyệt này.');
                });
            };

            if (window.html2canvas) {
                loadScriptAndDownload();
            } else {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
                script.onload = loadScriptAndDownload;
                script.onerror = () => {
                    alert('Lỗi khi tải thư viện html2canvas.');
                    btnDownload.innerHTML = '<i class="bi bi-download"></i> Tải ảnh về máy (.png)';
                    btnDownload.disabled = false;
                };
                document.head.appendChild(script);
            }
        });
    }
}

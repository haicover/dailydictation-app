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

// -------------------------------------------------------------
// Khởi chạy
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initBookmarklet();
    initModal();
    initPlannerInputs();
    initDragAndDrop();
    fetchProgress();
});

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
    
    // Đọc mục tiêu cũ nếu có
    const savedTarget = localStorage.getItem('lessonsPerDay');
    if (savedTarget) {
        appState.lessonsPerDay = parseInt(savedTarget, 10);
        inputDays.value = appState.lessonsPerDay;
    }

    inputDays.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        appState.lessonsPerDay = val;
        localStorage.setItem('lessonsPerDay', val);
        updateCalculations();
    });
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
    localStorage.setItem('userProgress', JSON.stringify({
        profileName: payload.profileName || 'Học viên',
        timestamp: payload.timestamp || payload.lastUpdated || new Date().toISOString(),
        courses: payload.courses
    }));

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
            localStorage.setItem('userProgress', JSON.stringify({
                profileName: payload.profileName || 'Học viên',
                timestamp: payload.timestamp || new Date().toISOString(),
                courses: payload.courses
            }));
            
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

function renderPhaseCourses(phaseNum) {
    const container = document.getElementById(`phase-${phaseNum}-courses`);
    if (!container) return;
    
    container.innerHTML = '';
    const phaseCourses = appState.courses.filter(c => c.phase === phaseNum);
    
    phaseCourses.forEach(course => {
        const pct = course.total > 0 ? Math.round((course.completed / course.total) * 100) : 0;
        
        const isCompleted = course.completed >= course.total && course.total > 0;
        const isActive = !isCompleted && (course.completed > 0 || isCourseNextInQueue(course));
        
        let statusClass = '';
        let statusIcon = '<i class="bi bi-circle"></i>';
        
        if (isCompleted) {
            statusClass = 'completed';
            statusIcon = '<i class="bi bi-check-circle-fill"></i>';
        } else if (isActive) {
            statusClass = 'active';
            statusIcon = '<i class="bi bi-play-circle-fill"></i>';
        }
        
        const cardHtml = `
            <div class="course-item ${statusClass}">
                <div class="course-item-header">
                    <a href="${BASE_URL}${course.link}" target="_blank" class="course-item-title">${course.title}</a>
                    <span class="course-status-icon">${statusIcon}</span>
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
    // Trả về true nếu đây là khóa học đầu tiên chưa hoàn thành trong giai đoạn hoạt động
    const activePhase = getActivePhase();
    if (course.phase !== activePhase) return false;
    
    const uncompletedInPhase = appState.courses.filter(c => c.phase === activePhase && c.completed < c.total);
    return uncompletedInPhase.length > 0 && uncompletedInPhase[0].key === course.key;
}

// Lấy giai đoạn hoạt động hiện tại (giai đoạn có bài chưa học đầu tiên)
function getActivePhase() {
    for (let phase = 1; phase <= 4; phase++) {
        const phaseCourses = appState.courses.filter(c => c.phase === phase);
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

    appState.courses.forEach(course => {
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

    // 4. Cập nhật gợi ý học tiếp theo
    updateRecommendations();
}

// -------------------------------------------------------------
// Gợi ý bài học tiếp theo (Next Recommendations)
// -------------------------------------------------------------
function updateRecommendations() {
    const listContainer = document.getElementById('recommendations-list');
    if (!listContainer) return;

    // Lọc các khóa học chưa hoàn thành
    const uncompletedCourses = appState.courses.filter(c => c.completed < c.total);

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

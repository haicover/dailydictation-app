const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: '*' // Cho phép mọi nguồn để bookmarklet có thể POST về localhost
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const PROGRESS_FILE = path.join(__dirname, 'progress.json');

// Lấy tiến trình hiện tại
app.get('/api/progress', (req, res) => {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      const data = fs.readFileSync(PROGRESS_FILE, 'utf8');
      return res.json(JSON.parse(data));
    } catch (err) {
      return res.status(500).json({ error: 'Không thể đọc file tiến trình' });
    }
  } else {
    // Trả về tiến trình mặc định chưa học gì
    return res.json({ courses: [], profileName: '', lastUpdated: null });
  }
});

// API Đồng bộ hóa tiến độ từ Bookmarklet
app.post('/api/sync', (req, res) => {
  try {
    const { courses, profileName, timestamp } = req.body;
    
    // Chuẩn hóa và làm sạch dữ liệu
    const normalizedCourses = (courses || []).map(course => {
      let completedLessons = typeof course.completed === 'number' ? course.completed : 0;
      let totalLessons = typeof course.total === 'number' ? course.total : 0;
      const text = course.text || '';
      
      // Nếu không có dữ liệu số trực tiếp thì quét qua text regex
      if (completedLessons === 0 && totalLessons === 0 && text) {
        const slashMatch = text.match(/(\d+)\s*\/\s*(\d+)/);
        const totalMatch = text.match(/(\d+)\s+lessons/i);
        
        if (slashMatch) {
          completedLessons = parseInt(slashMatch[1], 10);
          totalLessons = parseInt(slashMatch[2], 10);
        } else if (totalMatch) {
          totalLessons = parseInt(totalMatch[1], 10);
        }
      }
      
      const levelMatch = text.match(/Levels:\s*([^\n\r]+)/i);
      const levels = course.levels || (levelMatch ? levelMatch[1].trim() : 'A1-C2');
      
      return {
        title: course.title,
        link: course.link,
        completed: completedLessons,
        total: totalLessons,
        levels: levels
      };
    });
    
    const progressData = {
      profileName: profileName || 'Học viên',
      lastUpdated: timestamp || new Date().toISOString(),
      courses: normalizedCourses
    };
    
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progressData, null, 2), 'utf8');
    console.log(`[Đồng bộ] Đã cập nhật tiến độ cho: ${progressData.profileName}`);
    return res.json({ success: true, data: progressData });
  } catch (err) {
    console.error('[Lỗi đồng bộ]', err);
    return res.status(500).json({ error: 'Lỗi lưu dữ liệu tiến độ' });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server chạy tại: http://localhost:${PORT}`);
});

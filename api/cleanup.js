const fs = require('fs-extra');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    const uploadDir = path.join(__dirname, '../../public/uploads');
    const files = await fs.readdir(uploadDir);
    
    const now = Date.now();
    const cleanupThreshold = 30 * 60 * 1000; // 30 minutes
    
    let deletedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const stats = await fs.stat(filePath);
      const fileAge = now - stats.mtimeMs;
      
      if (fileAge > cleanupThreshold) {
        await fs.unlink(filePath);
        deletedCount++;
      }
    }
    
    return res.status(200).json({ 
      success: true, 
      message: `Cleanup completed. ${deletedCount} files deleted.` 
    });
    
  } catch (error) {
    console.error('Cleanup error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error during cleanup' 
    });
  }
};

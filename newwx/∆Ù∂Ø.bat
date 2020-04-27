
taskkill /f /im nginx.exe

start "" "nginx.exe"

if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"  start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "http://localhost:12345/magicaldrag/start.html"

if not exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" start http://localhost:12345/magicaldrag/start.html

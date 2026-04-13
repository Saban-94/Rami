<script>
    // פונקציה לטעינה ראשונית בטוחה
    function initApp() {
        console.log("SabanOS Initializing...");
        
        // טיימר הגנה - אם לא נטען תוך 7 שניות, שחרר את המסך
        const timeout = setTimeout(() => {
            document.getElementById('loadingOverlay')?.remove();
            addMessage("אח, יש עיכוב בתקשורת עם המוח. נסה לרענן.", 'ai');
        }, 7000);

        google.script.run
            .withSuccessHandler(logs => {
                clearTimeout(timeout);
                document.getElementById('loadingOverlay')?.remove(); // הסרת הדיליי
                logs.forEach(log => addMalshinonItem(log));
            })
            .withFailureHandler(err => {
                clearTimeout(timeout);
                console.error(err);
                addMessage("שגיאה בחיבור ל-Apps Script. בדוק הרשאות.", 'ai');
            })
            .getRecentLogs();
    }

    window.onload = initApp;
</script>
```

### 3. בדיקת ה-API Key ב-`code.gs`
אם ה-API Key של Gemini לא תקין או ריק, הפונקציה `callGemini` קורסת והדף נתקע.
* פתח את `code.gs`.
* וודא שהמשתנה `API_KEY` מכיל את המפתח הארוך שהוצאת מ-AI Studio.
* בדוק שאין שגיאות ב-**Executions** (בסרגל הצד ב-Apps Script) – אם אתה רואה שם אדום, לחץ עליו כדי לראות את סיבת הקריסה.

### 4. פונקציית ה-`doGet` (וודא שהיא נראית ככה)
כדי שהדף יעלה חלק במובייל בלי חסימות של גוגל:
```javascript
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('SabanOS | שליטה מלאה')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL) // קריטי ללחיצות
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}


# 🧠 Habit/Advanced Input Box – Firefox Extension

A powerful Firefox extension that enhances the way you type online with two intelligent modes:

- **Habit Mode**: Pop up an ergonomically placed input box whenever you focus a field.
- **Advanced Mode**: Type AI-enhanced commands (like `/make background dark`) that modify the webpage in real-time using Google Gemini.

---

## 🚀 Features

- 🧍 **Habit Mode**: Floating input box syncs with any form field
- ⚙️ **Advanced Mode**: LLM-powered command bar for CSS changes
- 💾 Persistent user settings (API key, mode, position)
- 🎨 Customizable floating UI
- 🎯 Cross-site compatible

---

## 📁 File Structure

```
HabitAdvancedInputBox/
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
├── popup.css
├── icons/
│   └── icon-48.png
├── styles/
├── scripts/

---

## 🛠 Installation (Development Mode)

1. Go to `about:debugging` in Firefox
2. Click **"Load Temporary Add-on"**
3. Select `manifest.json` from the root folder
4. You’ll see the extension appear in your toolbar

---

## ⚙️ Modes

### 🔁 Switch Between Modes:
- `Ctrl+Shift+H` → Habit Mode
- `Ctrl+Shift+A` → Advanced Mode

Or use the toggle in the popup UI.

---

## 🔑 Setting Up Gemini API (Advanced Mode)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new **API Key**
3. Open the extension popup → paste your key → Save

---

## 🌐 Setting Up Proxy Server for Gemini API

Browser extensions can't call Gemini API directly due to CORS restrictions. You'll need a proxy:

### 🧰 Deploy Your Gemini Proxy:
1. Clone [Gemini Proxy Template (Node.js)](https://github.com/YOUR_REPO)
2. Deploy it to [Render](https://render.com), [Replit](https://replit.com), or [Vercel](https://vercel.com)
3. Update `content.js` line:
```js
fetch("https://your-proxy-server.com/gemini-css")
```

---

## ✨ Example Commands

Type these in the floating box:
```
/make background dark
/increase font size
/make links red and underlined
/bold all text
```
These will be converted into CSS via Gemini and applied live.

---

## 🐞 Debugging Tips

- Open DevTools → Console to view Gemini response logs
- If you see `"Failed to connect to Gemini"` → check proxy + API key
- Use test sites like `example.com` or `w3schools.com` to validate CSS

---

## 📦 Packaging for Submission

1. Prepare:
   - `manifest.json`
   - Icons (48x48, 96x96)
   - Screenshots (for listing)
2. Zip the entire folder (not the folder itself)
3. Submit via [Mozilla Add-on Developer Hub](https://addons.mozilla.org/en-US/developers/)

---

Ujjwal MISHRA (chemical engg.)
Naisha Rajput(electrical engg.)


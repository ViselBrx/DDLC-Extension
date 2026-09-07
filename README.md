<h1 align="center">DDLC Chibi Themes</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/ViselBrx/DDLC-Extension/main/assets/yuriscene.png" alt="Yuri scene" width="100%" />
</p>

<p align="center">
  <strong>Dark themes and Doki chibis for IDEs with a modern code-editor workflow.</strong>
</p>

<p align="center">
  A fan-made extension inspired by Doki Doki Literature Club</a>, created to make the development environment more thematic and welcoming.
</p>

<p align="center">
  <a href="https://www.typescriptlang.org/" title="TypeScript">
    <img src="https://skillicons.dev/icons?i=ts" alt="TypeScript" width="48" />
  </a>
  <a href="https://nodejs.org/" title="Node.js">
    <img src="https://skillicons.dev/icons?i=nodejs" alt="Node.js" width="48" />
  </a>
  <a href="https://www.npmjs.com/" title="npm">
    <img src="https://skillicons.dev/icons?i=npm" alt="npm" width="48" />
  </a>
  <a href="https://developer.mozilla.org/docs/Web/HTML" title="HTML">
    <img src="https://skillicons.dev/icons?i=html" alt="HTML" width="48" />
  </a>
  <a href="https://developer.mozilla.org/docs/Web/CSS" title="CSS">
    <img src="https://skillicons.dev/icons?i=css" alt="CSS" width="48" />
  </a>
</p>

### Hello, my name is Visel ^_^. Look this extension and check out the structure or the README file <3.

- Yuri, she's so cute 💜. (I am yuri lover>_<)

---

## About

DDLC Extension adds four dark themes inspired by the Dokis and a Webview View inside the Explorer. When the IDE color theme changes, the extension automatically detects the matching Doki and displays her chibi together with a short phrase.

The chibi stays separate from the open code and does not require manual character selection.

---

## Features

- Four dark themes inspired by the Dokis.
- Automatic character switching based on the active theme.
- A Webview View named `DDLC: Doki Chibis`.
- PNG chibis paired with individual `.txt` phrases.
- Visual content kept outside the main editing area.
- Compatibility with IDEs that support extensions and Webviews.

---

## Dokis and Themes

| Theme                 | Doki       | Style                     | Chibi              |
| --------------------- | ---------- | ------------------------- | ------------------ |
| `DDLC - Monika Dark`  | 💚 Monika  | Confident and charismatic | `chibimonika.png`  |
| `DDLC - Sayori Dark`  | 💙 Sayori  | Cheerful and warm         | `chibisayori.png`  |
| `DDLC - Natsuki Dark` | 💗 Natsuki | Direct and charming       | `chibinatsuki.png` |
| `DDLC - Yuri Dark`    | 💜 Yuri    | Elegant and mysterious    | `chibiyuri.png`    |

---

## Installation

### Generated Extension

```bash
npm run compile
vsce package
```

### Marketplace

```bash
IDE --install-extension ddlc-fan.ddlc-themes
```

### Open VSX

```bash
IDE --install-extension ddlc-fan.ddlc-themes
```

### Local VSIX package

```bash
IDE --install-extension ./ddlc-extension.vsix
```

---

## How the Chibi Works

The image and phrase share the same base name inside the `chibis/` folder:

```text
chibis/
|- chibimonika.png
|- chibimonika.txt
|- chibisayori.png
|- chibisayori.txt
|- chibinatsuki.png
|- chibinatsuki.txt
|- chibiyuri.png
`- chibiyuri.txt
```

When `DDLC - Yuri Dark` is active, the extension loads:

```text
chibis/chibiyuri.png
chibis/chibiyuri.txt
```

---

## Interactive Dialogue System

The sidebar now features a fully interactive visual novel style dialogue system where you can chat directly with the Dokis! 

Here is how the new system works in detail:
- **Event-driven Reactions:** The Dokis are aware of your workflow. They will react with specific dialogues and emotions when you perform actions in the IDE, such as saving a file, opening a terminal, encountering an error, creating/deleting files, or even when you are just idle.
- **Random Conversations:** You can initiate a conversation at any time by clicking the "Chat..." button. The Doki will pick a random topic to talk about.
- **Interactive Choices:** During certain conversations, you will be presented with multiple choices on how to respond. The buttons provide visual feedback when pressed, and your selected choice will dictate the Doki's reply and her next emotional sprite.
- **Dynamic Sprites:** The Doki's sprite changes smoothly with a fade effect to match her current emotion (happy, thinking, surprised, reflective, etc.) based on the context of the conversation.
- **History & Localization:** The UI includes a history panel to show recent dialogue lines, and supports changing languages (EN, PT-BR, ES) on the fly via the language selector buttons.

## Gallery

### Monika
![Screenshot 1](/assets/screenshot1.png)
![Screenshot 2](/assets/screenshot2.png)
<br>

### Natsuki 
![Screenshot 3](/assets/screenshot3.png)
![Screenshot 4](/assets/screenshot4.png)
<br>

### Sayori 
![Screenshot 5](/assets/screenshot5.png)
![Screenshot 6](/assets/screenshot6.png)
<br>

### Yuri
![Screenshot 7](/assets/screenshot7.png)
![Screenshot 8](/assets/screenshot8.png)

---

## Credits

This is an unofficial fan-made extension. Credit for the original universe belongs to:

- [Doki Doki Literature Club](https://ddlc.moe/)
- [Team Salvato](https://teamsalvato.com/)
- [Dan Salvato](https://dansalva.to/)

---

## Thank You

Thank you for checking out DDLC Chibi Themes and for spending some time with this little fan project ❤️.

Thank you to everyone who tests the extension, shares suggestions, and helps make the IDE a little more "Doki".

----

## Enjoy! :3
<p>
  <img src="assets/yurisleeping.gif" alt="Yuri scene" width="45%" />
</p>


<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

<details>
<summary>ÐžÐ±ÑŠÐµÐºÑ‚ :: Ã¿Ã‡Ã¿ :: 0x00</summary>

<br>

Ã¿Ã‡Ã¿Ã‡Ã¿Ã‡Ã¿Ã‡Ã¿Ã‡Ã¿Ã‡Ã¿Ã‡Ã¿Ã‡Ã¿Ã‡

ÐžÐ±ÑŠÐµÐºÑ‚: Ñ„Ð°Ð¹Ð» Ð½Ðµ Ñ‡Ð¸Ñ‚Ð°ÐµÑ‚ÑÑ :: 404 :: Ã˜Â¤Ã˜Â¸Ã˜Â»Ã˜ÂµÃ˜Â½

Ã‚Â¡Ã‚Â¡Ã‚Â¡ ÃÂ¿ÃÂ¾ÃÂ²Ã‘Â€ÃÂµÃÂ¶ÃÂ´ÃÂµÃÂ½ÃÂ¸ÃÂµ Ã‚Â¡Ã‚Â¡Ã‚Â¡

Ð¿Ñ€Ð¾Ð´Ð¾Ð»Ð¶ÐµÐ½Ð¸Ðµ :: ÑÐ¸ÑÑ‚ÐµÐ¼Ð° :: ÃƒÂ¿ÃƒÂ¿ÃƒÂ¿

<details>
<summary>ÐœÐ¾Ð½Ð¸ÐºÐ° :: ÃÂœÃÂ¾ÃÂ½ÃÂ¸ÃÂºÃÂ° :: 01</summary>

<img src="./gifs/monika.webp" alt="ÐœÐ¾Ð½Ð¸ÐºÐ°" width="60%" />

</details>

<br>

<details>
<summary>Ð¡Ð°ÐµÐ¾Ñ€Ð¸ :: ÃÂ¡ÃÂ°ÃÂµÃÂ¾ÃÂ€ÃÂ¸ :: 02</summary>

<img src="./gifs/sayori.webp" alt="Ð¡Ð°ÐµÐ¾Ñ€Ð¸" width="40%" />

</details>

<br>

<details>
<summary>ÐќÐ°Ñ†ÑƒÐºÐ¸ :: ÃÂšÃÂ°ÃÂ†Ã‘ÂƒÃÂºÃÂ¸ :: 03</summary>

<img src="./gifs/natsuki.webp" alt="ÐќÐ°Ñ†ÑƒÐºÐ¸" width="60%" />

</details>

<br>

<details>
<summary>Ð®Ñ€Ð¸ :: ÃÂ®Ã‘Â€ÃÂ¸ :: 04</summary>

<img src="./gifs/yuri.webp" alt="Ð®Ñ€Ð¸" width="60%" />

</details>

ÃÂºÃÂ¾ÃÂ½ÃÂµÃ‘Â† :: ÃÂ½ÃÂµÃÂ¸ÃÂ·ÃÂ²ÃÂµÃ‘ÂÃ‘Â‚ÃÂ½ÃÂ¾ :: Ã¿Ã‡Ã¿

</details>
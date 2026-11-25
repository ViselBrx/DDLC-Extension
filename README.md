<div align="center">

# DDLC Chibi Themes

<img src="https://raw.githubusercontent.com/ViselBrx/DDLC-Extension/main/assets/yuriscene.png" alt="Yuri scene" width="100%" />

### Dark themes and Doki chibis for IDEs with a modern code-editor workflow

*A fan-made extension inspired by* [*Doki Doki Literature Club*](https://ddlc.moe/)*, created to make the development environment more thematic and welcoming.*

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

<sub>fan-made · not affiliated with Team Salvato · made with love</sub>

</div>

---

### Hello, my name is Visel ^_^

Look at this extension and check out the structure or the README file <3

> Yuri, she's so cute 💜. *(I am a Yuri lover >u<)*

<br>

## About

**DDLC Extension** adds four dark Doki themes, a custom Product Icon Theme, chibis, and interactive dialogue views to VS Code-compatible editors. You can let the active color theme choose the Doki automatically or select one manually.

<br>

## Features

![Themes](https://img.shields.io/badge/Themes-4_dark_styles-9146FF?style=flat-square&logo=materialdesignicons&logoColor=white)
![Auto Switch](https://img.shields.io/badge/Auto_Switch-theme_based-2ea44f?style=flat-square&logo=sync&logoColor=white)
![Webview](https://img.shields.io/badge/Webview-DDLC_Doki_Chibis-0078D4?style=flat-square&logo=windowsterminal&logoColor=white)
![Sprites](https://img.shields.io/badge/Sprites-PNG_%2B_phrases-FF69B4?style=flat-square&logo=imagemagick&logoColor=white)
![Compatibility](https://img.shields.io/badge/Compatible-IDEs_%2B_Webviews-orange?style=flat-square&logo=visualstudiocode&logoColor=white)

- Four dark Doki themes: Monika, Sayori, Natsuki, and Yuri.
- Chibi and dialogue side views with localized EN, PT-BR, and ES text.
- Workflow-aware dialogue reactions and interactive choices.
- Daily poems in three languages.
- Clean DDLC Product Icons, with safe fallbacks to native VS Code icons.

<br>

## Product Icons

Activate **DDLC Literature Club Icons** with `Ctrl+Shift+P` → `Preferences: Product Icon Theme`. The theme uses validated DDLC glyphs and falls back to native VS Code icons when needed.

<br>

## Dokis and Themes

<div align="center">

| Theme | Doki | Style | Chibi |
|:---:|:---:|:---:|:---:|
| `DDLC - Monika Dark` | 💚 **Monika** | Confident and charismatic | `chibimonika.png` |
| `DDLC - Sayori Dark` | 💙 **Sayori** | Cheerful and warm | `chibisayori.png` |
| `DDLC - Natsuki Dark` | 💗 **Natsuki** | Direct and charming | `chibinatsuki.png` |
| `DDLC - Yuri Dark` | 💜 **Yuri** | Elegant and mysterious | `chibiyuri.png` |

</div>

<br>

## Installation

![npm](https://img.shields.io/badge/npm-run_compile-CB3837?style=flat-square&logo=npm&logoColor=white)
![vsce](https://img.shields.io/badge/vsce-package-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white)

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

<br>

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

<br>

## Commands and Dialogues

Open the Command Palette with `Ctrl+Shift+P` (or `F1`).

| Command | What it does |
|---|---|
| `DDLC: Change active Doki` | Select Monika, Sayori, Natsuki, Yuri, or follow the active theme. |
| `DDLC: Generate poem of the day — <Doki> (Portuguese)` | Creates a PT-BR poem. |
| `DDLC: Generate poem of the day — <Doki> (English)` | Creates an English poem. |
| `DDLC: Generate poem of the day — <Doki> (Spanish)` | Creates a Spanish poem. |

Replace `<Doki>` with Monika, Sayori, Natsuki, or Yuri. Poems are saved in `poemas-do-clube/` with localized names such as `monika-poema-do-dia-YYYY-MM-DD.md`, `monika-poem-of-the-day-YYYY-MM-DD.md`, and `monika-poema-del-dia-YYYY-MM-DD.md`.

The dialogue view reacts to saves, diagnostics, terminals, file changes, debug sessions, commits, editor changes, time of day, and inactivity. Use the **Chat...** button in the view for a random conversation; some conversations include choices and matching character sprites.

<br>

## Gallery

<div align="center">

### Monika
![Screenshot 1](/assets/screenshot1.png)
![Screenshot 2](/assets/screenshot2.png)

### Natsuki
![Screenshot 3](/assets/screenshot3.png)
![Screenshot 4](/assets/screenshot4.png)

### Sayori
![Screenshot 5](/assets/screenshot5.png)
![Screenshot 6](/assets/screenshot6.png)

### Yuri
![Screenshot 7](/assets/screenshot7.png)
![Screenshot 8](/assets/screenshot8.png)

</div>

---

## Credits

This is an unofficial fan-made extension. Credit for the original universe belongs to:

- [Doki Doki Literature Club](https://ddlc.moe/)
- [Team Salvato](https://teamsalvato.com/)
- [Dan Salvato](https://dansalva.to/)

<br>

## Thank You

Thank you for checking out DDLC Chibi Themes and for spending some time with this little fan project ❤️.

Thank you to everyone who tests the extension, shares suggestions, and helps make the IDE a little more "Doki".

<div align="center">

### Enjoy! :3

<img src="assets/yurisleeping.gif" alt="Yuri scene" width="45%" />

</div>

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

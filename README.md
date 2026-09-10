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

**DDLC Extension** adds four dark themes inspired by the Dokis and a Webview View inside the Explorer. When the IDE color theme changes, the extension automatically detects the matching Doki and displays her chibi together with a short phrase.

The chibi stays separate from the open code and does not require manual character selection.

<br>

## Features

![Themes](https://img.shields.io/badge/Themes-4_dark_styles-9146FF?style=flat-square&logo=materialdesignicons&logoColor=white)
![Auto Switch](https://img.shields.io/badge/Auto_Switch-theme_based-2ea44f?style=flat-square&logo=sync&logoColor=white)
![Webview](https://img.shields.io/badge/Webview-DDLC_Doki_Chibis-0078D4?style=flat-square&logo=windowsterminal&logoColor=white)
![Sprites](https://img.shields.io/badge/Sprites-PNG_%2B_phrases-FF69B4?style=flat-square&logo=imagemagick&logoColor=white)
![Compatibility](https://img.shields.io/badge/Compatible-IDEs_%2B_Webviews-orange?style=flat-square&logo=visualstudiocode&logoColor=white)

- Four dark themes inspired by the Dokis.
- Automatic character switching based on the active theme.
- A Webview View named `DDLC: Doki Chibis`.
- PNG chibis paired with individual `.txt` phrases.
- Custom Literature Club product icons for the IDE chrome.
- Visual content kept outside the main editing area.
- Compatibility with IDEs that support extensions and Webviews.

<br>

## Product Icons

**DDLC Literature Club Icons** is a full product icon theme: the little glyphs that show up in the Activity Bar, status bar, menus, and editor chrome. Instead of the default Codicons, you get a soft Literature Club set — same layout, more heart.

Activate it with **Preferences: Product Icon Theme** → `DDLC Literature Club Icons`.

Here is a taste of the set, woven into the places you already look at every day:

When you open the Explorer you will meet
<img src="assets/product-icons/files.png" alt="files" width="18" height="18" />
`files`, and searching the workspace brings
<img src="assets/product-icons/search.png" alt="search" width="18" height="18" />
`search`. The integrated terminal uses
<img src="assets/product-icons/terminal.png" alt="terminal" width="18" height="18" />
`terminal`, while Debug and Extensions keep their usual spots with
<img src="assets/product-icons/debug-alt.png" alt="debug" width="18" height="18" />
`debug-alt` and
<img src="assets/product-icons/extensions.png" alt="extensions" width="18" height="18" />
`extensions`. Account and settings stay recognizable as
<img src="assets/product-icons/account.png" alt="account" width="18" height="18" />
`account` and
<img src="assets/product-icons/settings-gear.png" alt="settings" width="18" height="18" />
`settings-gear`, Source Control keeps
<img src="assets/product-icons/source-control.png" alt="source control" width="18" height="18" />
`source-control`, and yes — there is a little
<img src="assets/product-icons/heart.png" alt="heart" width="18" height="18" />
`heart` in the clubhouse too.

The icons are shipped as an icon font (`producticons/ddlc-icons.woff`) built from the SVG sources under `producticons/svg/`. The build pipeline keeps metrics friendly for VS Code forks (Cursor, Antigravity, and friends) and scales the artwork so the glyphs read clearly at IDE size.

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

## Interactive Dialogue System

The sidebar now features a fully interactive visual novel style dialogue system where you can chat directly with the Dokis!

Here is how the new system works in detail:

- **Event-driven Reactions:** The Dokis are aware of your workflow. They will react with specific dialogues and emotions when you perform actions in the IDE, such as saving a file, opening a terminal, encountering an error, creating/deleting files, or even when you are just idle.
- **Random Conversations:** You can initiate a conversation at any time by clicking the "Chat..." button. The Doki will pick a random topic to talk about.
- **Interactive Choices:** During certain conversations, you will be presented with multiple choices on how to respond. The buttons provide visual feedback when pressed, and your selected choice will dictate the Doki's reply and her next emotional sprite.
- **Dynamic Sprites:** The Doki's sprite changes smoothly with a fade effect to match her current emotion (happy, thinking, surprised, reflective, etc.) based on the context of the conversation.
- **History & Localization:** The UI includes a history panel to show recent dialogue lines, and supports changing languages (EN, PT-BR, ES) on the fly via the language selector buttons.
- **Personal & Meaningful Conversations:** Engage in deeper, more intimate conversations with romantic and heartfelt undertones. The Dokis discuss emotional closeness, quiet moments together, vulnerability, and reassurance — each offering 3 distinct choices for you to reply and see their reactions.

### Deeper & Personal Conversations

Beyond everyday coding reactions, you can connect with the Dokis on a deeper emotional level:

- **Intimate Topics:** Heartfelt conversations covering trust, comfort, vulnerability, and romantic undertones.
- **Tailored Personalities:** Each girl reflects her distinctive charm — Monika's attentive warmth, Sayori's sweet encouragement, Natsuki's tsundere sincerity, and Yuri's poetic intimacy.
- **3 Choices for Every Question:** Every question gives you 3 distinct ways to reply, each triggering unique responses and expressive emotion sprites.

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
import * as vscode from 'vscode';
import { Buffer } from 'node:buffer';
import {
  loadDialogues,
  loadManifest,
  pickDialogue,
  pickRandom,
  getSpriteFilename,
  eventToEmotionKey,
  emotionToManifestKey,
  eventLabel,
  getUiStrings,
  clearDialogueCache,
  type EventKey,
  type DialogueMap,
  type SpriteManifest,
  type DialogueNode,
  type Emotion,
  type UiStrings,
} from './dialogueEngine';
import { ActionDetector } from './actionDetector';

export interface DokiInfo {
  key: string;
  name: string;
  file: string;
  color: string;
  title: string;
}

export const DOKIS: Record<string, DokiInfo> = {
  monika: {
    key: 'monika',
    name: 'Monika',
    file: 'chibimonika.png',
    color: '#2a9d8f',
    title: 'Monika (Club President)',
  },
  sayori: {
    key: 'sayori',
    name: 'Sayori',
    file: 'chibisayori.png',
    color: '#4ea8de',
    title: 'Sayori (Vice President)',
  },
  natsuki: {
    key: 'natsuki',
    name: 'Natsuki',
    file: 'chibinatsuki.png',
    color: '#e76f8a',
    title: 'Natsuki (Manga and Cupcakes)',
  },
  yuri: {
    key: 'yuri',
    name: 'Yuri',
    file: 'chibiyuri.png',
    color: '#7b5294',
    title: 'Yuri (Poetry and Books)',
  },
};

interface MsgDialogue {
  type: 'dialogue';
  text: string;
  spriteFile: string;
  icon: string;
  label: string;
  dokiName: string;
  dokiColor: string;
}

interface MsgRandom {
  type: 'random';
  text: string;
  spriteFile: string;
  choices: DialogueNode['choices'];
  icon: string;
  label: string;
  dokiName: string;
  dokiColor: string;
}

interface MsgFromWebview {
  type: 'choiceSelected' | 'requestRandom' | 'changeLanguage';
  response?: string;
  emotion?: Emotion;
  language?: string;
}

class ChibiWebviewProvider implements vscode.WebviewViewProvider, vscode.Disposable {
  private view?: vscode.WebviewView;
  private dokiKey: string;

  constructor(
    private readonly extensionUri: vscode.Uri,
    dokiKey: string
  ) {
    this.dokiKey = DOKIS[dokiKey] ? dokiKey : 'monika';
  }

  setDoki(dokiKey: string): void {
    this.dokiKey = DOKIS[dokiKey] ? dokiKey : 'monika';
    void this.render();
  }

  resolveWebviewView(view: vscode.WebviewView): void {
    this.view = view;
    view.webview.options = {
      enableScripts: false,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'chibis')]
    };
    view.webview.html = this.loadingHtml();
    view.onDidDispose(() => {
      if (this.view === view) this.view = undefined;
    });
    void this.render();
  }

  dispose(): void {
    this.view = undefined;
  }

  private async render(): Promise<void> {
    const view = this.view;
    if (!view) return;

    const doki = DOKIS[this.dokiKey] || DOKIS.monika;
    const imageUri = view.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'chibis', doki.file)
    );
    const phraseUri = vscode.Uri.joinPath(
      this.extensionUri,
      'chibis',
      doki.file.replace(/\.png$/i, '.txt')
    );
    const phrase = await this.loadPhrase(phraseUri);

    if (view !== this.view || doki.key !== this.dokiKey) return;

    view.webview.html = this.html(view.webview, doki, imageUri, phrase);
  }

  private async loadPhrase(uri: vscode.Uri): Promise<string> {
    try {
      const data = await vscode.workspace.fs.readFile(uri);
      const phrase = Buffer.from(data).toString('utf8').trim();
      return phrase || 'Still reading...';
    } catch {
      return 'No phrase has been defined for this chibi yet.';
    }
  }

  private loadingHtml(): string {
    return `<!doctype html><html lang="en"><body style="font-family:var(--vscode-font-family);color:var(--vscode-foreground);padding:12px;font-size:11px">Loading chibi...</body></html>`;
  }

  private html(
    webview: vscode.Webview,
    doki: DokiInfo,
    imageUri: vscode.Uri,
    phrase: string
  ): string {
    const cspSource = webview.cspSource;
    const name = escapeHtml(doki.name);
    const safePhrase = escapeHtml(phrase);

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${cspSource}; style-src 'unsafe-inline';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; }
    body {
      display: flex;
      justify-content: center;
      padding: 11px 7px 15px;
      background: var(--vscode-sideBar-background);
      color: var(--vscode-sideBar-foreground);
      font-family: var(--vscode-font-family);
    }
    .card {
      width: 100%;
      min-height: 194px;
      padding: 11px 9px 13px;
      border: 1px solid var(--vscode-focusBorder);
      border-radius: 5px;
      background: var(--vscode-sideBar-background);
      text-align: center;
    }
    .label {
      color: var(--vscode-textLink-foreground);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    img {
      display: block;
      width: 118px;
      height: 118px;
      margin: 3px auto 0;
      object-fit: contain;
    }
    .name {
      margin-top: -1px;
      color: var(--vscode-foreground);
      font-size: 13px;
      font-weight: 600;
    }
    .phrase {
      margin: 8px 4px 0;
      color: var(--vscode-descriptionForeground);
      font-size: 11px;
      font-style: italic;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }
  </style>
</head>
<body>
  <section class="card" aria-label="Chibi for the ${name} theme">
    <div class="label">DDLC Chibi</div>
    <img src="${imageUri}" alt="Chibi of ${name}">
    <div class="name">${name}</div>
    <div class="phrase">${safePhrase}</div>
  </section>
</body>
</html>`;
  }
}

class DialogueWebviewProvider
  implements vscode.WebviewViewProvider, vscode.Disposable
{
  private view?: vscode.WebviewView;
  private dokiKey: string;
  private dialogueMap?: DialogueMap;
  private dialogueMapDoki?: string;
  private manifest?: SpriteManifest;
  private sessionVersion = 0;
  private eventQueue: EventKey[] = [];
  private processingEvents = false;
  private rendering = false;
  private outgoingMessages: Promise<void> = Promise.resolve();

  constructor(
    private readonly extensionUri: vscode.Uri,
    dokiKey: string
  ) {
    this.dokiKey = DOKIS[dokiKey] ? dokiKey : 'monika';
  }

  setDoki(dokiKey: string): void {
    const newKey = DOKIS[dokiKey] ? dokiKey : 'monika';
    this.dokiKey = newKey;
    this.invalidateSession();
    void this.render().then(() => this.flushEventQueue());
  }

  refresh(): void {
    this.invalidateSession();
    void this.render().then(() => this.flushEventQueue());
  }

  async handleEvent(event: EventKey): Promise<void> {
    this.eventQueue.push(event);
    if (this.eventQueue.length > 12) this.eventQueue.shift();
    await this.flushEventQueue();
  }

  private async flushEventQueue(): Promise<void> {
    if (this.processingEvents) return;
    this.processingEvents = true;

    try {
      while (this.eventQueue.length > 0) {
        if (!this.view || this.rendering) return;
        const event = this.eventQueue.shift()!;
        try {
          await this.processEvent(event);
        } catch (error) {
          console.error('[DDLC] Event processing failed:', error);
        }
      }
    } finally {
      this.processingEvents = false;
    }
  }

  private async processEvent(event: EventKey): Promise<void> {
    const view = this.view;
    const dokiKey = this.dokiKey;
    const version = this.sessionVersion;
    if (!view) return;

    const [map, manifest] = await this.ensureData(dokiKey);
    if (!this.isCurrent(view, dokiKey, version)) return;

    const doki = DOKIS[dokiKey];
    const spriteUri = this.spriteUri(view, manifest, dokiKey, eventToEmotionKey(event));
    const ui = getUiStrings();

    if (event === 'random') {
      const rd = pickRandom(map);
      const { icon, label } = eventLabel('random', ui);
      const randomSpriteUri = this.spriteUri(
        view,
        manifest,
        dokiKey,
        emotionToManifestKey(rd.emotion ?? 'thinking')
      );
      const msg: MsgRandom = {
        type: 'random',
        text: rd.text,
        spriteFile: randomSpriteUri,
        choices: rd.choices,
        icon,
        label,
        dokiName: doki.name,
        dokiColor: doki.color,
      };
      this.queueMessage(view, dokiKey, version, msg);
      return;
    }

    const { icon, label } = eventLabel(event, ui);
    const msg: MsgDialogue = {
      type: 'dialogue',
      text: pickDialogue(map, event),
      spriteFile: spriteUri,
      icon,
      label,
      dokiName: doki.name,
      dokiColor: doki.color,
    };
    this.queueMessage(view, dokiKey, version, msg);
  }

  resolveWebviewView(view: vscode.WebviewView): void {
    this.view = view;
    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.extensionUri, 'sprites'),
      ],
    };
    view.webview.html = this.loadingHtml(getUiStrings());

    view.onDidDispose(() => {
      if (this.view === view) this.view = undefined;
    });

    view.webview.onDidReceiveMessage((msg: MsgFromWebview) => {
      const emotion = normalizeEmotion(msg.emotion) ?? 'happy';
      if (msg.type === 'choiceSelected' && msg.response) {
        void this.handleChoiceResponse(msg.response, emotion);
      } else if (msg.type === 'requestRandom') {
        void this.handleEvent('random');
      } else if (msg.type === 'changeLanguage' && msg.language) {
        void vscode.workspace
          .getConfiguration('ddlc')
          .update('language', msg.language, vscode.ConfigurationTarget.Global)
          .then(undefined, (error) => console.error('[DDLC] Language update failed:', error));
      }
    });

    void this.render().then(() => this.flushEventQueue());
  }

  private async render(): Promise<void> {
    const view = this.view;
    if (!view) return;

    const dokiKey = this.dokiKey;
    const version = this.sessionVersion;
    let rendered = false;
    this.rendering = true;

    try {
      const ui = getUiStrings();
      const [map, manifest] = await this.ensureData(dokiKey);
      if (!this.isCurrent(view, dokiKey, version)) return;

      const doki = DOKIS[dokiKey] || DOKIS.monika;
      const spriteUri = this.spriteUri(view, manifest, dokiKey, eventToEmotionKey('onActivate'));

      const greeting = pickDialogue(map, 'onActivate');
      const { icon, label } = eventLabel('onActivate', ui);
      const currentLang = (vscode.workspace.getConfiguration('ddlc').get<string>('language') ?? 'en').toLowerCase();
      const showHistory = vscode.workspace.getConfiguration('ddlc').get<boolean>('showDialogueHistory', true);

      view.webview.html = this.buildHtml(
        view.webview,
        doki,
        spriteUri,
        greeting,
        icon,
        label,
        currentLang,
        ui,
        showHistory
      );
      rendered = true;
    } catch (err) {
      if (!this.isCurrent(view, dokiKey, version)) return;
      const ui = getUiStrings();
      console.error('[DDLC] render() failed:', err);
      view.webview.html = `<!doctype html><html><body style="font-family:var(--vscode-font-family);color:var(--vscode-foreground);padding:12px;font-size:11px">
        <b style="color:#e76f8a">${escapeHtml(ui.loading.replace('...',''))}: Error</b><br><pre style="white-space:pre-wrap;font-size:10px;margin-top:8px">${escapeHtml(String(err))}</pre>
      </body></html>`;
      this.eventQueue = [];
    } finally {
      this.rendering = false;
      if (rendered) void this.flushEventQueue();
    }
  }

  private async handleChoiceResponse(response: string, emotion: Emotion): Promise<void> {
    const view = this.view;
    if (!view) return;

    const dokiKey = this.dokiKey;
    const version = this.sessionVersion;

    try {
      const [, manifest] = await this.ensureData(dokiKey);
      if (!this.isCurrent(view, dokiKey, version)) return;

      const doki = DOKIS[dokiKey];
      const emotionKey = emotionToManifestKey(emotion);
      const spriteUri = this.spriteUri(view, manifest, dokiKey, emotionKey);

      const ui = getUiStrings();
      const msg: MsgDialogue = {
        type: 'dialogue',
        text: response,
        spriteFile: spriteUri,
        icon: 'comment-discussion',
        label: ui.btnReply,
        dokiName: doki.name,
        dokiColor: doki.color,
      };
      this.queueMessage(view, dokiKey, version, msg);

    } catch (err) {
      console.error('[DDLC] Error in handleChoiceResponse:', err);
    }
  }

  private async ensureData(dokiKey: string): Promise<[DialogueMap, SpriteManifest]> {
    const map = this.dialogueMap && this.dialogueMapDoki === dokiKey
      ? this.dialogueMap
      : await loadDialogues(dokiKey, this.extensionUri);
    const manifest = this.manifest ?? await loadManifest(this.extensionUri);

    if (this.dokiKey === dokiKey) {
      this.dialogueMap = map;
      this.dialogueMapDoki = dokiKey;
      this.manifest = manifest;
    }

    return [map, manifest];
  }

  private invalidateSession(): void {
    this.sessionVersion += 1;
    this.eventQueue = [];
    this.dialogueMap = undefined;
    this.dialogueMapDoki = undefined;
    clearDialogueCache();

    if (this.view) this.view.webview.html = this.loadingHtml(getUiStrings());
  }

  private isCurrent(view: vscode.WebviewView, dokiKey: string, version: number): boolean {
    return this.view === view && this.dokiKey === dokiKey && this.sessionVersion === version;
  }

  private queueMessage(
    view: vscode.WebviewView,
    dokiKey: string,
    version: number,
    message: MsgDialogue | MsgRandom
  ): void {
    this.outgoingMessages = this.outgoingMessages
      .then(() => {
        if (this.isCurrent(view, dokiKey, version)) {
          void Promise.resolve(view.webview.postMessage(message)).catch((error) => {
            console.error('[DDLC] Webview message failed:', error);
          });
        }
      })
      .catch((error) => console.error('[DDLC] Webview message failed:', error));
  }

  private spriteUri(
    view: vscode.WebviewView,
    manifest: SpriteManifest,
    dokiKey: string,
    emotionKey: string
  ): string {
    const spriteFile = getSpriteFilename(manifest, dokiKey, emotionKey);
    return view.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'sprites', dokiKey, `${spriteFile}.webp`)
    ).toString();
  }

  private loadingHtml(ui?: UiStrings): string {
    const text = ui?.loading ?? 'Loading...';
    return `<!doctype html><html><body style="font-family:var(--vscode-font-family);color:var(--vscode-foreground);padding:12px;font-size:11px">${text}</body></html>`;
  }

  private buildHtml(
    webview: vscode.Webview,
    doki: DokiInfo,
    spriteUri: string,
    greeting: string,
    icon: string,
    label: string,
    currentLang: string,
    ui: UiStrings = getUiStrings(),
    showHistory = true
  ): string {
    const csp = webview.cspSource;
    const color = escapeHtml(doki.color);
    const name = escapeHtml(doki.name);

    return `<!doctype html>
<html lang="${escapeHtml(currentLang)}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none'; img-src ${csp} data:; style-src 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src https://fonts.gstatic.com https://cdn.jsdelivr.net; script-src 'nonce-ddlc2025';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@vscode/codicons/dist/codicon.css" rel="stylesheet">
  <style>
    :root {
      --accent: ${color};
      --accent-dim: color-mix(in srgb, ${color} 25%, transparent);
      --accent-mid: color-mix(in srgb, ${color} 50%, transparent);
      --vn-bg: rgba(15, 10, 20, 0.88);
      --vn-border: color-mix(in srgb, ${color} 55%, #fff 10%);
      --vn-text: #f0eaf5;
      --vn-name-bg: ${color};
      color-scheme: dark;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      height: 100%;
      background: var(--vscode-sideBar-background, #0d0d12);
      font-family: 'Nunito', var(--vscode-font-family), sans-serif;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .vn-root {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      padding: 8px 0 14px;
      gap: 7px;
    }

    .sprite-stage {
      width: 100%;
      max-width: 276px;
      position: relative;
      margin: 0 auto;
      flex-shrink: 0;
      padding: 0 4px;
    }
    #sprite {
      width: 100%;
      max-height: 260px;
      height: auto;
      display: block;
      object-fit: contain;
      filter: drop-shadow(0 4px 18px color-mix(in srgb, var(--accent) 35%, transparent));
      transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    }
    #sprite.fading { opacity: 0; transform: scale(0.97) translateY(6px); }

    .event-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: var(--accent);
      padding: 3px 8px 4px;
      background: var(--accent-dim);
      border: 1px solid var(--accent-mid);
      border-radius: 20px;
      align-self: center;
      margin-top: -4px;
      margin-bottom: 0;
      backdrop-filter: blur(4px);
    }
    .event-badge i { font-size: 11px; }

    .vn-box {
      width: calc(100% - 10px);
      background: var(--vn-bg);
      border: 1.5px solid var(--vn-border);
      border-radius: 10px;
      overflow: hidden;
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent) 10%, transparent),
        0 8px 32px rgba(0,0,0,0.45),
        inset 0 1px 0 rgba(255,255,255,0.05);
      backdrop-filter: blur(12px);
      flex-shrink: 0;
    }

    .vn-name {
      display: inline-block;
      background: var(--vn-name-bg);
      color: #fff;
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: .06em;
      padding: 3px 14px 4px;
      border-radius: 0 0 8px 0;
      text-shadow: 0 1px 3px rgba(0,0,0,0.4);
      box-shadow: 2px 2px 8px rgba(0,0,0,0.3);
    }

    .vn-text-area {
      padding: 8px 12px 10px;
      min-height: 52px;
      position: relative;
    }
    #dialogueText {
      font-size: 12px;
      line-height: 1.65;
      color: var(--vn-text);
      font-style: italic;
      word-break: break-word;
    }

    #vnCursor {
      display: inline-block;
      color: var(--accent);
      font-size: 10px;
      margin-left: 3px;
      opacity: 0;
      animation: blink 0.9s step-end infinite;
      vertical-align: middle;
    }
    @keyframes blink { 0%,100%{opacity:0} 50%{opacity:1} }

    .choices-area {
      display: none;
      flex-direction: column;
      gap: 6px;
      padding: 6px 10px 10px;
      border-top: 1px solid var(--accent-mid);
      background: rgba(0,0,0,0.15);
      position: relative;
      z-index: 2;
      pointer-events: auto;
    }
    .choice-btn {
      display: block;
      width: 100%;
      background: transparent;
      border: 1px solid var(--accent-mid);
      border-radius: 6px;
      color: var(--vn-text);
      font-family: 'Nunito', sans-serif;
      font-size: 11px;
      font-style: italic;
      padding: 7px 11px;
      cursor: pointer;
      text-align: left;
      transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.1s ease, opacity 0.1s ease;
      position: relative;
      overflow: hidden;
      user-select: none;
      pointer-events: auto;
    }
    .choice-btn:hover {
      background: var(--accent-dim);
      border-color: var(--accent);
      color: #fff;
    }
    .choice-btn:focus-visible {
      outline: 1px solid var(--accent);
      outline-offset: 2px;
    }
    .choice-btn:active,
    .choice-btn.choice-pressing {
      background: var(--accent-dim);
      border-color: var(--accent);
      color: #fff;
      transform: scale(0.97);
      opacity: .85;
    }

    .history-area {
      width: calc(100% - 10px);
      display: grid;
      gap: 3px;
      margin-top: 0;
    }
    .history-area[hidden] { display: none; }
    .history-heading {
      padding: 0 2px 2px;
      color: var(--vscode-descriptionForeground);
      font-size: 8px;
      font-weight: 700;
      letter-spacing: .12em;
      opacity: .65;
      text-transform: uppercase;
    }
    .history-item {
      min-width: 0;
      padding: 4px 7px;
      border-left: 2px solid color-mix(in srgb, var(--accent) 42%, transparent);
      border-radius: 0 4px 4px 0;
      background: color-mix(in srgb, var(--vscode-editor-background) 55%, transparent);
      color: var(--vscode-descriptionForeground);
      font-size: 9.5px;
      font-style: italic;
      line-height: 1.35;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      transition: background-color .16s ease, border-color .16s ease, color .16s ease;
    }
    .history-item:hover {
      background: var(--accent-dim);
      color: var(--vn-text);
      border-left-color: var(--accent);
    }

    .bottom-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: calc(100% - 10px);
      gap: 8px;
      margin-top: 0;
    }

    .talk-btn {
      min-width: 0;
      padding: 6px 11px;
      background: var(--vn-bg);
      border: 1px solid var(--accent);
      color: var(--accent);
      font-weight: 700;
      border-radius: 20px;
      cursor: pointer;
      font-size: 11px;
      transition: background-color .18s ease, color .18s ease, border-color .18s ease;
      white-space: nowrap;
    }
    .talk-btn:hover {
      background: var(--accent);
      color: #fff;
    }

    .lang-selector {
      display: flex;
      background: rgba(0,0,0,0.4);
      border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
      border-radius: 20px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .lang-btn {
      background: transparent;
      border: none;
      color: var(--vn-text);
      font-size: 9px;
      font-weight: 800;
      letter-spacing: .05em;
      padding: 5px 8px;
      cursor: pointer;
      transition: background-color .18s ease, color .18s ease, opacity .18s ease;
      opacity: 0.5;
    }
    .lang-btn:hover {
      opacity: 0.9;
      background: rgba(255,255,255,0.08);
    }
    .lang-btn.active {
      opacity: 1;
      background: var(--accent);
      color: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    }
  </style>
</head>
<body>
<div class="vn-root" id="root">

  <div class="sprite-stage">
    <img id="sprite" src="${escapeHtml(spriteUri)}" alt="${name}">
  </div>

  <div class="event-badge" id="eventBadge">
    <i class="codicon codicon-${icon}" id="eventIcon"></i>
    <span id="eventLabel">${escapeHtml(label)}</span>
  </div>

  <div class="vn-box" id="vnBox">
    <div class="vn-name" id="nameTag">${name}</div>
    <div class="vn-text-area">
      <span id="dialogueText"></span><span id="vnCursor">v</span>
    </div>
    <div class="choices-area" id="choices"></div>
  </div>

  <div class="history-area" id="history"${showHistory ? '' : ' hidden'}>
    <div class="history-heading">${escapeHtml(ui.history)}</div>
    <div id="historyItems"></div>
  </div>

  <div class="bottom-controls">
    <button class="talk-btn" id="talkBtn">${escapeHtml(ui.btnTalk)}</button>
    <div class="lang-selector" id="langSelect">
      <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
      <button class="lang-btn ${currentLang === 'pt-br' ? 'active' : ''}" data-lang="pt-br">PT</button>
      <button class="lang-btn ${currentLang === 'es' ? 'active' : ''}" data-lang="es">ES</button>
    </div>
  </div>
</div>

<script nonce="ddlc2025">
(function() {
  const vscode = acquireVsCodeApi();

  const spriteEl    = document.getElementById('sprite');
  const nameTagEl   = document.getElementById('nameTag');
  const eventBadge  = document.getElementById('eventBadge');
  const eventIcon   = document.getElementById('eventIcon');
  const eventLabel  = document.getElementById('eventLabel');
  const textEl      = document.getElementById('dialogueText');
  const cursorEl    = document.getElementById('vnCursor');
  const choicesEl   = document.getElementById('choices');
  const historyArea = document.getElementById('history');
  const historyEl   = document.getElementById('historyItems');
  const talkBtn     = document.getElementById('talkBtn');
  const langSelect  = document.getElementById('langSelect');

  let typeTimer = null;
  let typePauseTimer = null;
  let spriteSwapTimer = null;
  let contentVersion = 0;
  let currentText = ${JSON.stringify(greeting)};
  let pendingResponse = null;
  const dialogueSpeed = 31;
  const initialDialogueSpeed = 35;
  const historyItems = [];
  const historyEnabled = ${showHistory ? 'true' : 'false'};
  const replyLabel = ${JSON.stringify(ui.btnReply)};
  if (historyArea) historyArea.hidden = true;

  if (talkBtn) {
    talkBtn.addEventListener('click', () => {
      vscode.postMessage({ type: 'requestRandom' });
    });
  }

  if (langSelect) {
    const btns = langSelect.querySelectorAll('.lang-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget;
        if (!target.classList.contains('active')) {
          vscode.postMessage({ type: 'changeLanguage', language: target.getAttribute('data-lang') });
        }
      });
    });
  }

  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function pushHistory(text) {
    if (!text || !text.trim()) return;
    historyItems.unshift(text);
    if (historyItems.length > 3) historyItems.pop();
    historyEl.innerHTML = historyItems
      .map(t => '<div class="history-item" title="' + esc(t) + '">' + esc(t) + '</div>')
      .join('');
    if (historyArea) historyArea.hidden = !historyEnabled || historyItems.length === 0;
  }

  function typewrite(text, speedMs, onDone) {
    const version = contentVersion;
    if (typeTimer) { clearInterval(typeTimer); typeTimer = null; }
    if (typePauseTimer) { clearTimeout(typePauseTimer); typePauseTimer = null; }
    cursorEl.style.opacity = '0';
    textEl.textContent = '';

    const chars = [...String(text)];
    let i = 0;
    const speed = speedMs || 28;

    function tick() {
      if (version !== contentVersion) return;
      if (i >= chars.length) {
        typeTimer = null;
        cursorEl.style.animation = 'blink 0.9s step-end infinite';
        cursorEl.style.opacity = '';
        if (onDone) onDone();
        return;
      }
      const ch = chars[i++];
      textEl.textContent += ch;

      if ((ch === '.' || ch === '!' || ch === '?') && i < chars.length) {
        clearInterval(typeTimer);
        typeTimer = null;
        typePauseTimer = setTimeout(() => {
          typePauseTimer = null;
          if (version !== contentVersion) return;
          typeTimer = setInterval(tick, speed);
        }, 245);
      }
    }

    typeTimer = setInterval(tick, speed);
  }

  function swapSprite(newSrc, cb) {
    const version = contentVersion;
    if (spriteSwapTimer) { clearTimeout(spriteSwapTimer); spriteSwapTimer = null; }
    if (spriteEl.src === newSrc) {
      spriteEl.classList.remove('fading');
      if (cb) cb();
      return;
    }
    spriteEl.classList.add('fading');
    spriteSwapTimer = setTimeout(() => {
      spriteSwapTimer = null;
      if (version !== contentVersion) return;
      spriteEl.src = newSrc;
      let finished = false;
      const finish = () => {
        if (finished || version !== contentVersion) return;
        finished = true;
        if (spriteSwapTimer) { clearTimeout(spriteSwapTimer); spriteSwapTimer = null; }
        spriteEl.classList.remove('fading');
        if (cb) cb();
      };
      spriteEl.onload = finish;
      spriteEl.onerror = finish;
      spriteSwapTimer = setTimeout(finish, 650);
    }, 280);
  }

  function setEventBadge(icon, label) {
    eventIcon.className = 'codicon codicon-' + (icon || 'comment');
    eventLabel.textContent = label || '';
  }

  function showDialogue(msg) {
    if (pendingResponse !== null && String(msg.text || '') === pendingResponse) {
      pendingResponse = null;
      setEventBadge(msg.icon, msg.label);
      swapSprite(msg.spriteFile);
      return;
    }
    pendingResponse = null;
    contentVersion += 1;
    pushHistory(currentText);
    currentText = String(msg.text || '');

    choicesEl.style.display = 'none';
    choicesEl.innerHTML = '';
    cursorEl.style.animation = 'none';
    cursorEl.style.opacity = '0';

    setEventBadge(msg.icon, msg.label);
    nameTagEl.textContent = msg.dokiName || '${name}';

    swapSprite(msg.spriteFile, () => {
      typewrite(msg.text, dialogueSpeed);
    });
  }

  function showRandom(msg) {
    pendingResponse = null;
    const version = ++contentVersion;
    let choiceLocked = false;
    const choices = msg.choices || [];
    pushHistory(currentText);
    currentText = String(msg.text || '');

    choicesEl.style.display = 'none';
    choicesEl.innerHTML = '';
    cursorEl.style.animation = 'none';
    cursorEl.style.opacity = '0';

    setEventBadge(msg.icon || 'comment-discussion', msg.label || 'Chat');
    nameTagEl.textContent = msg.dokiName || '${name}';

    swapSprite(msg.spriteFile, () => {
      typewrite(msg.text, dialogueSpeed, () => {
        if (version !== contentVersion) return;
        cursorEl.style.animation = 'none';
        cursorEl.style.opacity = '0';

        choicesEl.innerHTML = '';
        const selectChoice = (choice) => {
          if (choiceLocked) return;
          choiceLocked = true;
          choicesEl.style.display = 'none';

          contentVersion += 1;
          pendingResponse = String(choice.response || '');
          pushHistory(currentText);
          currentText = pendingResponse;
          setEventBadge('comment-discussion', replyLabel);
          typewrite(currentText, dialogueSpeed);

          try {
            vscode.postMessage({
              type: 'choiceSelected',
              response: choice.response,
              emotion: choice.emotion
            });
          } catch (error) {
            console.error('[DDLC] Choice message failed:', error);
          }
        };

        choices.forEach((c) => {
          const btn = document.createElement('button');
          btn.className = 'choice-btn';
          btn.type = 'button';
          btn.textContent = '> ' + c.text;

          btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            selectChoice(c);
          });

          choicesEl.appendChild(btn);
        });
        choicesEl.style.display = 'flex';
      });
    });
  }

  typewrite(currentText, initialDialogueSpeed);

  window.addEventListener('message', e => {
    const msg = e.data;
    if (msg.type === 'dialogue') showDialogue(msg);
    else if (msg.type === 'random') showRandom(msg);
  });
})();
</script>
</body>
</html>`;
  }

  dispose(): void {
    this.view = undefined;
    this.eventQueue = [];
  }
}

export function activate(context: vscode.ExtensionContext): void {
  console.log('DDLC Extension activated.');

  const activeDoki = getActiveDoki();

  const chibiProvider = new ChibiWebviewProvider(context.extensionUri, activeDoki);
  const chibiView = vscode.window.registerWebviewViewProvider(
    'ddlc.chibiView',
    chibiProvider,
    { webviewOptions: { retainContextWhenHidden: true } }
  );

  const dialogueProvider = new DialogueWebviewProvider(context.extensionUri, activeDoki);
  const dialogueView = vscode.window.registerWebviewViewProvider(
    'ddlc.dialogueView',
    dialogueProvider,
    { webviewOptions: { retainContextWhenHidden: true } }
  );

  const configListener = vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('workbench.colorTheme')) {
      const currentTheme = vscode.workspace
        .getConfiguration('workbench')
        .get<string>('colorTheme', '');
      const newDoki = getDokiFromThemeName(currentTheme) || 'monika';
      chibiProvider.setDoki(newDoki);
      dialogueProvider.setDoki(newDoki);
    }
    if (event.affectsConfiguration('ddlc.language') || event.affectsConfiguration('ddlc.showDialogueHistory')) {
      dialogueProvider.refresh();
    }
  });

  const detector = new ActionDetector(
    (event) => void dialogueProvider.handleEvent(event),
    Math.max(0, vscode.workspace.getConfiguration('ddlc').get<number>('dialogueCooldown', 5)) * 1000,
    Math.max(1, vscode.workspace.getConfiguration('ddlc').get<number>('idleTimeout', 60)) * 1000
  );
  detector.register(context);

  setTimeout(() => void dialogueProvider.handleEvent('onActivate'), 2000);

  context.subscriptions.push(
    configListener,
    chibiView,
    chibiProvider,
    dialogueView,
    dialogueProvider,
    detector
  );
}

export function deactivate(): void {}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getDokiFromThemeName(themeName: string): string | undefined {
  const lower = themeName.toLowerCase();
  if (lower.includes('sayori'))  return 'sayori';
  if (lower.includes('natsuki')) return 'natsuki';
  if (lower.includes('yuri'))    return 'yuri';
  if (lower.includes('monika'))  return 'monika';
  return undefined;
}

function getActiveDoki(): string {
  const currentTheme = vscode.workspace
    .getConfiguration('workbench')
    .get<string>('colorTheme', '');
  return getDokiFromThemeName(currentTheme) || 'monika';
}

function normalizeEmotion(value: unknown): Emotion | undefined {
  if (value === 'happy'
    || value === 'smiling'
    || value === 'reflective'
    || value === 'animated'
    || value === 'thinking'
    || value === 'surprised'
    || value === 'excited') {
    return value;
  }
  return undefined;
}

import * as vscode from 'vscode';
import { Buffer } from 'node:buffer';

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
    title: 'Monika (Club President)'
  },
  sayori: {
    key: 'sayori',
    name: 'Sayori',
    file: 'chibisayori.png',
    color: '#4ea8de',
    title: 'Sayori (Vice President)'
  },
  natsuki: {
    key: 'natsuki',
    name: 'Natsuki',
    file: 'chibinatsuki.png',
    color: '#e76f8a',
    title: 'Natsuki (Manga and Cupcakes)'
  },
  yuri: {
    key: 'yuri',
    name: 'Yuri',
    file: 'chibiyuri.png',
    color: '#7b5294',
    title: 'Yuri (Poetry and Books)'
  }
};

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

    // Ignore an old read if the user changed the theme while it was loading.
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

export function activate(context: vscode.ExtensionContext) {
  console.log('DDLC Extension activated with the Chibi Webview.');

  const chibiProvider = new ChibiWebviewProvider(
    context.extensionUri,
    getActiveDoki()
  );
  const chibiView = vscode.window.registerWebviewViewProvider(
    'ddlc.chibiView',
    chibiProvider,
    { webviewOptions: { retainContextWhenHidden: true } }
  );

  const themeListener = vscode.workspace.onDidChangeConfiguration((event) => {
    if (!event.affectsConfiguration('workbench.colorTheme')) return;

    const currentTheme = vscode.workspace
      .getConfiguration('workbench')
      .get<string>('colorTheme', '');
    chibiProvider.setDoki(getDokiFromThemeName(currentTheme) || 'monika');
  });

  context.subscriptions.push(themeListener, chibiView, chibiProvider);
}

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
  if (lower.includes('sayori')) return 'sayori';
  if (lower.includes('natsuki')) return 'natsuki';
  if (lower.includes('yuri')) return 'yuri';
  if (lower.includes('monika')) return 'monika';
  return undefined;
}

function getActiveDoki(): string {
  const currentTheme = vscode.workspace
    .getConfiguration('workbench')
    .get<string>('colorTheme', '');
  return getDokiFromThemeName(currentTheme) || 'monika';
}

export function deactivate() {}

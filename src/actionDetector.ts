import * as vscode from 'vscode';
import type { EventKey } from './dialogueEngine';

export type EventCallback = (event: EventKey) => void;

export class ActionDetector implements vscode.Disposable {
  private disposables: vscode.Disposable[] = [];
  private lastTriggered = 0;
  private readonly cooldownMs: number;
  private idleTimer: NodeJS.Timeout | undefined;
  private randomTimer: NodeJS.Timeout | undefined;
  private timeTimer: NodeJS.Timeout | undefined;
  private resumeTimer: NodeJS.Timeout | undefined;
  private readonly idleTimeoutMs: number;
  private readonly callback: EventCallback;
  private paused = false;
  private readonly knownTerminals = new Set<vscode.Terminal>();
  private lastActiveEditor: string | undefined;
  private lastTimeBucket: string;
  private readonly commitHeads = new Map<string, string | undefined>();

  constructor(
    callback: EventCallback,
    cooldownMs = 5000,
    idleTimeoutMs = 90_000
  ) {
    this.callback = callback;
    this.cooldownMs = cooldownMs;
    this.idleTimeoutMs = idleTimeoutMs;
    this.lastTimeBucket = this.getTimeBucket();
  }

  register(context: vscode.ExtensionContext): void {
    vscode.window.terminals.forEach((terminal) => this.knownTerminals.add(terminal));

    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      this.lastActiveEditor = activeEditor.document.uri.toString();
    }

    this.disposables.push(
      vscode.workspace.onDidSaveTextDocument(() => this.trigger('onSave'))
    );

    this.disposables.push(
      vscode.languages.onDidChangeDiagnostics((e) => {
        for (const uri of e.uris) {
          const diags = vscode.languages.getDiagnostics(uri);
          const hasError = diags.some(
            (d) => d.severity === vscode.DiagnosticSeverity.Error
          );
          if (hasError) {
            this.trigger('onError');
            break;
          }
        }
      })
    );

    this.disposables.push(
      vscode.window.onDidOpenTerminal((terminal) => {
        if (this.knownTerminals.has(terminal)) return;
        this.knownTerminals.add(terminal);
        this.trigger('onTerminal');
      }),
      vscode.window.onDidCloseTerminal((terminal) => {
        this.knownTerminals.delete(terminal);
      })
    );

    this.disposables.push(
      vscode.workspace.onDidCreateFiles(() => this.trigger('onFileCreate'))
    );

    this.disposables.push(
      vscode.workspace.onDidDeleteFiles(() => this.trigger('onFileDelete'))
    );

    this.disposables.push(
      vscode.debug.onDidStartDebugSession(() => this.trigger('onDebug'))
    );

    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        this.resetIdleTimer();
        if (!editor) return;

        const editorKey = editor.document.uri.toString();
        if (editorKey !== this.lastActiveEditor) {
          this.lastActiveEditor = editorKey;
          this.trigger('onEditorChange');
        }
      })
    );

    const resetIdle = () => this.resetIdleTimer();
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument(resetIdle),
      vscode.window.onDidChangeActiveTextEditor(resetIdle),
      vscode.workspace.onDidSaveTextDocument(resetIdle),
      vscode.window.onDidOpenTerminal(resetIdle),
      vscode.window.onDidChangeActiveTerminal(resetIdle)
    );

    this.resetIdleTimer();
    this.scheduleRandom();
    this.scheduleTimeCheck();
    this.registerGitCommitDetector();

    context.subscriptions.push(...this.disposables, this);
  }

  private trigger(event: EventKey): void {
    if (this.paused) return;
    const now = Date.now();
    if (now - this.lastTriggered < this.cooldownMs) return;
    this.lastTriggered = now;
    this.callback(event);
  }

  private resetIdleTimer(): void {
    if (this.paused) return;
    if (this.idleTimer !== undefined) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      if (this.paused) return;
      this.callback('onIdle');
      this.resetIdleTimer();
    }, this.idleTimeoutMs);
  }

  private scheduleRandom(): void {
    const minMs = 3 * 60 * 1000;
    const maxMs = 7 * 60 * 1000;
    const delay = minMs + Math.random() * (maxMs - minMs);

    this.randomTimer = setTimeout(() => {
      if (this.paused) return;
      this.callback('random');
      this.scheduleRandom();
    }, delay);
  }

  private scheduleTimeCheck(): void {
    this.timeTimer = setInterval(() => {
      const bucket = this.getTimeBucket();
      if (bucket === this.lastTimeBucket) return;
      this.lastTimeBucket = bucket;
      this.trigger('onTimeOfDay');
    }, 30_000);
  }

  pause(): void {
    this.paused = true;
    if (this.idleTimer !== undefined) clearTimeout(this.idleTimer);
    if (this.randomTimer !== undefined) clearTimeout(this.randomTimer);
    if (this.timeTimer !== undefined) clearInterval(this.timeTimer);
    this.idleTimer = undefined;
    this.randomTimer = undefined;
    this.timeTimer = undefined;
  }

  resumeAfter(delayMs = 5_000): void {
    this.pause();
    if (this.resumeTimer !== undefined) clearTimeout(this.resumeTimer);
    this.resumeTimer = setTimeout(() => {
      this.resumeTimer = undefined;
      this.paused = false;
      this.lastTimeBucket = this.getTimeBucket();
      const activeEditor = vscode.window.activeTextEditor;
      this.lastActiveEditor = activeEditor?.document.uri.toString();
      this.resetIdleTimer();
      this.scheduleRandom();
      this.scheduleTimeCheck();
    }, Math.max(0, delayMs));
  }

  private getTimeBucket(): string {
    const hour = new Date().getHours();
    if (hour < 6) return 'madrugada';
    if (hour < 12) return 'manhã';
    if (hour < 18) return 'tarde';
    return 'noite';
  }

  private async registerGitCommitDetector(): Promise<void> {
    try {
      const gitExtension = vscode.extensions.getExtension<any>('vscode.git');
      if (!gitExtension) return;

      const git = gitExtension.isActive
        ? gitExtension.exports
        : await gitExtension.activate();
      const api = git?.getAPI?.(1);
      if (!api) return;

      const watchRepository = (repository: any) => {
        const key = repository.rootUri?.toString();
        if (!key) return;

        const readHead = () => repository.state?.HEAD?.commit as string | undefined;
        const initialHead = readHead();
        this.commitHeads.set(key, initialHead);

        const state = repository.state;
        if (state?.onDidChange) {
          this.disposables.push(state.onDidChange(() => {
            const nextHead = readHead();
            const previousHead = this.commitHeads.get(key);
            this.commitHeads.set(key, nextHead);
            if (previousHead && nextHead && previousHead !== nextHead) {
              this.trigger('onCommit');
            }
          }));
        }
      };

      for (const repository of api.repositories ?? []) {
        watchRepository(repository);
      }
      if (api.onDidOpenRepository) {
        this.disposables.push(api.onDidOpenRepository(watchRepository));
      }
    } catch (error) {
      console.warn('[DDLC] Git commit detection unavailable:', error);
    }
  }

  dispose(): void {
    this.disposables.forEach((d) => d.dispose());
    if (this.idleTimer !== undefined) clearTimeout(this.idleTimer);
    if (this.randomTimer !== undefined) clearTimeout(this.randomTimer);
    if (this.timeTimer !== undefined) clearInterval(this.timeTimer);
    if (this.resumeTimer !== undefined) clearTimeout(this.resumeTimer);
    this.knownTerminals.clear();
    this.commitHeads.clear();
  }
}

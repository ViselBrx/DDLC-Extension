import * as vscode from 'vscode';
import type { EventKey } from './dialogueEngine';

export type EventCallback = (event: EventKey) => void;

export class ActionDetector implements vscode.Disposable {
  private disposables: vscode.Disposable[] = [];
  private lastTriggered = 0;
  private readonly cooldownMs: number;
  private idleTimer: ReturnType<typeof setTimeout> | undefined;
  private randomTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly idleTimeoutMs: number;
  private readonly callback: EventCallback;

  constructor(
    callback: EventCallback,
    cooldownMs = 5000,
    idleTimeoutMs = 60_000  // 1 minuto
  ) {
    this.callback = callback;
    this.cooldownMs = cooldownMs;
    this.idleTimeoutMs = idleTimeoutMs;
  }

  /** Call this once inside `activate()` after the webview is ready. */
  register(context: vscode.ExtensionContext): void {
    // ── File save ────────────────────────────────────────────────────────────
    this.disposables.push(
      vscode.workspace.onDidSaveTextDocument(() => this.trigger('onSave'))
    );

    // ── Diagnostics / errors ─────────────────────────────────────────────────
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

    // ── Terminal: aberto ──────────────────────────────────────────────────────
    this.disposables.push(
      vscode.window.onDidOpenTerminal(() => this.trigger('onTerminal'))
    );

    // ── Terminal: comando executado (API 1.93+) ───────────────────────────────
    // onDidEndTerminalShellExecution dispara quando o shell termina um comando
    if ('onDidEndTerminalShellExecution' in vscode.window) {
      this.disposables.push(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (vscode.window as any).onDidEndTerminalShellExecution(() => {
          this.trigger('onTerminal');
        })
      );
    } else if ('onDidWriteTerminalData' in vscode.window) {
      // Fallback: detecta o prompt voltando via saída do terminal
      // Padrões comuns de prompt shell: $, #, >, PS C:\, ❯ (zsh/fish)
      this.disposables.push(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (vscode.window as any).onDidWriteTerminalData((e: { data: string }) => {
          const promptPattern = /[$#>]\s*$|PS\s+\S+[>]\s*$|\u276F\s*$/m;
          if (promptPattern.test(e.data)) {
            this.trigger('onTerminal');
          }
        })
      );
    }

    // ── File / folder creation ────────────────────────────────────────────────
    this.disposables.push(
      vscode.workspace.onDidCreateFiles(() => this.trigger('onFileCreate'))
    );

    // ── File / folder deletion ────────────────────────────────────────────────
    this.disposables.push(
      vscode.workspace.onDidDeleteFiles(() => this.trigger('onFileDelete'))
    );

    // ── Debug session started ─────────────────────────────────────────────────
    this.disposables.push(
      vscode.debug.onDidStartDebugSession(() => this.trigger('onDebug'))
    );

    // ── Activity tracking for idle detection ──────────────────────────────────
    const resetIdle = () => this.resetIdleTimer();
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument(resetIdle),
      vscode.window.onDidChangeActiveTextEditor(resetIdle),
      vscode.workspace.onDidSaveTextDocument(resetIdle),
      vscode.window.onDidOpenTerminal(resetIdle),
      // Mudar de terminal também conta como atividade
      vscode.window.onDidChangeActiveTerminal(resetIdle)
    );

    this.resetIdleTimer();
    this.scheduleRandom();

    context.subscriptions.push(...this.disposables, this);
  }

  /** Fire an event, respecting the cooldown. */
  private trigger(event: EventKey): void {
    const now = Date.now();
    if (now - this.lastTriggered < this.cooldownMs) return;
    this.lastTriggered = now;
    this.callback(event);
  }

  /** Restart the idle countdown every time the user does something. */
  private resetIdleTimer(): void {
    if (this.idleTimer !== undefined) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.callback('onIdle');
      // Re-agenda: enquanto o usuário continuar inativo, dispara de novo
      this.resetIdleTimer();
    }, this.idleTimeoutMs);
  }

  /** Schedule a random dialogue at a random interval between 3 and 7 minutes. */
  private scheduleRandom(): void {
    const minMs = 3 * 60 * 1000;
    const maxMs = 7 * 60 * 1000;
    const delay = minMs + Math.random() * (maxMs - minMs);

    this.randomTimer = setTimeout(() => {
      this.callback('random');
      this.scheduleRandom();
    }, delay);
  }

  dispose(): void {
    this.disposables.forEach((d) => d.dispose());
    if (this.idleTimer !== undefined) clearTimeout(this.idleTimer);
    if (this.randomTimer !== undefined) clearTimeout(this.randomTimer);
  }
}

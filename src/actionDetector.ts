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
    idleTimeoutMs = 90_000
  ) {
    this.callback = callback;
    this.cooldownMs = cooldownMs;
    this.idleTimeoutMs = idleTimeoutMs;
  }

  register(context: vscode.ExtensionContext): void {
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
      vscode.window.onDidOpenTerminal(() => this.trigger('onTerminal'))
    );

    if ('onDidEndTerminalShellExecution' in vscode.window) {
      this.disposables.push(
        (vscode.window as any).onDidEndTerminalShellExecution(() => {
          this.trigger('onTerminal');
        })
      );
    } else if ('onDidWriteTerminalData' in vscode.window) {
      this.disposables.push(
        (vscode.window as any).onDidWriteTerminalData((e: { data: string }) => {
          const promptPattern = /[$#>]\s*$|PS\s+\S+[>]\s*$|\u276F\s*$/m;
          if (promptPattern.test(e.data)) {
            this.trigger('onTerminal');
          }
        })
      );
    }

    this.disposables.push(
      vscode.workspace.onDidCreateFiles(() => this.trigger('onFileCreate'))
    );

    this.disposables.push(
      vscode.workspace.onDidDeleteFiles(() => this.trigger('onFileDelete'))
    );

    this.disposables.push(
      vscode.debug.onDidStartDebugSession(() => this.trigger('onDebug'))
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

    context.subscriptions.push(...this.disposables, this);
  }

  private trigger(event: EventKey): void {
    const now = Date.now();
    if (now - this.lastTriggered < this.cooldownMs) return;
    this.lastTriggered = now;
    this.callback(event);
  }

  private resetIdleTimer(): void {
    if (this.idleTimer !== undefined) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.callback('onIdle');
      this.resetIdleTimer();
    }, this.idleTimeoutMs);
  }

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

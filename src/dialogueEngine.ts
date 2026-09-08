import * as vscode from 'vscode';
import { Buffer } from 'node:buffer';

export type Emotion =
  | 'happy'
  | 'smiling'
  | 'reflective'
  | 'animated'
  | 'thinking'
  | 'surprised'
  | 'excited';

export type EventKey =
  | 'onActivate'
  | 'onSave'
  | 'onError'
  | 'onTerminal'
  | 'onFileCreate'
  | 'onFileDelete'
  | 'onDebug'
  | 'onIdle'
  | 'random';

export interface DialogueChoice {
  text: string;
  response: string;
  emotion: Emotion;
  nextId?: string;
}

export interface DialogueNode {
  id?: string;
  text: string;
  choices: DialogueChoice[];
  emotion?: Emotion;
}

export interface DialogueMap {
  onActivate: string[];
  onSave: string[];
  onError: string[];
  onTerminal: string[];
  onFileCreate: string[];
  onFileDelete: string[];
  onDebug: string[];
  onIdle: string[];
  random: DialogueNode[];
  nodes?: DialogueNode[];
}

export type SpriteManifest = Record<string, Record<string, number[]>>;

export interface UiStrings {
  btnTalk: string;
  btnReply: string;
  loading: string;
  labelHello: string;
  labelSaved: string;
  labelError: string;
  labelTerminal: string;
  labelNewFile: string;
  labelDeleted: string;
  labelDebug: string;
  labelIdle: string;
  labelChat: string;
  history: string;
}

const UI_STRINGS: Record<string, UiStrings> = {
  en: {
    btnTalk: 'Chat...',
    btnReply: 'Reply',
    loading: 'Loading...',
    labelHello: 'Hello!',
    labelSaved: 'Saved',
    labelError: 'Error detected',
    labelTerminal: 'Terminal',
    labelNewFile: 'New file',
    labelDeleted: 'File deleted',
    labelDebug: 'Debugging',
    labelIdle: 'Thinking...',
    labelChat: 'Chat',
    history: 'Recent',
  },
  'pt-br': {
    btnTalk: 'Conversar...',
    btnReply: 'Resposta',
    loading: 'Carregando...',
    labelHello: 'Olá!',
    labelSaved: 'Salvo',
    labelError: 'Erro detectado',
    labelTerminal: 'Terminal',
    labelNewFile: 'Novo arquivo',
    labelDeleted: 'Arquivo deletado',
    labelDebug: 'Depurando',
    labelIdle: 'Pensando...',
    labelChat: 'Conversa',
    history: 'Recentes',
  },
  es: {
    btnTalk: 'Conversar...',
    btnReply: 'Respuesta',
    loading: 'Cargando...',
    labelHello: '¡Hola!',
    labelSaved: 'Guardado',
    labelError: 'Error detectado',
    labelTerminal: 'Terminal',
    labelNewFile: 'Nuevo archivo',
    labelDeleted: 'Archivo eliminado',
    labelDebug: 'Depurando',
    labelIdle: 'Pensando...',
    labelChat: 'Chat',
    history: 'Recientes',
  },
};

export function getUiStrings(lang?: string): UiStrings {
  const l = (lang ?? vscode.workspace.getConfiguration('ddlc').get<string>('language') ?? 'en').toLowerCase();
  return UI_STRINGS[l] ?? UI_STRINGS['en'];
}

const dialogueCache: Map<string, DialogueMap> = new Map();
let manifestCache: SpriteManifest | undefined;

function decodeUtf8(data: Uint8Array): string {
  let text = Buffer.from(data).toString('utf8').replace(/^\uFEFF/, '');

  for (let pass = 0; pass < 2; pass += 1) {
    const before = mojibakeScore(text);
    if (before === 0) break;

    const repaired = Buffer.from(text, 'latin1').toString('utf8');
    if (mojibakeScore(repaired) >= before) break;
    text = repaired;
  }

  return text;
}

function mojibakeScore(text: string): number {
  return (text.match(/(?:Ã.|Â.|â[€šžœ™]|ðŸ|)/g) ?? []).length;
}

export async function loadDialogues(
  doki: string,
  extensionUri: vscode.Uri
): Promise<DialogueMap> {
  const language = (vscode.workspace.getConfiguration('ddlc').get<string>('language') ?? 'en').toLowerCase();
  const cacheKey = `${doki}_${language}`;

  const cached = dialogueCache.get(cacheKey);
  if (cached) return cached;

  const candidates = [
    vscode.Uri.joinPath(extensionUri, 'dialogues', language, `${doki}.json`),
    vscode.Uri.joinPath(extensionUri, 'dialogues', 'en', `${doki}.json`),
    vscode.Uri.joinPath(extensionUri, 'dialogues', `${doki}.json`),
  ];

  for (const uri of candidates) {
    try {
      const raw = await vscode.workspace.fs.readFile(uri);
      const map = JSON.parse(decodeUtf8(raw)) as DialogueMap;
      dialogueCache.set(cacheKey, map);
      return map;
    } catch {
    }
  }

  throw new Error(`[DDLC] No dialogues found for "${doki}". Tried: ${candidates.map(u => u.fsPath).join(', ')}`);
}

export function clearDialogueCache(doki?: string, lang?: string): void {
  if (!doki) {
    dialogueCache.clear();
    return;
  }
  const language = (lang ?? vscode.workspace.getConfiguration('ddlc').get<string>('language') ?? 'en').toLowerCase();
  dialogueCache.delete(`${doki}_${language}`);
}

export async function loadManifest(extensionUri: vscode.Uri): Promise<SpriteManifest> {
  if (manifestCache) return manifestCache;

  const uri = vscode.Uri.joinPath(extensionUri, 'sprites', 'manifest.json');
  const data = await vscode.workspace.fs.readFile(uri);
  manifestCache = JSON.parse(decodeUtf8(data)) as SpriteManifest;
  return manifestCache;
}

export function pickDialogue(
  map: DialogueMap,
  event: Exclude<EventKey, 'random'>
): string {
  const arr = map[event];
  if (!arr || arr.length === 0) return map.onActivate?.[0] ?? '...';
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickRandom(map: DialogueMap): DialogueNode {
  const arr = map.random ?? [];
  if (arr.length === 0) {
    return {
      text: map.onActivate?.[0] ?? '...',
      choices: [],
      emotion: 'thinking',
    };
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getNodeById(map: DialogueMap, id: string): DialogueNode | undefined {
  if (map.nodes) {
    const found = map.nodes.find(n => n.id === id);
    if (found) return found;
  }
  return (map.random ?? []).find(n => n.id === id);
}

export function getSpriteFilename(
  manifest: SpriteManifest,
  doki: string,
  key: string
): string {
  const dokiMap = manifest[doki];
  if (!dokiMap) return `${doki}sprite1`;

  const nums = dokiMap[key];
  if (!nums || nums.length === 0) return `${doki}sprite1`;

  const n = nums[Math.floor(Math.random() * nums.length)];
  return `${doki}sprite${n}`;
}

export function eventToEmotionKey(event: EventKey): string {
  const map: Record<EventKey, string> = {
    onActivate: 'happy',
    onSave: 'smiling',
    onError: 'reflective',
    onTerminal: 'animated',
    onFileCreate: 'animated',
    onFileDelete: 'reflective',
    onDebug: 'surprised',
    onIdle: 'thinking',
    random: 'thinking',
  };
  return map[event] ?? 'happy';
}

export function emotionToManifestKey(emotion: Emotion): string {
  const map: Record<Emotion, string> = {
    happy: 'happy',
    smiling: 'smiling',
    reflective: 'reflective',
    animated: 'animated',
    thinking: 'thinking',
    surprised: 'surprised',
    excited: 'animated',
  };
  return map[emotion] ?? 'happy';
}

export function eventLabel(event: EventKey, ui?: UiStrings): { icon: string; label: string } {
  const s = ui ?? getUiStrings();
  const table: Record<EventKey, { icon: string; label: string }> = {
    onActivate: { icon: 'comment-discussion', label: s.labelHello },
    onSave: { icon: 'save', label: s.labelSaved },
    onError: { icon: 'error', label: s.labelError },
    onTerminal: { icon: 'terminal', label: s.labelTerminal },
    onFileCreate: { icon: 'new-file', label: s.labelNewFile },
    onFileDelete: { icon: 'trash', label: s.labelDeleted },
    onDebug: { icon: 'debug-alt', label: s.labelDebug },
    onIdle: { icon: 'watch', label: s.labelIdle },
    random: { icon: 'comment', label: s.labelChat },
  };
  return table[event] ?? { icon: 'comment', label: '' };
}

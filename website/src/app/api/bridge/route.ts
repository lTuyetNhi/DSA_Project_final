import { NextRequest, NextResponse } from 'next/server';
import { spawn, type ChildProcessWithoutNullStreams } from 'child_process';
import readline from 'readline';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';

type PendingRequest = {
  resolve: (payload: unknown) => void;
  reject: (error: Error) => void;
};

let bridgeServer: ChildProcessWithoutNullStreams | null = null;
let bridgeKey = '';
let pending: PendingRequest[] = [];

function stopBridge(error: Error) {
  for (const request of pending) request.reject(error);
  pending = [];
  bridgeServer = null;
  bridgeKey = '';
}

function getBridgeServer(bridgeExe: string, projectRoot: string) {
  const key = `${bridgeExe}|${projectRoot}`;
  if (bridgeServer && !bridgeServer.killed && bridgeKey === key) return bridgeServer;

  if (bridgeServer) bridgeServer.kill();
  const child = spawn(bridgeExe, ['--server'], {
    cwd: projectRoot,
    windowsHide: true,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  bridgeServer = child;
  bridgeKey = key;

  const lines = readline.createInterface({ input: child.stdout });
  lines.on('line', (line) => {
    const request = pending.shift();
    if (!request) return;
    try {
      request.resolve(JSON.parse(line));
    } catch {
      request.reject(new Error('Bridge returned invalid JSON'));
    }
  });
  child.on('error', (error) => stopBridge(error));
  child.on('exit', () => stopBridge(new Error('C++ bridge server stopped')));
  return child;
}

function queryBridge(bridgeExe: string, projectRoot: string, fields: string[]) {
  const child = getBridgeServer(bridgeExe, projectRoot);
  return new Promise<unknown>((resolve, reject) => {
    pending.push({ resolve, reject });
    child.stdin.write(`${fields.join('\t')}\n`, (error) => {
      if (error) {
        const request = pending.pop();
        request?.reject(error);
      }
    });
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('mode') || 'data';
  const id = searchParams.get('id') || 'B001';
  const category = searchParams.get('category') || 'Software Engineering';
  const date = searchParams.get('date') || '2026-10-02';
  const keyword = searchParams.get('keyword') || 'Code';
  const size = searchParams.get('size') || '10';
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('page_size') || '25';

  // Next can be started from either the repository root or website/. Resolve
  // several stable candidates instead of assuming one current working dir.
  const projectRoots = [
    process.cwd(),
    path.resolve(process.cwd(), '..'),
    path.resolve(process.cwd(), '../..'),
  ];
  const bridgeRoot = projectRoots.find((root) =>
    fs.existsSync(path.join(root, 'tools', 'dsa_web_bridge.exe'))
  );
  const projectRoot = bridgeRoot || projectRoots[0];
  const bridgeExe = path.join(projectRoot, 'tools', 'dsa_web_bridge.exe');

  if (!bridgeRoot) {
    return NextResponse.json(
      {
        status: 'error',
        message: `Executable not found. Checked: ${projectRoots.map((root) => path.join(root, 'tools', 'dsa_web_bridge.exe')).join('; ')}`,
      },
      { status: 500 }
    );
  }

  try {
    // The last field requests metrics-only responses for module executions.
    // Data stays in the persistent C++ RAM cache; large book/record arrays are
    // not serialized back through Node or rendered by React.
    const payload = await queryBridge(bridgeExe, projectRoot, [
      mode, size, id, category, date, keyword, page, pageSize,
      mode === 'data' ? '0' : '1',
    ]);
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Bridge request failed' },
      { status: 500 }
    );
  }
}

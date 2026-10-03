import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('mode') || 'data';
  const id = searchParams.get('id') || 'B001';
  const category = searchParams.get('category') || 'Software Engineering';
  const date = searchParams.get('date') || '2026-10-02';
  const keyword = searchParams.get('keyword') || 'Code';
  const top = searchParams.get('top') || '3';
  const size = searchParams.get('size') || '10000';

  // Determine root path and bridge exe path
  let projectRoot = path.resolve(process.cwd(), '..');
  let bridgeExe = path.join(projectRoot, 'tools', 'dsa_web_bridge.exe');

  if (!fs.existsSync(bridgeExe)) {
    // If running with cwd as root
    projectRoot = process.cwd();
    bridgeExe = path.join(projectRoot, 'tools', 'dsa_web_bridge.exe');
  }

  if (!fs.existsSync(bridgeExe)) {
    return NextResponse.json(
      {
        status: 'error',
        message: `Executable not found at ${bridgeExe}. Please ensure tools/dsa_web_bridge.exe is compiled.`,
      },
      { status: 500 }
    );
  }

  const args: string[] = ['--mode', mode];

  if (mode === 'mc1') {
    args.push('--id', id);
  } else if (mode === 'mc2') {
    args.push('--top', top);
  } else if (mode === 'rq1') {
    args.push('--category', category);
  } else if (mode === 'rq2') {
    args.push('--date', date);
  } else if (mode === 'rq3') {
    args.push('--keyword', keyword);
  } else if (mode === 'benchmark') {
    args.push('--size', size);
  }

  return new Promise<NextResponse>((resolve) => {
    execFile(
      bridgeExe,
      args,
      { cwd: projectRoot, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          console.error('Bridge error:', error, stderr);
          return resolve(
            NextResponse.json(
              {
                status: 'error',
                message: error.message,
                stderr: stderr,
              },
              { status: 500 }
            )
          );
        }

        try {
          const parsed = JSON.parse(stdout.trim());
          return resolve(NextResponse.json(parsed));
        } catch (parseError) {
          console.error('JSON parse error:', parseError, stdout);
          return resolve(
            NextResponse.json(
              {
                status: 'error',
                message: 'Failed to parse JSON response from C++ bridge',
                rawOutput: stdout,
              },
              { status: 500 }
            )
          );
        }
      }
    );
  });
}

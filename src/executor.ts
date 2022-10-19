import { CommonOptions, execa } from 'execa';
import { Command } from "./command";
import * as stream from "stream";

interface ExecuteOptions {
    shell?: boolean;
    stdout?: CommonOptions<any>["stdout"];
    cwd?: string;
}

export async function executeAll(command: Command, options: ExecuteOptions = defaultOptions()): Promise<any> {
    for(const cmd of command) {
        console.log(`Executing: ${cmd}`);
        const result = execa(cmd, options);
        result.stdout?.on("data", data => console.log("X: " + data.toString()));
        await result;
    }
}

export async function executeToStdin(program: string, command: Command, options: ExecuteOptions = defaultOptions()): Promise<any> {
    const result = execa(program, { ...options, stdin: "pipe" });
    // result.stdout?.on("data", data => console.log("X: " + data.toString()));

    const readable = stream.Readable.from(result.stdout!);
    readable.on("data", data => console.log("Y: " + data.toString()));
    // readable.pipe(process.stdout);

    const w = result.stdin!;

    for(const cmd of command) {
        console.log({
            killed: result.killed,
            connected: result.connected,
        });

        console.log(`Executing: ${cmd}`);
        w.write(cmd);

        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    await result;
}

const defaultOptions = (): ExecuteOptions => ({
    shell: true,
    stdout: "pipe",
});

import { cmd, Command } from '../command';
import { callback, floatRange, fromParams, intRange, list, priority } from '../params';
import { executeAll } from "../executor";

const run = async () => {
    showCommand(cmd`Hello ${list("world", "stranger", "there")}! How old are you? I'm ${intRange(30, 50)}!`, [35, 45]);
    showCommand(cmd`Custom ${["priority", "weight"]}, first this num [${priority(5, intRange(1, 3))}], then that one [${priority(3, floatRange(0, 1, 0.25))}]`, [9, 20]);
    showCommand(cmd`Callback test - number array: ${callback(() => [list<any>(1, 2, 3), list<any>(10, list(666, 777), 30)])}`);
    showCommand(cmd`Callback test - current date: ${callback(() => new Date().toLocaleString())}, number array: ${callback(() => list(1, 2, 3))}`);
    showCommand(cmd`Here are some params ${["a", "b", "c"]}=${intRange(1, 3)}, they can be reused later: [${fromParams(([a, b]) => `1st=${a}, 2nd=${b}`)}] :)`);
    showCommand(cmd`no ${intRange(1, 10)}/10, ${fromParams(([id]) => id === "7" ? cmd`Number 7 is ${["cool", "amazing", "awesome"]} 😎` : "")}`);

    // Example with execution - I will create a few directories!
    {
        const dirId = fromParams(([id]) => id);
        const myCmd = cmd`mkdir -p './out/dir_${intRange(1, 10)}' && echo '${priority(-5, list("Hello", "Hi"))} dir ${dirId}!' > './out/dir_${dirId}/readme.txt'`;
        showCommand(myCmd);
        await execCmd(myCmd);
    }
};

let i = 1
const showCommand = (cmd: Command, slice?: [number, number]) => {
    console.log(`Example ${i++}`);
    console.log(cmd.toString());
    console.log(`Random example: ${cmd.getExample(true)}`);
    console.log(cmd.getVariations().slice(slice?.[0], slice?.[1]));
    console.log("\n");
};

const execCmd = async (cmd: Command) => await executeAll(cmd, { shell: true })

run()
    .then(() => console.log('Done!'))
    .catch(err => console.error(err));


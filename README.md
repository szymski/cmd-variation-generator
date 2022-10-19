cmd-variation-generator
=======================

Text sequence generator based on templates with configurable inputs. \
It's primary goal is to enable quick and easy generation and execution of valid shell commands.

You can kind of think of it as a bruteforcer or dictionary generator, but generating boring command prompts (and making it fun!) is its primary goal.

-------------------------

**Why would you need that at all?** \
I like making my life easier, maybe I'm lazy, idk.
With this thing, i'll certainly work on AI research more efficiently :)

Say you're trying to tune hyperparameters of a new AI model you just pulled from GitHub. You're not willing to edit its code just for that.
Hopefully most projects support CLI arguments for setting these parameters up. \
This project should make it easier to experiment with different hyperparameters and see what works best for you.

**Is it ready for actual use?** \
It's still **very very WIP**. You can experiment with it for your own educational purposes, but it's far from production ready (and might never be any close).

### Show me examples!

#### Example 1 - basics
```typescript
const myCmd = cmd`echo ${["Hello", "Hi", "Good to see you"]} ${["world", "there"]}!`;

console.log(myCmd.toString());
// Command: echo #1{List("Hello","Hi","Good to see you")} #0{List("world","there")}!

// Generate all possible variations based on input params:
const all = myCmd.getVariations();
all = [
    'echo Hello world!',
    'echo Hello there!',
    'echo Hi world!',
    'echo Hi there!',
    'echo Good to see you world!',
    'echo Good to see you there!'
];

```

#### Example 2 - actual command line, referring to existing variables

```typescript
const myCmd = cmd`mkdir -p ./dirs/${intRange(1, 10)} && touch ./dirs/${fromParams(([id]) => id)}/${list<any>("foo", "bar", 1337)}.txt`;

console.log(myCmd.toString());
// Command: mkdir -p ./dirs/#2{IntRange(1-10)} && touch ./dirs/#0{FromParams(([id]) => id)}/#1{List("foo","bar",1337)}.txt

// Generate all possible variations based on input params:
const all = myCmd.getVariations();
all = [
    'mkdir -p ./dirs/1 && touch ./dirs/1/foo.txt',
    'mkdir -p ./dirs/1 && touch ./dirs/1/bar.txt',
    'mkdir -p ./dirs/1 && touch ./dirs/1/1337.txt',
    'mkdir -p ./dirs/2 && touch ./dirs/2/foo.txt',
    'mkdir -p ./dirs/2 && touch ./dirs/2/bar.txt',
    'mkdir -p ./dirs/2 && touch ./dirs/2/1337.txt',
    'mkdir -p ./dirs/3 && touch ./dirs/3/foo.txt',
    'mkdir -p ./dirs/3 && touch ./dirs/3/bar.txt',
    'mkdir -p ./dirs/3 && touch ./dirs/3/1337.txt',
    'mkdir -p ./dirs/4 && touch ./dirs/4/foo.txt',
    'mkdir -p ./dirs/4 && touch ./dirs/4/bar.txt',
    'mkdir -p ./dirs/4 && touch ./dirs/4/1337.txt',
    'mkdir -p ./dirs/5 && touch ./dirs/5/foo.txt',
    // and so on...
];

// Now execute it!
await executeAll(myCmd, { shell: true })
// And now you should see 10 directories created with 3 files in each of them, cool, innit?

```

#### Example 3 - nested commands

```typescript
const otherCmd = cmd`XD[${floatRange(0, 1, 0.1)}]DX`;
const myCmd = cmd`${intRange(1, 10)}/10 and ${list<any>("feel good", otherCmd)}`;

// You can cheaply check how many variations will be generated
console.log("Total variation count: " + myCmd.variationCount);
// Generating variations... Expected count is: 120

console.log(myCmd.toString());
// Command: #1{IntRange(1-10)}/10 and #0{List("feel good",Command(Command: XD[#0{FloatRange(0-1, step=0.1)}]DX))}

const all = myCmd.getVariations();
all = [
    '1/10 and feel good',
    '1/10 and XD[0]DX',
    '1/10 and XD[0.1]DX',
    '1/10 and XD[0.2]DX',
    '1/10 and XD[0.30000000000000004]DX',
    '1/10 and XD[0.4]DX',
    '1/10 and XD[0.5]DX',
    '1/10 and XD[0.6000000000000001]DX',
    '1/10 and XD[0.7000000000000001]DX',
    '1/10 and XD[0.8]DX',
    '1/10 and XD[0.9]DX',
    '1/10 and XD[1]DX',
    '2/10 and feel good',
    '2/10 and XD[0]DX',
    '2/10 and XD[0.1]DX',
    '2/10 and XD[0.2]DX',
    // and so on...
];
```

## For now
That would be it... \
More features might be coming, but they might not be coming as well. Time will tell.

**My current priorities are:** 
* Implement more param types (oneOf, runtimeCallback, etc.)
* Improve readability of larger commands
* Allow to define variables which can be reused in multiple places
* Refactor variation generator
* CLI and simple API, it's unusable right now without cloning, lol
* Publish as npm package, lol

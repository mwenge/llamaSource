# Gridrunner: The Little Black Book
<img src="https://www.mobygames.com/images/covers/l/34991-gridrunner-commodore-64-front-cover.jpg" height=300>


<!-- vim-markdown-toc GFM -->

* [Introduction](#introduction)
* [Getting Started](#getting-started)
  * [Memory](#memory)
  * [Kilobytes](#kilobytes)
  * [Hexadecimal Notation](#hexadecimal-notation)
  * [Addressing Memory](#addressing-memory)
  * [How a Game is Loaded](#how-a-game-is-loaded)
  * [Reading and Comparing Values](#reading-and-comparing-values)
  * [Loops](#loops)
  * [Sub-Routines and Early Returns](#sub-routines-and-early-returns)
* [Gridrunner on the Vic 20](#gridrunner-on-the-vic-20)
  * [Character Sets in the Vic 20 and C64](#character-sets-in-the-vic-20-and-c64)
  * [Address Pointers](#address-pointers)
  * [The Title Screen](#the-title-screen)
  * [Drawing the Grid](#drawing-the-grid)
  * [Creating The Levels](#creating-the-levels)
  * [Managing the Droids](#managing-the-droids)
  * [Managing Speed](#managing-speed)
  * [Some Early Anti-Patterns](#some-early-anti-patterns)
  * [Sound Effects](#sound-effects)
* [Porting Gridrunner to the C64](#porting-gridrunner-to-the-c64)
  * [Improving Code Style](#improving-code-style)
  * [Changes in Gameplay](#changes-in-gameplay)
  * [New Effects](#new-effects)
* [Matrix: Gridrunner 2](#matrix-gridrunner-2)
  * [Improving Code Style](#improving-code-style-1)
  * [Changes in Gameplay](#changes-in-gameplay-1)
* [Porting Matrix to the C64](#porting-matrix-to-the-c64)
  * [Improving Code Style](#improving-code-style-2)
  * [Changes in Gameplay](#changes-in-gameplay-2)
* [Voidrunner](#voidrunner)
  * [Coding for the C16](#coding-for-the-c16)
  * [Colors, effects](#colors-effects)
* [Gridrunner: Afterlife](#gridrunner-afterlife)
  * [Gridrunner Revolution](#gridrunner-revolution)
  * [Gridrunner++](#gridrunner)
* [Appendix: Reconstructing the Source Code](#appendix-reconstructing-the-source-code)

<!-- vim-markdown-toc -->
## Introduction
<img src="https://user-images.githubusercontent.com/58846/103443482-9fb16180-4c57-11eb-9403-4968bd16287f.gif" height=300>
Gridrunner was written at a feverish pace. In the autumn of 1982, Jeff Minter was twenty years
old. With just a couple of very rudimentary games from the Commodore Pet and Vic 20
under his belt he designed and programmed Gridrunner on a Vic 20 machine in under two weeks.
This was short work but led to a decades-long series of games developed by Minter based
on the original concept. 

This book is for the reader who is curious to understand how games of the 8-bit era
worked under the hood, what was involved in programming them and getting them to work,
and how the programming style of someone like Minter developed over time. Gridrunner,
like all Llamasoft games, is most notable for its speed and addictive gameplay. How 
did Minter manage this on the limited hardware of the 1980s where so many others
fell short? 

## Getting Started

The two machines Minter developed games for were the Vic 20 and the Commodore
64.  The Vic 20 was a computer with 5 kilobytes of memory. The Commodore 64 had
64 kilobytes. Let's unpack the two most important terms in this statement:
memory and kilobytes.

### Memory
There are lots of different ways of visualizing a computer's memory,
but the original and the best is to think of it as a long tape. The tape is
broken up into lots of equally sized boxes, for example by drawing lines across
the tape at equally spaced intervals. Each of these segments or boxes can now
be thought of as a slot, or address, in the memory represented by the tape. As
we will see later the Commodore 64 uses this tape by reading values from the
boxes and writing values to them. It can also switch from any arbitrary
box in the tape to another - it doesn't have to read the tape
sequentially, it can skip back and forth along the tape reading from any of the
boxes it chooses in any order it pleases.  Another way of saying this is that
it can access the memory randomly. This allows us to call the tape Random
Access Memory, or RAM.


### Kilobytes 
The important thing to note about our imaginary tape is that each box in the tape can only store a
single value, a byte.  A byte is one of the segments or boxes on our tape and a
kilobyte is 1024 such bytes. So when we say the Commodore 64 has 64 kilobytes
of memory we are also saying it has 65,536 (1024 * 64) bytes: 65,536 segments
or boxes on its tape. The byte isn't the lowest we can go however. A byte
itself consist of 8 bits. A bit is a zero or a one. This becomes important when
we want to write a byte to a segment on the tape as we now have to decide the
best way of representing these byte values when writing computer code.

![image](https://user-images.githubusercontent.com/58846/110908422-b387dc80-8306-11eb-88b3-a93a78883bfc.png)



```
The Commodore 64 is often referred to as an '8-bit' computer. This is because
each of its boxes or segments in memory can only contain 1 byte (or 8 bits) as
described above. Computers that can store two bytes in one of the boxes or
segments in their 'memory tape' are called 16-bit computers.  Those that can
store 4 bytes are 32-bit. Those can store 8 bytes are 64 bit.
```

### Hexadecimal Notation
What is the best way of representing bytes when writing them down and thinking
about them?  Hexadecimal notation is the time-honored answer to this question.
Since a byte consist of 8 bits, each of which can be 0 or 1, that means a byte
can be one of 256 values, or in other words a number between 0 and 255. When we
store a byte in one of the segments on the tape we are in fact storing a number
between 0 and 255 (giving 256 possible values including the zero).  Hexadecimal
is a very convenient way of representing numbers between 0 and 255 because it
allows us to write the number as a two-character value where the first
character represents the left half of the byte (i.e. the first 4 bits) and the
second character represents the right half of the byte (i.e. the last 4 bits).

Since a string of 4 bits can give us between 0 and 15 possible values, that
means the numbers from 0 to 9 aren't enough to represent each of the 16 values
in a single character. To deal with this we also use A to F. So if the number
is 9 we use a 9, but if it's 10 we use an A. If it's 15 we use an F and so on.


0|1|2|3|4|5|6|7|8|9|A|B|C|D|E|F|
---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|

Now since there are sixteen possible combinations of 4 zeros and ones, we need
a convention for deciding which combination represents which number.

The way this is done by assigning a value to each of the 4 bits from left to
right and adding them up as follows:

8 |4 |2 |1 | Decimal | Hex
| --- | --- | --- | --- | --- | --- |
0 |1 |0 |1 |4 + 1= 5 |= 5
0 |0 |0 |1 |1 = 1 |= 1
1 |0 |1 |0 |8 + 2 = 10  |= A
1 |1 |1 |1 |8 + 4 + 2 + 1= 15  |= F

Next, by splitting the byte into a pair of 4 bits we can construct each
character in the hexadecimal representation of the byte as in the following
examples:

Hex| Left 4 bits |Right 4 bits
| --- | --- | --- |
$00 |0000  |0000
$01 |0000  |0001
$08 |0000  |1000
$88 |1000  |1000
$FF |1111  |1111

```
Putting a $ sign in front of a hexadecimal value is a common
convention to indicate to the reader that something is a hexadecimal number
rather than a decimal one, it's also the convention used for writing
hexadecimal numbers in Commodore 64 assembly language, which we'll be seeing a
lot of!
```
I haven't given the decimal value of the examples above, because we have one
final step to do first: which is decide what value we assign each bit when
there are 8 of them in a row, rather than just 4. The answer is as follows:

Bit 7 |Bit 6 |Bit 5 |Bit 4 |Bit 3 |Bit 2  |Bit 1  |Bit 0
| --- | --- | --- | --- | --- | --- | --- | --- |
128 |64  |32  |16  |8 |4 |2 |1

So now we can give some full byte values:

Hex|Left 4 bits |Right 4 bits  |Decimal
| --- | --- | --- | --- |
$00 |0000  |0000  |0
$01 |0000  |0001  |1
$08 |0000  |1000  |8
$88 |1000  |1000  |136
$FF |1111  |1111  |255

Unfortunately there really isn't any good trick for converting a hexadecimal
value such as $32 into its decimal equivalent in your head, other than to use
old-fashioned multiplication: multiply 3 by 16, then add 2, giving 50.

### Addressing Memory
Now that we have a notation for defining the values (i.e. the numbers) that we
store in each of the boxes in our memory tape, we need to decide if we should
use the same notation for naming each of the boxes in the tape. The simplest
way of naming the boxes is to give each a number as its address and to start at
0 and end at 65,536.  This is indeed what we do. And now that we have
hexadecimal notation we might as well use that instead of decimal numbers.  We
write the range 0 to 65,356 in hexadecimal as `$0000` to `$FFFF`. The pleasing
symmetry of this hexadecimal representation is not an accident. The 64
kilobytes of memory in the Commodore 64 is the limit of what can be addressed
by a two byte value between `$0000` and `$FFFF` inclusive.


### How a Game is Loaded
Loading a game, or any program, on the C64 is a simple question of copying a
long sequence of bytes into its memory, pointing the C64 at the position in
memory to start executing and letting it take it from there. In the case of the
C64 and the Vic 20 this string of bytes is a `prg` file. This file could be on
a cassette tape, a disc, or when we load a game in a Vice emulator on our PCs
today a literal `prg`' file such as `gridrunner.prg` on our PC's disk.

The `prg` file is quite literally a sequence or 'string' of bytes to be copied
directly into the C64's memory and nothing else. Only the first two bytes in
this string have a special meaning: they are the address in the C64's memory
where the rest of the bytes should be copied. Let's look at the first twenty
bytes of the 'gridrunner.prg` file distributed by Minter in 2019 when he
released his Llamasoft C64 and Vic 20 games into the public domain:

```
01 08 0B 08 0A 00 9E 32 30 36 31 00 00 00 A0 00 A9 09 85 FD A9 80 ................
```

The first two bytes are `$0108`. So if these two represent the address the rest
should be copied to, then the C64 must copy everything from `0B 08 0A` onwards to
address `$0108` onwards right?

Wrong! :) When reading addresses from memory, the designers of the CPU the C64
uses had a decision to make: do you read `0108` as `$0108`, which common sense
would suggest, or do you read it as `$0801`, reversing the order of the bytes
to get the address required? Why is this even a question? And why did the
designers choose the latter option, which is to read `0108` as `$0801` and
treat that as the address to which the rest of the bytes in the `prg` file are
copied?

The answer is that it suited the design of the processor and was largely
arbitrary. Reading sequences of bytes this way became known as 'little-endian',
whereas reading `0108` from `$0108` is known as 'big-endian'.

So when the C64 reads the first two bytes of `gridrunner.prg` it copies the
following series of bytes to position `$0801` onwards in its memory:


```
Address:         $0802 $0804
                 |     |
Bytes:        0B 08 0A 00 9E 32 30 36 31 00 00 00 A0 00 A9 09 85 FD A9 80 ................
              |     |     |
Address:      $0801 $0803 $0805
```

Once it has completed copying the data into memory. The next step is to start
executing it. It starts executing the data from the position to which it was
copied: in this case `$0801`. So this leads to the question, how does it
interpret the data there? Here is how this string of bytes would be represented
in the source code for a C64 program (every line starting with a `;` is a
comment):


```asm
;-----------------------------------------------------------------------------------------------------
; SYS 2061 (PrepareGame)
; This launches the program from address $080d, i.e. PrepareGame.
;-----------------------------------------------------------------------------------------------------
; $9E = SYS
; $32,$30,$36,$31,$00,$00 = 2061 ($080D in hex)
p0800   .BYTE $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00
```

So you can see the first 4 bytes are skipped, and the first instruction
encountered is $9E, which stands for the `SYS` command. This command tells the
CPU to start executing the machine language program at at the address specified
in the bytes that follow. In this case the bytes that follow are `$32 $30 $36
$31`, which is the PETSCII representation of the number 2061: $32 represents
the number 2, $30 represents the number 0, and so on. 2061 in hexadecimal is
`$080D`, so the CPU jumps to address `$080D` and starts executing whatever is
there.

Now we are at the point where have to understand one final thing about the
contents of the `gridrunner.prg` file before we can start looking at it in more
detail.

What do the rest of the bytes (from `$080D` onwards) in the file mean and how
do they result in a game starting up?


```
Address:         $080E $0810
                 /     /
Bytes:        A0 00 A9 09 85 FD A9 80 ................
              \     \     \
Address:      $080D $080F $0811
```

The answer is that this raw string of bytes is 'machine code' and it is simply
the machine-readable translation of a slightly more verbose language used by
people to write programs in the first place. Each byte in this string
represents an instruction or a value in the 'assembly language' used by Minter
to write Gridrunner. There were many flavours of assembly language even in 1982
and this one was specific to the 6502 microprocessor used by the C64. Below we
list the first six bytes of the program on the left with their assembly
language translation on the right. You can see for example that the byte `$A0`
translates to the mysterious word `LDY` and the byte '$A9' in the line below it
translates to the equally mysterious word `LDA`.

```asm
$080D: A0 00               LDY #$00
$080F: A9 09               LDA #$09
$0811: 85 FD               STA $FD
```
The task of converting a program written in these mysterious words to the raw
string of machine-code bytes is performed by program called an assembler. The
equivalent task for modern languages such as C, C++, and Python is performed by
a program called a compiler. As you can see from even the bried example above,
writing a program in assembly language is as close as it is possible to get to
writing out a series of bytes without actually doing so. The task of an
assembler is almost as simple as mapping a dictionary of names (such as `STA`)
to byte values (such as `$85`) and outputting the result. This is a far cry
from modern, verbose programming languages where a lot more translation is
required to turn the program into something that is still not a million miles
away from the kind of machine code instructions used by the C64.

Before we start looking at the code of Gridrunner and how it was written more
closely it will be useful for you to understand a few of the basic patterns
involved in writing programs in assembly language. This will hopefully make the
code examples more accessible to you, but if you're impatient you should feel
free to skip ahead and return here in the hope of explanation if some of the
language usage gets confusing.

### Reading and Comparing Values
Writing programs in assembly language forced Minter and other programmers to
specify everything in exact detail. This can make even the simplest operations
appear cumbersome at first. The most basic operation I can think of to start
with is reading a value from memory and then comparing it some other value. In
a modern language such as C or Javascript this would look something like:

```c
  if (selectedLevel != 32) {
    // selectedLevel not equal to $20 (32 in decimal)
    print(selectedLevel);
  }
  // Do More Stuff
```
In Gridrunner Minter achieves the equivalent effect using the following assembly code:
```asm
selectedLevel = $0035
;-------------------------------------------------------------------------
; IncrementSelectedLevel
;-------------------------------------------------------------------------
IncrementSelectedLevel
        LDA selectedLevel ; Load the value in selectedLevel to the A register
        CMP #$20          ; Compare it to the value $20
        BNE b80AA         ; If it's not equal to $20 go to b80AA
        ; selectedLevel == $20 (32 in decimal)
        LDA #$01
        STA selectedLevel
        
b80AA  ; Do More Stuff
        LDA #$30
```

You can probably see immediately there's more to digest here. In order to
read the value stored at address `$0035` (which we've nickname `selectedLevel` in
our code) we first have to load it into a temporary storage location belonging
to the CPU called the Accumulator (`A` register for short). This is what `LDA
selectedLevel` does: it loads the value at address `$0035` in the `A` register.
Once it has done that we can now compare it to a value. `CMP` compares whatever
value we retrieved from `$0035` with the value $20 and stores the result in a
place we don't have to worry about for now. `BNE` says that if the comparison
is false, i.e.  the values are not equal, execution should jump to the address
nickname `b80AA`, which happens to be `$80AA`, and which we can see is in the
second last line of our listing above. This means that it will skip the two
lines appearing after `BNE b80AA` and not execute them. On the other hand, if
the comparison is true it will continue on and execute those two lines. What
those two lines do is store the value $01 in address `$0035` (`selectedLevel`).
Or in other words, reset the value of the currently selected level to '1'.

```
We could probably come up with a better nickname for the loop label than `b80AA`,
something like `LevelLessThan32` for example. Unfortunately we would need to make
these label names unique throughout the entire program and doing that quickly
results in ridiculously verbose names such as 'IncrementSelectedLevel_Loop2'.
So for the sake of brevity, I've kept the more compact label names for local
loops such as this one. Where the code jumps or loops across a lot of code, for
example over more than a screen height of code, explicit names are useful and
I've adopted them in such cases.
```

If you are familiar with Gridrunner you may now have begun to recognize that
this segment of code is from the title screen of the game, where the user can
select the level to start on. If you attempt to select a level above 32 it
cycles back to level 1: you can only choose a level between 1 and 32.

![gridrunner-level](https://user-images.githubusercontent.com/58846/110531048-013bf380-8113-11eb-9f3a-3f3288446f58.gif)

### Loops

Since assembly supports, even encourages, jumping around our imaginary tape
to execute code, writing a tight loop is relatively concise. In this example
from the `IncrementSelectedLevel` routine we looked at above we run through
a loop 48 times ($30 in hex is 48) calling the sub-routine WasteSomeCycles
each time. Every time we cycle through the loop we decrement the value in `X`
by 1, and as long as it is still not zero we loop again (`BNE b80C8`). Eventually
after 48 loops `X` is down to zero and we stop looping.

```asm
        LDX #$30
b80CB   JSR WasteSomeCycles ; Call function (or sub-routine) WasteSomeCycles
        DEX 
        BNE b80CB
```

We've already seen the use of `A` as temporary location for storing values, `X' used
in `LDX $30` is just another temporary location we can use. So in the same way we
load a value to `A` with `LDA`, we can load a value to `X` with `LDX`. There's just
one more temporary location available which we haven't covered yet.. you guessed it
`Y`, for which we use `LDY`.

A slightly more complex example of a loop is also available in the `IncrementSelectedLevel`
routine. This one increments the level displayed to the player when they push up on the 
joystick. Because it has to work out when we've reached 9 and so needs to display 10 and 
restart the right-most digit at 0 it has to do a bit more work. This exposes a few more 
features in assembly, and in the C64 and VIC20, internals that will be useful to us later.

```asm
b80AA   LDA #$30
        STA SCREEN_RAM + $0157
        STA SCREEN_RAM + $0158

        LDX selectedLevel
b80B4   INC SCREEN_RAM + $0158
        LDA SCREEN_RAM + $0158
        CMP #$3A
        BNE b80C6
        LDA #$30
        STA SCREEN_RAM + $0158
        INC SCREEN_RAM + $0157
b80C6   DEX 
        BNE b80B4
```

At the very start of the above snippet we write `$30` to two locations in RAM,
`SCREEN_RAM + $0157` and `SCREEN_RAM + $0158i`. These are the characters that
are displayed on row 8, columns 39 and 40,  that live at address $0557 and $0558
in RAM. (SCREEN_RAM is a nickname for address `$0400` where the screen
characters start, adding $157 brings us row 8 and column 39). Since `$30` is 
the ASCII value for '0' (zero) this means it is writing `00` next to the 'ENTER
LEVEL' text on the screen.

![gridrunner-level](https://user-images.githubusercontent.com/58846/110531048-013bf380-8113-11eb-9f3a-3f3288446f58.gif)

Now that we've initialized that field with two zeroes, we want to replace it
with the value of `selectedLevel`. Let's say the value of selected level is
`$0C`, i.e. 12.  Minter uses the loop that follows to achieve this.

In the loop we see the same pattern as before, `X` is used to track the number
of iterations through the loop. If the user has selected level 12, we're going
to iterate through the loop 12 times.  Every time we iterate we're going to
increment the right-most digit in the displayed level. That's what `INC
SCREEN_RAM + $0158` achieves.

After incrementing that number we check if it is now equal $3A, if it is then
it means we are already showing `$39`, i.e. the ascii value for '9'. So we need
to reset it to zero and increment the left-hand digit (`SCREEN_RAM + $0157`)
instead:

```asm
        CMP #$3A
        BNE b80C6 ; If it's not equal to $3A, then jump to b80C6 and continue looping.
        ; Reset the right-hand digit to zero
        LDA #$30
        STA SCREEN_RAM + $0158
        ; Increment the left-hand digit instead
        INC SCREEN_RAM + $0157
b80C6   DEX 
```

This loop continues until decrementing the value in `X` reaches zero.

### Sub-Routines and Early Returns
Assembly-language does allow the programmer to write what today we would call
functions but in the 1980s Minter would have referred to as 'routines' or
'sub-routines'. These are independent, re-usable chunks of assembly-language
code that can be called from other places in the program by using the `JSR`
instruction. The routine we've just been examining in detail,
`IncrementSelectedLevel`, is one such example of a sub-routine. A routine
'returns' back to its caller by using the instruction `RTS`. Typically, this is
when the routine is complete and will always be found at least once in a
sub-routine, at the very end.

A good example of the usefulness of sub-routines can be seen in the main game
loop of Gridrunner. This is a tight sequence of complex tasks that must be
repeated ad-infinitum while the game is running. Each routine encapsulates a
set of related and sometimes complex tasks while keeping the order in which
they are performed intelligible. 

```asm
MainLoop
        JSR DrawBullet
        JSR UpdateZappersPosition
        JSR DrawLaser
        JSR UpdatePods
        JSR DrawUpdatedPods
        JSR PlayBackgroundSounds
        JSR DrawDroids
        JSR ResetAnimationFrameRate
        JSR CheckLevelComplete
        JMP ReenterMainGameLoop
```

I want to look at two final features of sub-routines before we move on from
them. In `CheckLevelComplete`, the second last routine called in the main
game loop, we see two common techniques: one that is clear and useful and
another that might at first be confusing.

The clear and useful feature is what's called an 'early return'. The routine
checks the value of  `droidsLeftToKill` and if it is not equal to zero, i.e. there
are no droids left, it returns early, i.e. executed an `RTS` instruction and
returns to the main game loop. 

On the other hand if `droidsLeftToKill` *is* equal to zero (`BEQ b8ACD`) execution
branches to the code at `b8ACD`. There it checks the number of droid squads
left in the level (`noOfDroidSquadsCurrentLevel`) and if that is not equal to
zero (`BNE b8ACC`) it jumps to `b8ACC` and again returns early to the main
game loop.

It is only if there are no droids left to kill and no droid sqauds left at all,
so the player has in fact completed the level,
that execution reaches `JMP DisplayNewLevelInterstitial`. This is the routine
that flashes up the 'ENTER LEVEL' screen and begins a new level.

The merits of this 'early return' pattern are hopefully obvious, but you might
wonder what has happened to the `RTS` instruction that should be at the end
of the `CheckLevelComplete` routine? What we have instead is a `JMP` instruction
that jumps execution to `DisplayNewLevelInterstitial`.

This is the slightly confusing feature of assembly language. It doesn't actually
mind if the programmer ever returns from a routine. All the CPU does is keep a
list of all locations where routineis were called by a `JSR` instruction and every 
time it reaches an `RTS` instruction it jumps back to the most recent location in
its list.



```asm
;-------------------------------------------------------------------------
; CheckLevelComplete
;-------------------------------------------------------------------------
CheckLevelComplete
        LDA droidsLeftToKill
        BEQ b8ACD
b8ACC   RTS 

b8ACD   LDA noOfDroidSquadsCurrentLevel
        BNE b8ACC
        JMP DisplayNewLevelInterstitial
        ;Returns
```

What we often find in Minter's programs that the function we `JMP` to at the end
of the routine itself calls `RTS` when it's done. If that happened here execution
would go back to the place where we called `JSR CheckLevelComplete` in the main 
game loop. And while that isn't obvious without a bit of explanation, it's common
enough to become obvious and expected behaviour after a while.

What happens in Gridrunner in this instance is something less desirable. If we
follow the `JMP DisplayNewLevelInterstitial` we find that it doesn't return but
instead jumps to another routine, which jumps to another routine, and eventually
we jump all the way to `MainLoop` again without ever having actually returned from
`CheckLevelComplete`. 

So that means as we play the game and complete levels the list of locations for
unreturned sub-routines will keep growing and eventually the list will be 32 items
long when we complete the game.

```
This list of locations is known as the 'stack'. The 'stack' is an area in memory
that you can think of as behaving like a stack of plates. You can add a value to the 
top of the stack, but every time you take a value from the stack you also have to take it
from the top. So it behaves in a last-in, first-out way. This is a useful pattern
when you want to keep a list, don't particularly want to keep track of what's in the
list, and all you need to worry about is being able to take the most recently
added item (the location a routine was called) every time you are asked for an item
(when `RTS` is executed).
```

## Gridrunner on the Vic 20

### Character Sets in the Vic 20 and C64
Gridrunner is entirely character based, it doesn't use any other type of
graphic capability. What this means in practice is that everything on the
screen is drawn with hand-crafted characters on a screen that on the C64 is 40
characters wide and 22 characters tall. As Gridrunner demonstrates, it's
possible to do quite a lot even with these limited means. But it also means
that unless you get quite sophisticated, and Gridrunner doesn't, the size of
the game elements such as the ship, bullets and enemies are going to be just
one character in size.

Each character is 8 pixels wide and 8 pixels high. And the way you define a
character is by providing 8 bytes that together define a bitmap for the
character. In this case the bitmap is simply an 8x8 table of 1s and 0s that
defines the shape of the character: a 1 means a pixel, a 0 means a blank space.

A good example is the iconic Gridrunner ship:

```asm
.BYTE $18,$3C,$66,$18,$7E,$FF,$E7,$C3 ; CHARACTER 7           
                                        ; $07                 
                                        ; 00011000      **    
                                        ; 00111100     ****   
                                        ; 01100110    **  **  
                                        ; 00011000      **    
                                        ; 01111110    ******  
                                        ; 11111111   ******** 
                                        ; 11100111   ***  *** 
                                        ; 11000011   **    ** 
```
You have to look quite closely at the table of 1s and 0s to make out the
picture it is representing. The equivalent representation using blanks and
asterisks to its right does a better job of making the defined shape obvious.
In the gridrunner ship the first line of the bitmap is given as `$18`, in 1s
and 0s this is `00011000` giving the first row of pixels for the character. We
do the same for the remaining 7 bytes and the 8 bytes together give us our 8x8
  bitmap of the ship:

<img
src="https://user-images.githubusercontent.com/58846/110808216-af62ad00-827b-11eb-95a3-a0cf7266f824.png"
width=300>

Once we repeat this process for all the characters we want to create we will
have a file such as [charset.asm] with the game's full character set defined.
The next task is to somehow let the computer know where these character
definitions are so that it can use them. By default, the C64 expects to find
the characgter set definition at location `$1000` in memory - but in the case
of Gridrunner Minter stores it at $2000, out of the way of the game code. The
way to let the C64 know of this is to update the value stored at address
`$D018` - the magic value to write there if we want to store our character set
at `$2000` is `$18`. So a simple statement such as this would suffice:

```asm
LDA $18
STA $D018
```

For some reason, Minter does something much more convoluted in Gridrunner: 

```asm
vicRegisterLoPtr = $02
vicRegisterHiPtr = $03
;---------------------------------------------------------------------------------
; InitializeGame   
;---------------------------------------------------------------------------------
InitializeGame   
        LDA #$D0
        STA vicRegisterHiPtr
        LDA #$00
        STA vicRegisterLoPtr
        LDY #$18
        TYA 
        STA (vicRegisterLoPtr),Y
```

This is the exact equivalent of `LDA $18, STA $D018` but instead uses a technique
called 'address pointers'. This involves storing a memory address in memory and 
using it as a pointer for writing values to that memory address.

### Address Pointers
Let's step through the code to see how that works. First let's visualize the state
of memory before the code is run. We'll imagine that the memory is all zeroes:


```
Address:         $0003      
                 /      
Bytes:        00 00   ........00 ..... 00 00 00
              \               \        \
Address:      $0002           $D000    $D018
```

First we write `$D0` to address `$0003` (vicRegisterHiPtr) and `$00` to address
`$0002` (vicRegisterLoPtr):

```
Address:         $0003      
                 /      
Bytes:        00 D0   ........00 ..... 00 00 00
              \               \        \
Address:      $0002           $D000    $D018
```

Next we load `$18` to the `Y` register then copy it to the `A` register:

```
        LDY #$18
        TYA 
```
Finally we write the contents of `A` (`$18`) to the address stored at
`vicRegisterLoPtr` *plus* the number of bytes stored in `Y`.

```
        STA (vicRegisterLoPtr),Y
```

Let's unpack this because it's confusing. The address stored at `$0002`
(`vicRegisterLoPtr`) is actually `$D000`:

```
Address:         $0003      
                 /      
Bytes:        00 D0   
              \      
Address:      $0002 
```

You may say: it's actually $00D0 though! But remember the C64 is
`little-endian` so we have to reverse the order of the bytes when looking at
two bytes in a row like this. 

So when we say `STA (vicRegisterLoPtr)` we are in fact saying: store the contents of
`A` in the address stored at address `$0002`, which in this case is the address
`$D000`. When we say `STA (vicRegisterLoPtr), Y` we are saying store the
contents of `A` (`$18`) in `$D000` + `$18`, i.e. at `$D018`. so this leaves us
with `$18` stored at `$D018`:

```
Address:         $0003      
                 /      
Bytes:        00 D0   ........00 ..... 18 00 00
              \               \        \
Address:      $0002           $D000    $D018
```

### The Title Screen
![image](https://user-images.githubusercontent.com/58846/110953577-712ec180-833f-11eb-9d84-031d4ba11b12.png)

The title screen for Gridrunner on the Vic 20 is extremely minimal. Minter
recounts that this was a result of having so few bytes left over in the
memory available to the game: there wasn't even enough room left over to fit hs full
name. On an unexpanded Vic 20 there are only 3.5 KB
available for a program to load and run, in other words from position `$1000`
to `$1DFF`, which is a total 3583 bytes.  Gridrunner uses all of this and arrives at 3585 bytes in total, the
two extra bytes are the load address at the start of the `prg` file.

```asm
;-------------------------------------------------------------------------
; InitializeScreenAndBorder
;-------------------------------------------------------------------------
InitializeScreenAndBorder
        LDA #$FF
        STA VICCR5   ;$9005 - screen map & character map address
        LDA #$08
        STA VICCRF   ;$900F - screen colors: background, border & inverse
        JMP DrawBannerTopOfScreen

             .BYTE $C5,$CE
txtCopyRight .BYTE $02,$A8,$83,$A9,$B1,$B9,$B8,$B2 ; (c) 1982
             .BYTE $8A,$83,$8D,$BD,$39,$3B,$BC,$76 ; JCM
             .BYTE $6A

;-------------------------------------------------------------------------
; DrawTitleScreen
;-------------------------------------------------------------------------
DrawTitleScreen
        JSR InitializeScreenAndBorder
b1BA7   LDA #$02
        STA VIA1IER  ;$911E - interrupt enable register (IER)

        ; Clear the screen
        LDY #$00
        LDA #$20
b1BB0   STA SCREEN_RAM + $0016,Y
        STA SCREEN_RAM + $0116,Y
        DEY 
        BNE b1BB0

        LDY #$00
b1BBB   LDA currentHighScore,Y
        CMP SCREEN_RAM + $000F,Y
        JMP CheckCurrentScoreAgainstHighScore

;---------------------------------------------------------------------------------
; CheckCurrentScoreAgainstHighScore   
;---------------------------------------------------------------------------------
CheckCurrentScoreAgainstHighScore   
        BNE b10D6
        INY 
        JMP UpdateHiScore

b10D6   BMI b10DB
        JMP DrawHiScoreAndWaitForFire

b10DB   JMP SaveHiScore

;---------------------------------------------------------------------------------
; DrawHiScoreAndWaitForFire   
;---------------------------------------------------------------------------------
DrawHiScoreAndWaitForFire   
        LDY #$0A
b1BD7   LDA highScoreText,Y
        STA SCREEN_RAM + $0048,Y
        LDA txtCopyRight,Y
        STA SCREEN_RAM + $008A,Y
        LDA #$01
        STA COLOR_RAM + $0048,Y
        STA COLOR_RAM + $008A,Y
        DEY 
        BNE b1BD7

        ;Wait for the user to press fire.
b1BEE   JSR GetJoystickInput
        LDA joystickInput
        AND #$80
        BEQ b1BEE

        ;Fire Pressed
        JMP LaunchGame
```
### Drawing the Grid
![vicdrawgrid](https://user-images.githubusercontent.com/58846/111065244-a4449280-84b0-11eb-9b13-fa9aa25d8c5b.gif)

The grid for the Vic 20 is drawn with a simple nested loop, using a single grid character. The grid is 21 characters
wide and 18 characters tall. The grid is drawn instantaneously along with the rest of the items on the screen.

```asm
        .BYTE $18,$18,$18,$FF,$FF,$18,$18,$18   ;.BYTE $18,$18,$18,$FF,$FF,$18,$18,$18
                                                ; CHARACTER $00, GRID
                                                ; 00011000      **   
                                                ; 00011000      **   
                                                ; 00011000      **   
                                                ; 11111111   ********
                                                ; 11111111   ********
                                                ; 00011000      **   
                                                ; 00011000      **   
                                                ; 00011000      **   
SCREEN_LINE_WIDTH = $16
;-------------------------------------------------------------------------
; DrawGrid
;-------------------------------------------------------------------------
DrawGrid
        LDA #>SCREEN_RAM + $002C
        STA screenRamHiPtr
        LDA #<SCREEN_RAM + $002C
        STA screenRamLoPtr

        LDX #$12 ; 18 characters tall
b1177   LDY #$15 ; 21 characters wide
b1179   LDA #GRID
        STA (screenRamLoPtr),Y

        LDA screenRamHiPtr
        PHA 
        ; Move the Hi pointer to COLOR RAM
        CLC 
        ADC #OFFSET_TO_COLOR_RAM
        STA screenRamHiPtr

        ; Draw the color
        LDA #RED
        STA (screenRamLoPtr),Y

        PLA 
        STA screenRamHiPtr
        DEY 
        BNE b1179

        LDA screenRamLoPtr
        CLC 
        ADC #SCREEN_LINE_WIDTH
        STA screenRamLoPtr
        LDA screenRamHiPtr
        ADC #$00
        STA screenRamHiPtr
        DEX 
        BNE b1177

        RTS 
```
For the C64 port, we get something more elaborate.

![c64drawgrid](https://user-images.githubusercontent.com/58846/111065656-a9a2dc80-84b2-11eb-9983-0dce7853f67d.gif)

The grid is drawn in two stages. Once with a vertical line, and finally with the full grid. We also get sound
effects to accompany drawing the grid. Notice how much more compact the `DrawGridLoop` loop is compared
to the original in the Vic20. This is because the loop now uses a utility routine `WriteCurrentCharacterToCurrentXYPos`
to draw the character to the screen rather than implementing those details in the body of the loop itself:

```asm

.BYTE $18,$18,$18,$18,$FF,$18,$18,$18   ;.BYTE $18,$18,$18,$18,$FF,$18,$18,$18
                                        ; CHARACTER $00, GRID
                                        ; 00011000      **   
                                        ; 00011000      **   
                                        ; 00011000      **   
                                        ; 00011000      **   
                                        ; 11111111   ********
                                        ; 00011000      **   
                                        ; 00011000      **   
                                        ; 00011000      **   

.BYTE $18,$18,$18,$18,$18,$18,$18,$18   ;.BYTE $18,$18,$18,$18,$18,$18,$18,$18
                                        ; CHARACTER $3f, VERTICAL_LINE
                                        ; 00011000      **   
                                        ; 00011000      **   
                                        ; 00011000      **   
                                        ; 00011000      **   
                                        ; 00011000      **   
                                        ; 00011000      **   
                                        ; 00011000      **   
                                        ; 00011000      **   
gridXPos = $08
gridYPos = $09
;-------------------------------------------------------------------------
; DrawGrid
;-------------------------------------------------------------------------
DrawGrid
        LDA #$02
        STA gridXPos
        LDA #ORANGE
        STA colorForCurrentCharacter
        LDA #VERTICAL_LINE
        STA currentCharacter

        ; Draw the horizontal lines of the grid
DrawHorizontalLineLoop   
        LDA #$00
        STA $D412    ;Voice 3: Control Register
        LDA #$00
        STA $D412    ;Voice 3: Control Register

        LDA #$02
        STA gridYPos
b81BC   LDA gridYPos
        STA currentYPosition
        LDA gridXPos
        STA currentXPosition
        JSR WriteCurrentCharacterToCurrentXYPos
        JSR PlaySomeSound
        INC gridYPos
        LDA gridYPos
        CMP #$16
        BNE b81BC

        LDX #$01
b81D4   JSR JumpToPlayAnotherSound
        DEY 
        BNE b81DA
b81DA   DEX 
        BNE b81D4
        INC gridXPos
        LDA gridXPos
        CMP #$27
        BNE DrawHorizontalLineLoop

        ; Draw the full grid
        LDA #$02
        STA gridXPos
        LDA #GRID
        STA currentCharacter

DrawGridLoop
        LDA #$01
        STA gridYPos
b81F1   LDA gridYPos
        STA currentXPosition
        LDA gridXPos
        STA currentYPosition
        JSR WriteCurrentCharacterToCurrentXYPos
        JSR PlaySomeSound
        INC gridYPos
        LDA gridYPos
        CMP #$27
        BNE b81F1

        LDX #$01
b8209   JSR JumpToPlayAnotherSound
        DEY 
        BNE b820F
b820F   DEX 
        BNE b8209

        INC gridXPos
        LDA gridXPos
        CMP #$16
        BNE DrawGridLoop

b821A   RTS 
```
In the Matrix for the VIC 20 we get something more elaborate again:

![matrix-levelentry](https://user-images.githubusercontent.com/58846/111451403-4e1e5c00-8709-11eb-849d-5eb01edc39c7.gif)

Let's break down how this is achieved. The first element of the sequence is a cascade of coloured lines descending
down the screen. This is implemented by the routine `DrawGridLineCascade`:

```asm
gridLineColorIndex = $06
;-------------------------------------------------------------------------
; DrawGridLineCascade
;-------------------------------------------------------------------------
DrawGridLineCascade
        LDA #>SCREEN_RAM + $0042
        STA screenLineHiPtr
        LDA #<SCREEN_RAM + $0042
        STA screenLineLoPtr

DrawLinesLoop
        LDA #$00
        LDY #$14

        ; Draw an empty character to the screen. The actual lines will be
        ; animated by the caller of this routine.
b2139   STA (screenLineLoPtr),Y
        DEY 
        BNE b2139

        ; Move the ptr to Color RAM
        LDA screenLineHiPtr
        PHA 
        CLC 
        ADC #$84
        STA screenLineHiPtr

        ; Paint the line with the color for this point in the
        ; sequence
        LDX gridLineColorIndex
        LDA gridLineIntroSequenceColors,X
        LDY #$14
b214D   STA (screenLineLoPtr),Y
        DEY 
        BNE b214D

        ; Move to the next line
        LDA screenLineLoPtr
        ADC #$16
        STA screenLineLoPtr
        PLA 
        ADC #$00
        STA screenLineHiPtr

        ; There are eight colors to choose from, so wrap around
        ; if we've reached the 8th color.
        INC gridLineColorIndex
        LDA gridLineColorIndex
        CMP #$08
        BNE b2169
        LDA #$01
        STA gridLineColorIndex

b2169   DEC linesToDraw
        BNE DrawLinesLoop
        RTS 
```
This routine draws a number of colored lines down the screen, where the number is determined by `linesToDraw`.
This is what it looks like when called at each iteration from `BeginGameEntrySequence`. The number of lines
it draws at each invocation is gradually increased, creating the cascade effect:

![matrix-gridlines](https://user-images.githubusercontent.com/58846/111452529-86726a00-870a-11eb-9a11-4e21cc4be009.gif)

The effect of the scrolling lines is actually achieved by the caller of `DrawGridLineCascade`. On closer inspection
we see that `DrawGridLineCascade` itself just draws empty characters and updates the color value for each. The following
section in `BeginGameEntrySequence` is the one that actually implements the animated line effect:

```asm
DrawGridLoop
        LDA tempCounter2
        STA gridLineColorIndex
        LDA #$14
        SEC 
        SBC tempCounter
        STA linesToDraw
        INC VICCRE   ;$900E - sound volume
        LDA VICCRE   ;$900E - sound volume
        CMP #$10
        BNE b21A2
        DEC VICCRE   ;$900E - sound volume
b21A2   JSR DrawGridLineCascade

        ; This section animates the GRID characters we drew above. 
        ; It achieves this by populating an $FF in each of the 8 bytes
        ; of the grid character definition then reverting it to $00.
        ; The net effect is of a horizontal line moving smoothly down
        ; the screen along a single line width.
        LDX #$00
AnimateLineLoop
        LDA #$FF
        STA charsetLocation,X
        TXA 
        PHA 
        LDA #$80
        STA xCycles
        LDA #$10
        STA yCycles
        JSR WasteXYCycles
        PLA 
        TAX 
b21BB   LDA VICCR4   ;$9004 - raster beam location (bits 7-0)
        CMP #$7F
        BNE b21BB
        LDA #$00
        STA charsetLocation,X
        INX 
        CPX #$08
        BNE AnimateLineLoop
```
As we may remember a character set is defined by 8 bytes, a value of $FF in any one of those bytes
draws a horizontal line along the character, for example like so:

```asm
.BYTE $00,$00,$00,$00,$FF,$00,$00,$00   
                                        ; 00000000           
                                        ; 00000000           
                                        ; 00000000           
                                        ; 00000000           
                                        ; 11111111   ********
                                        ; 00000000           
                                        ; 00000000           
                                        ; 00000000           
```

What `AnimateLineLoop` does above is iterate through the 8bytes of the character set definition for
character `$00`, set it to $FF (creating a line), wait a little while, then set it back to `$00`, making
it blank again. This achieves the line moving down the screen effect.

The same technique, manipulating character sets in place, achieve the materialization of the grid from the
cascaded lines.

```asm
        ; Animate the materialization of the grid
MaterializeGrid
        LDX #$80
b220B   STX VICCRB   ;$900B - frequency of sound osc.2 (alto)
        LDY #$00
b2210   DEY 
        BNE b2210
        INX 
        BNE b220B

        LDY #$08
b2218   LDX linesToDraw
        LDA charsetLocation + $02D8,X
        STA charsetLocation - $0001,Y
        INC linesToDraw
        DEY 
        BNE b2218

        LDA VICCRE   ;$900E - sound volume
        SBC #$05
        STA VICCRE   ;$900E - sound volume
        DEC gridLineColorIndex
        BNE MaterializeGrid
```

A more complex version of this effect, involving bit-shifting, is used to animate the title
text while the game is playing: 

```asm
;-------------------------------------------------------------------------
; AnimateTitleText
;-------------------------------------------------------------------------
AnimateTitleText
        LDA charsetLocation + $0109
        ROL 
        ADC #$00
        STA charsetLocation + $0109
        RTS 
```
![matrixtitleanimate](https://user-images.githubusercontent.com/58846/111461510-30ef8a80-8715-11eb-9b78-8d4cccec6d55.gif)

When Minter converted the Vic 20 Matrix to C64 in a hurry he left at least one small bug behind in the process.
When porting to C64 he forgot to update the 'STA' statement to refer to the new location of the character
set:

```asm
;-------------------------------------------------------------------------
; AnimateTitleText
;-------------------------------------------------------------------------
AnimateTitleText
        LDA charSetLocation + $0109
        ROL 
        ADC #$00
        ;FIXME: should this be charSetLocation + $0109 like in Vic20?
        STA f1509
        RTS 
```

Instead of storing the updated, bit-shifted byte to its original location of $2109, he instead stores it
to the equivalent location of the byte in the Vic 20 version ($1509). The result is that the animation
doesn't happen. When you play Matrix on the C64 what should be an animation effect instead looks like a glitch
in rendering the title text:

![matrixc64titleanimate](https://user-images.githubusercontent.com/58846/111461817-98a5d580-8715-11eb-9238-bf4390064c1c.gif)



```asm

;-------------------------------------------------------------------------
; PerformRollingGridAnimation
;-------------------------------------------------------------------------
PerformRollingGridAnimation
        LDA charsetLocation + $0007
        STA screenLineLoPtr
        LDX #$07
b337D   LDA charsetLocation - $0001,X
        STA charsetLocation,X
        DEX 
        BNE b337D

        LDA screenLineLoPtr
        STA charsetLocation
        LDA a3F
        AND #$80
        BEQ b3394
        JMP ScrollGrid

b3394   RTS 

;---------------------------------------------------------------------------------
; ScrollGrid   
;---------------------------------------------------------------------------------
ScrollGrid   
        LDX #$08
b340C   CLC 
        LDA charsetLocation - $0001,X
        ROL 
        ADC #$00
        STA charsetLocation - $0001,X
        DEX 
        BNE b340C
b3419   RTS 
```

```asm
;---------------------------------------------------------------------------------
; TitleScreenLoop   
;---------------------------------------------------------------------------------
TitleScreenLoop   
        LDX #$00
        LDA #>charsetLocation
        STA tempCounter
        LDA #<charsetLocation
        STA a07
b38B7   LDA VICCR4   ;$9004 - raster beam location (bits 7-0)
        CMP #$7F
        BNE b38B7

        LDA txtScrollingAllMatrixPilots,X
        BEQ TitleScreenLoop
        AND #$3F
        CMP #$20
        BNE b38CC
        JMP HandleSpaceInScrollingText

b38CC   CMP #$2E
        BNE b38D3
        JMP HandleElllipsisInScrollingText

b38D3   CMP #$2C
        BNE b38DA
        JMP j394E

b38DA   CLC 
        ASL 
        ASL 
        ASL 
        TAY 
        STX tempCounter2
        LDX #$00
b38E3   LDA charsetLocation + $0200,Y
        STA scrollingTextStorage,X
        INY 
        INX 
        CPX #$08
        BNE b38E3
        ; Fall through

;---------------------------------------------------------------------------------
; ScrollTextLoop   
;---------------------------------------------------------------------------------
ScrollTextLoop   
        LDX tempCounter2
        LDA #$08
        STA tempCounter
b38F5   LDY #$00
b38F7   LDA #$18
        STA a07
        TYA 
        TAX 
        CLC 
j38FE   ROL scrollingTextStorage,X
        PHP 
        TXA 
        CLC 
        ADC #$08
        TAX 
        DEC a07
        BEQ b390F
        PLP 
        JMP j38FE

b390F   PLP 
        INY 
        CPY #$08
        BNE b38F7
        LDX #$0A
b3917   DEY 
        BNE b3917
        DEX 
        BNE b3917
b391D   LDA VICCR4   ;$9004 - raster beam location (bits 7-0)
        CMP #$7F
        BNE b391D
        DEC tempCounter
        BNE b38F5
        LDX tempCounter2
        INX 
        JMP TitleScreenCheckJoystickKeyboardInput

        .BYTE $00
;---------------------------------------------------------------------------------
; HandleSpaceInScrollingText   
;---------------------------------------------------------------------------------
HandleSpaceInScrollingText   
        STX tempCounter2
        LDA #$00
        LDX #$08
b3935   STA charsetLocation + $03FF,X
        DEX 
        BNE b3935
        JMP ScrollTextLoop

;---------------------------------------------------------------------------------
; HandleElllipsisInScrollingText   
;---------------------------------------------------------------------------------
HandleElllipsisInScrollingText   
        STX tempCounter2
        LDX #$08
b3942   LDA charsetLocation + $03B7,X
        STA charsetLocation + $03FF,X
        DEX 
        BNE b3942
        JMP ScrollTextLoop

j394E   STX tempCounter2
        LDX #$08
b3952   LDA charsetLocation + $03C7,X
        STA charsetLocation + $03FF,X
        DEX 
        BNE b3952
        JMP ScrollTextLoop
```
### Creating The Levels
### Managing the Droids
### Managing Speed
### Some Early Anti-Patterns
### Sound Effects

## Porting Gridrunner to the C64
### Improving Code Style
### Changes in Gameplay
### New Effects

## Matrix: Gridrunner 2
### Improving Code Style
### Changes in Gameplay

## Porting Matrix to the C64
### Improving Code Style
### Changes in Gameplay

## Voidrunner
### Coding for the C16
### Colors, effects

## Gridrunner: Afterlife
### Gridrunner Revolution
### Gridrunner++

## Appendix: Reconstructing the Source Code


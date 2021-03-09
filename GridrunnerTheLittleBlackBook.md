# Gridrunner: The Little Black Book
<img src="https://www.mobygames.com/images/covers/l/34991-gridrunner-commodore-64-front-cover.jpg" height=300><img src="https://user-images.githubusercontent.com/58846/103443482-9fb16180-4c57-11eb-9403-4968bd16287f.gif" height=300>

## Introduction
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

```
The Commodore 64 is often referred to as an '8-bit' computer. This is because
each of its boxes or segments in memory can only contain 1 byte (or 8 bits) as
described above. Computers that can store two bytes in one of the boxes or
segments in their 'memory tape' are called 16-bit computers.  Those that can
store 4 bytes are 32-bit. Those can store 8 bytes are 64 bit.
```

## Hexadecimal Notation
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

Decimal|Hex
| --- | --- |
0|0
1|1
..|..
8|8
9|9
10|A
11|B
..|..
14|E
15|F

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

If you are familiar with Gridrunner you may now have begun to recognize that
this segment of code is from the title screen of the game, where the user can
select the level to start on. If you attempt to select a level above 32 it
cycles back to level 1: you can only choose a level between 1 and 32.

![gridrunner-level](https://user-images.githubusercontent.com/58846/110531048-013bf380-8113-11eb-9f3a-3f3288446f58.gif)

### Loops
### Functions and Early Returns
### Pointers and Pointer Tables
### Character Sets in the Vic 20 and C64

## Gridrunner on the Vic 20
### Writing Gridrunner on the Vic 20
### Creating The Levels
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

# Appendix: Reconstructing the Source Code


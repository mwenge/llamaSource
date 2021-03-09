# Gridrunner
### The Little Black Book

## Introduction

## 6502 Assembly: The Basics

The Commodore 64 is a computer with 64 kilobytes of memory. Let's unpack the
two most important terms in this statement: memory and kilobytes.

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
The other thing to note here is that each box in the tape can only store a
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
Hexadecimal notation is the time-honored answer to this question. Since a byte
consist of 8 bits, each of which can be 0 or 1, that means a byte can be one of
256 values, or in other words a number between 0 and 255. When we store a byte
in one of the segments on the tape we are in fact storing a number between 0
and 255 there.  Hexadecimal is a very convenient way of representing numbers
between 0 and 255 because it allows us to write the number as a two-character
value where the first character represents the left half of the byte (i.e. the
first 4 bits) and the second character represents the right half of the byte
(i.e. the last 4 bits).

Since a string of 4 bits can give us between 0 and 15 possible values, that
means the numbers from 0 to 9 aren't enough to represent each of the 16 values
in a single character. To deal with this we also use A to F. So if the number
is 9 we use a 9, but if it's 10 we use an A. If it's 15 we use an F and so on.
Now since there are sixteen possible combinations of 4 zeros and ones, we need
a convention for deciding which combination represents which number.

The way this is done by assigning a value to each of the 4 bits from left to
right and adding them up as follows:

8 4 2 1
0 1 0 1 = 5 = 5
0 0 0 1 = 1 = 1
1 0 1 0 = 10  = A
1 1 1 1 = 15  = F

Next, by splitting the byte into a pair of 4 bits we can construct each
character in the hexadecimal representation of the byte as in the following
examples:

Hex Left 4 bits Right 4 bits  Decimal
$00 0000  0000
$01 0000  0001
$08 0000  1000
$88 1000  1000
$FF 1111  1111

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

Bit 7 Bit 6 Bit 5 Bit 4 Bit 3 Bit 2  Bit 1  Bit 0
128 64  32  16  8 4 2 1

So now we can give some full byte values:

Hex Left 4 bits Right 4 bits  Decimal
$00 0000  0000  0
$01 0000  0001  1
$08 0000  1000  8
$88 1000  1000  136
$FF 1111  1111  255

Unfortunately there really isn't any good trick for converting a hexadecimal
value such as $32 into its decimal equivalent in your head, other than to use
old-fashioned multiplication: multiply 3 by 16, then add 2, giving 50.

### Addressing Memory
Now that we have a notation for defining the values (i.e. the numbers) that we
store in each of the boxes in our memory tape, we need to decide if we should
use the same notation for naming each of the boxes in the tape. The simplest
way of naming the boxes is to give each a number as its address and to start at
0 and end at 65,536.  This is indeed what we
do. And now that we have hexadecimal notation we might as well use that instead
of decimal numbers.  We write the range 0 to 65,356 in hexadecimal as $0000
to $FFFF. The pleasing symmetry of this hexadecimal representation is not an
accident. The 64 kilobytes of memory in the Commodore 64 is the limit of what
can be addressed by a two byte value between $0000 and $FFFF inclusive.


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

The first two bytes are $0108. So if these two represent the address the rest
should be copied to, then the C64 must copy everything from `0B 08 0A` onwards to
address $0108 onwards right?

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

Once it has completed copying the data into memory. The next step is to start executing it. It starts
executing the data from the position to which it was copied: in this case `$0801`. So this leads
to the question, how does it interpret the data there? Here is how this string of bytes would
be represented in the source code for a C64 program (every line starting with a `;` is a comment):


```asm
;-----------------------------------------------------------------------------------------------------
; SYS 2061 (PrepareGame)
; This launches the program from address $080d, i.e. PrepareGame.
;-----------------------------------------------------------------------------------------------------
; $9E = SYS
; $32,$30,$36,$31,$00,$00 = 2061 ($080D in hex)
p0800   .BYTE $0B,$08,$0A,$00,$9E,$32,$30,$36,$31,$00,$00,$00
```

So you can see the first 4 bytes are skipped, and the first instruction encountered is $9E, which stands
for the `SYS` command. This command tells the CPU to start executing the machine language program at
at the address specified in the bytes that follow. In this case the bytes that follow are `$32 $30
$36 $31`, which is the PETSCII representation of the number 2061: $32 represents the number 2, $30 represents
the number 0, and so on. 2061 in hexadecimal is $080D, so the CPU jumps to address $080D and starts executing
what's there.

```asm
;---------------------------------------------------------------------------------
; PrepareGame   
;---------------------------------------------------------------------------------
PrepareGame   
        SEI 
        ; Jumps to routine InitializeData
        JMP (initializeDataJumpAddress)
```

### Reading and Comparing Values
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


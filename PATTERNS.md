# Programming Patterns in Iridis Alpha


<!-- vim-markdown-toc GFM -->

* [Writing to the Screen](#writing-to-the-screen)
  * [Clearing the screen](#clearing-the-screen)
  * [Drawing characters and colors on the screen](#drawing-characters-and-colors-on-the-screen)
  * [Defining Character Sets](#defining-character-sets)
  * [Using Line Pointers to Specify X and Y Positions on the Screen](#using-line-pointers-to-specify-x-and-y-positions-on-the-screen)
* [Using Pointer Tables](#using-pointer-tables)
  * [Pointer Tables for Writing Structured Data](#pointer-tables-for-writing-structured-data)
  * [Using Pointer Arrays to Jump to Subroutines](#using-pointer-arrays-to-jump-to-subroutines)
* [Early Returns](#early-returns)
* [Mutating Memory](#mutating-memory)
  * [A Technique for Getting 'Random' Numbers](#a-technique-for-getting-random-numbers)
* [Handling Keyboard Input](#handling-keyboard-input)
* [Handling Joystick Input](#handling-joystick-input)

<!-- vim-markdown-toc -->

Assembly requires the programmer to specify every task in detail. Over the
course of his time programming the Vic 20 and C64 Minter developed a number of
patterns for common tasks. Here I try to cover as many of them as I can. I hope
that discussing these patterns will also make it easy for an Assembly-newbie to
start reading and understanding the code themselves.

## Writing to the Screen

### Clearing the screen
The C64 screen consists of 1000 bytes (40 columns by 25 rows) at address
`$0400`-`$07E7`. A common requirement is to completely clear the screen. You
achieve this by populating it with spaces ($20). The loop below appears in most
Minter games when the screen needs to be cleared: 

```asm
        ;Clear screen
        LDX #$00
        LDA #$20 ; The space character
b4129   STA SCREEN_RAM,X ; SCREEN_RAM = $0400
        STA SCREEN_RAM + $0100,X
        STA SCREEN_RAM + $0200,X
        STA SCREEN_RAM + $02F8,X
        DEX 
        BNE b4129 ; Loop until X = 0
```

Note that the technique here is to start X at 00 and keep looping until
decrementing X reaches 00 again. This makes the loop 256 iterations long,
covering each of the 4 256-byte segments of the screen RAM.

### Drawing characters and colors on the screen
How do we draw characters (and add color to them). Let's take the stripes behind the title name
in the title screen of Iridis Alpha. There are seven of them forming a rainbow effect.

![image](https://lh3.googleusercontent.com/proxy/qDLnfhylHBQ6S9hSQY3hnjAcZq8I_iCUD0nfTuhLfLajwyZr_rSamiEdpGnbgUS5pW6uvqy6ojX-OUoiklxfQF4wgqc-kGTBJidsahIM1WNKemz0u4cOU6xds-62rz6e)

Here's the routine that draws the colorful stripes behind the title in the
title screen.  The character being drawn to each position in the screen is
`$00`. If we look up the character set in [`charset.asm`] we see that it is 4
horizontal stripes. The routine repeats this character across 7 lines. In
addition it assigns a color to each line by writing the approprite value in the
corresponding position of the C64's color ram (`$D800` - `$D8E7`). The color
values are also given below.


```asm
characterSetData
        .BYTE $FF,$00,$FF,$00,$00,$FF,$00,$FF   ;.BYTE $FF,$00,$FF,$00,$00,$FF,$00,$FF
                                                ; CHARACTER $00
                                                ; 11111111   ********
                                                ; 00000000           
                                                ; 11111111   ********
                                                ; 00000000           
                                                ; 00000000           
                                                ; 11111111   ********
                                                ; 00000000           
                                                ; 11111111   ********
```
```asm

BLACK    = $00
WHITE    = $01
RED      = $02
CYAN     = $03
PURPLE   = $04
BLUE     = $06
YELLOW   = $07
LTYELLOW = $0F

;------------------------------------------------------------------
; DrawStripesBehindTitle
;------------------------------------------------------------------
DrawStripesBehindTitle   
        LDX #$28
b0A78   LDA #$02
        STA COLOR_RAM + $0077,X
        LDA #$08
        STA COLOR_RAM + $009F,X
        LDA #$07
        STA COLOR_RAM + $00C7,X
        LDA #$05
        STA COLOR_RAM + $00EF,X
        LDA #$0E
        STA COLOR_RAM + $0117,X
        LDA #$04
        STA COLOR_RAM + $013F,X
        LDA #$06
        STA COLOR_RAM + $0167,X
        LDA #$00; Stripe character
        STA SCREEN_RAM + $0077,X
        STA SCREEN_RAM + $009F,X
        STA SCREEN_RAM + $00C7,X
        STA SCREEN_RAM + $00EF,X
        STA SCREEN_RAM + $0117,X
        STA SCREEN_RAM + $013F,X
        STA SCREEN_RAM + $0167,X
        DEX 
        BNE b0A78

        RTS 

```
### Defining Character Sets
This might inspire the question: how do you define a character set? The first
step is to define the characters themselves and assign them to location in
memory. The most common location to do this is from $2000 onwards. If you look
in [charset.asm](https://github.com/mwenge/iridisalpha/src/charset.asm) you'll
see that is indeed where Iridis Alpha's character set lives. Each character
uses an 8 byte long definition. This is what the character set definition for
'A' looks like:

```asm
        .BYTE $C6,$C6   ;.BYTE $3C,$66,$C6,$DE,$C6,$C6,$C6,$C6
                                                ; CHARACTER $01
                                                ; 00111100     ****  
                                                ; 01100110    **  ** 
                                                ; 11000110   **   ** 
                                                ; 11011110   ** **** 
                                                ; 11000110   **   ** 
                                                ; 11000110   **   ** 
                                                ; 11000110   **   ** 
                                                ; 11000110   **   ** 
```

The way we tell the C64 that this is where the character set definitions are
located is by storing a value in `$D018`. The value '8' in `$18` below achieves
this:
```asm
        LDA #$18
        STA $D018    ;VIC Memory Control Register
```

The following section int the C64 Programmer's Reference Manual explains how
this works:

```
    The location of character memory is controlled by 3 bits of the VIC-II
  control register located at 53272 ($D018 in HEX notation). Bits 3,2, and
  1 control where the characters' set is located in 2K blocks. Bit 0 is ig-
  nored. Remember that this is the same register that determines where
  screen memory is located so avoid disturbing the screen memory bits. To
  change the location of character memory, the following BASIC statement
  can be used:

    POKE 53272,(PEEK(53272)AND240)OR A

  Where A is one of the following values:
  +-----+----------+------------------------------------------------------+
  |VALUE|          |            LOCATION OF CHARACTER MEMORY*             |
  | of A|   BITS   +-------+----------------------------------------------+
  |     |          |DECIMAL|         HEX                                  |
  +-----+----------+-------+----------------------------------------------+
  |   0 | XXXX000X |     0 | $0000-$07FF                                  |
  |   2 | XXXX001X |  2048 | $0800-$0FFF                                  |
  |   4 | XXXX010X |  4096 | $1000-$17FF ROM IMAGE in BANK 0 & 2 (default)|
  |   6 | XXXX011X |  6144 | $1800-$1FFF ROM IMAGE in BANK 0 & 2          |
  |   8 | XXXX100X |  8192 | $2000-$27FF                                  |
  |  10 | XXXX101X | 10240 | $2800-$2FFF                                  |
  |  12 | XXXX110X | 12288 | $3000-$37FF                                  |
  |  14 | XXXX111X | 14336 | $3800-$3FFF                                  |
  +-----+----------+-------+----------------------------------------------+
  +-----------------------------------------------------------------------+
  | * Remember to add in the BANK address.                                |
  +-----------------------------------------------------------------------+
```

### Using Line Pointers to Specify X and Y Positions on the Screen

This is a technique Minter uses a lot, and it's both simple and effective.
The idea is to define an array with each member pointing to the first column
of each line on the screen. The first member of the array points to the start
of the first line, the second to the start of the second line, and so on. Now,
equipped with an X and Y position on the screen that you want to write a 
character to, you pick the Yth member of the array, and write to the Xth 
position after the area in memory that the member refers to.

Below is an example from [`madeinfrance.asm`] that shows how the array is
initialized. As you may quickly observe the 'array' is in fact two arrays. This
is because our array is a list of pointers to positions in memory, and all
such pointers are two bytes long, e.g. `$0400`, $510 etc. So in order to store
a list of memory pointers we in fact create two equally sized arrays and store
the 'low byte' of the pointer in the first one and the 'high byte' in the
second one. In the case of address `$0400` this means storing '$00' in the
first slot of the 'low byte' array and '$40' in the first slot of the 'high
byte' array. This is what the routine below does. It uses the memory beginning
at `$0340` for storing the low bytes, and the memory beginning at `$0360` for
storing the high bytes. It increments each iteration in the loop by $28, which
is the 40-byte length of each line. It exits the loop once it has copied $1A
(i.e. 25) lines.


```asm
pointerLo = $02
pointerHi = $03
screenLinePtrLo = $0340
screenLinePtrHi = $0360
SCREEN_RAM      = $0400

;---------------------------------------------------------------------------------
; Init_ScreenPointerArray
;---------------------------------------------------------------------------------
Init_ScreenPointerArray
        LDA #>SCREEN_RAM
        STA pointerHi
        LDA #<SCREEN_RAM
        STA pointerLo
        LDX #$00
b4109   LDA pointerLo
        STA screenLinePtrLo,X
        LDA pointerHi
        STA screenLinePtrHi,X
        LDA pointerLo
        CLC 
        ADC #$28
        STA pointerLo
        LDA pointerHi
        ADC #$00
        STA pointerHi
        INX 
        CPX #$1A
        BNE b4109
```

When the loop is done, `screenLinePtrLo` and `screenLinePtrHi` look something like this:

```asm
screenLinePtrLo: $00,$28,$80,...
screenLinePtrHi: $40,$40,$40,...
``` 

So armed with this pair of arrays, if I want to write to the 5th position on
the 2nd line I take the second entry in each of the screenLinePtrLo/Hi arrays.
These are `$28` and `$40`, which combine to give `$4028`. I now write to the 5th
position after `$4028`, which is `$402C`.

The mechanics of how this is done in practice (from [`madeinfrance.asm`] below) requires
us to introduce another concept in the C64 and that is the way these two-byte
pointers are actually used. When you look at the code below you'll notice that we
retrieve the value for the line we're interested in from each array and store the 
low byte in a variable pointerLo and the high byte in pointerHi. But when we go to
actually 'perform the write' we only reference the pointerLo variable. 


```asm
;------------------------------------------------------------------------
; MIF_PutCharAtCurrPosInAccumulator
;------------------------------------------------------------------------
MIF_PutCharAtCurrPosInAccumulator   
        LDX mifCurrentYPos
        LDY mifCurrentXPos
        LDA screenLinePtrLo,X
        STA pointerLo
        LDA screenLinePtrHi,X
        STA pointerHi
        LDA (pointerLo),Y
        RTS 

;------------------------------------------------------------------------
; MIF_DrawCurrentCharAtCurrentPos
;------------------------------------------------------------------------
MIF_DrawCurrentCharAtCurrentPos   
        JSR MIF_PutCharAtCurrPosInAccumulator
        LDA mifCurrentChar
        STA (pointerLo),Y ; This is where we're performing the write.
        LDA pointerHi
        PHA 
        CLC 

        ; Move to Hi ptr to Color Ram so we can paint the
        ; character's color
        ADC #$D4
        STA pointerHi
        LDA mifCurrentCharColor
        STA (pointerLo),Y
        PLA 
        STA pointerHi
f4174   RTS 
```

The reason we do this is because of two things:
  * `pointerLo` and `pointerHi` are in adjacent positions in memory. This is
    important as will become clear. `pointerLo` is at position `$0003` and
    `pointerHi` is as position `$0004`.
  * The C64 is little endian. This means that when it looks at a position in
    memory, retrieves two bytes from that position (for example $00 at position
    `$0003` and $04 at position `$0004`), and is asked to treat that two bytes as
    an address it reads the result as `$0400`, instead of `$0004`. In other words
    it switches the bytes around from the order that they appear in: treating
    the first byte as the 'low byte' in the address, and the second byte as the
    'high byte'.
    
So when we pull out two entries from our `screenLinePtrLo` and
`screenLinePtrHi` arrays and store them in `pointerLo` and `pointerHi`
respectively, we are actually setting up the two bytes stored beginning at
`pointerLo` as the address in screen ram that we want to write to (e.g. `$0400`).
This is because we have stored $00 in `pointerLo` (which is at address `$0003`)
and $04 in `pointerHi` (which is at address `$0004`).

When we load a value to the Accumulator (A) (e.g. $20) and want to store it at
position `$0400`, this is what we would do:

```asm
        LDA screenLinePtrLo
        STA pointerLo
        LDA screenLinePtrHi
        STA pointerHi
        LDA $20
        STA (pointerLo)
```
In the `STA (pointerLo)` instruction the C64 resolves the address to store at by looking
at the content of `pointerLo` (`$0003`) which is $00, and then the content from the byte after 
it (`pointerHi` (`$0004`)) which is `$04`, combining them in a little-endian mode to `$0400` and 
then writing the value of A (`$20`) to address `$0400`, i.e. the first column of the first line
on the screen.

## Using Pointer Tables

### Pointer Tables for Writing Structured Data
An extension of this technique using arrays of pointers can be found in the construction of the
high score table display. Since the scores are at various positions in the screen we can create
an array of positions on the screen for writing each of the high scores to.

```asm
hiScoreTableCursorPosLoPtr .BYTE $A1,$C9,$F1,$19,$41,$69,$91,$B9
                           .BYTE $E1,$09,$B5,$DD,$05,$2D,$55,$7D
                           .BYTE $A5,$CD,$F5,$1D
hiScoreTableCursorPosHiPtr .BYTE $04,$04,$04,$05,$05,$05,$05,$05
                           .BYTE $05,$06,$04,$04,$05,$05,$05,$05
                           .BYTE $05,$05,$05,$06
```
Note that there's an entry in the table for each of the twenty high scores. Each combination
(e.g. `$04A1`, `$04C9`, etc.) refers to the position on the screen for the corresponding high
score:

![image](https://user-images.githubusercontent.com/58846/108383980-320ac600-7202-11eb-8a3d-5e728a12a50f.png)

In the snippet below we have established the position in the high score table that the current
player has achieved and have stored it in `currentEntryInHiScoreTable`. We use this as an index
into the `hiScoreTableCursorPosLoPtr` and `hiScoreTableCursorPosHiPtr` arrays and then write the
'camel' character to the corresponding position on screen:

```asm

DrawCamelAtPosition   
        LDX currentEntryInHiScoreTable
        LDA hiScoreTableCursorPosLoPtr,X
        STA tempLoPtr
        LDA hiScoreTableCursorPosHiPtr,X
        STA tempHiPtr
        LDY #$10
        LDA #$25 ; The camel character
        STA (tempLoPtr),Y
```
### Using Pointer Arrays to Jump to Subroutines

If we can use pointer arrays for referencing positions in memory for data, there's no reason why
we can't also use them to store the addresses of subroutines or functions. This is how Iridis
Alpha draws random structures on the surface of the game's planets. In `DrawRandomlyChosenStructure`
we use a random number between 1 and 4 to choose one of 4 routines stored in the
`structureSubRoutineArrayLoPtr`/`structureSubRoutineArrayHiPtr` arrays:

```asm
;------------------------------------------------------------------
; DrawRandomlyChosenStructure
;------------------------------------------------------------------
DrawRandomlyChosenStructure   
        ; Pick a random positio to draw the structure
        JSR StoreRandomPositionInPlanetInPlanetPtr
        ;Pick a random number between 1 and 4
        JSR PutRandomByteInAccumulatorRegister
        AND #$03
        TAX 

        ; Run the randomly chose subroutine, one of:
        ; $7486, $74B1, $74CB, $74E5 to draw a structure
        ; on the planet surface
        LDA structureSubRoutineArrayHiPtr,X
        STA structureRoutineHiPtr
        LDA structureSubRoutineArrayLoPtr,X
        STA structureRoutineLoPtr
        JMP (randomStructureRoutineAddress)

;Jump table
structureSubRoutineArrayHiPtr   .BYTE $74,$74,$74,$74
structureSubRoutineArrayLoPtr   .BYTE $86,$B1,$CB,$E5
```

Once the item in the array is selected `JMP (randomStructureRoutineAddress)` branches
execution to the randomly selected routine. For example `DrawMediumStructure` at
`$74B1`:

```asm
;------------------------------------------------------------------
; DrawMediumStructure ($74B1) 
;------------------------------------------------------------------
DrawMediumStructure
        LDX #$00

j74B3   
        LDA mediumStructureData,X
        CMP #$FF
        BNE b74C0
        JSR SwitchToNextLayerInPlanet
        JMP j74B3

b74C0   CMP #$FE
        BEQ b74B0 ; Return
        STA (planetPtrLo),Y
        INY 
        INX 
        JMP j74B3
```
An example of a 'medium' structure drawn by the above routine:

![image](https://user-images.githubusercontent.com/58846/108413472-fa604600-7222-11eb-8c5f-9f3d93a82e78.png)

For more on the way the planet data is generated, check the [`README`] in the `src` directory.

The same 'jump' technique is used to manage launching the subgames in [Batalyx]. 

```asm
;---------------------------------------------------------------------------------
; LaunchSubGame
;---------------------------------------------------------------------------------
LaunchSubGame
        SEI 
        LDA #$00
        STA currentRasterArrayIndex
        JSR UpdateRasterPosition
        LDX selectedSubGame
        LDA subGameJumpMapLoPtr,X
        STA a449E
        LDA subGameJumpMapHiPtr,X
        STA a449F
        JSR UpdateGameIconsPanel
        JMP (a449E)

; $AB00 - LaunchHallucinOBomblets
; $6000 - LaunchAMCII
; $4288 - LaunchIridisBase
; $0810 - LaunchCippyOnTheRun
; $A000 - LaunchSyncro
; $7800 - LaunchPsychedelia
subGameJumpMapLoPtr   .BYTE $00,$00,$88,$10,$00,$00
subGameJumpMapHiPtr   .BYTE $AB,$60,$42,$08,$A0,$78
```

## Early Returns

## Mutating Memory
### A Technique for Getting 'Random' Numbers
Given the space constraints and the bare-metal execution model of assembly
programming in the C64 it's very common to mutate memory in-place to achieve a
desired effect. What this means in practice is updating a position in RAM so
that the next time the surrounding code is executed the updated value is used
instead of the value it replaced.

A simple example is the technique Minter used (which was presumably common) to
get a pseudo-random number. In this little routine we load whatever is in the
memory pointed to by label `currentMemoryPointer`. In this instance,
`currentMemoryPointer` starts out point at `$9A00`. So when the routine is
first run it will load whatever is in `$9A00` into the accumulator(`A`) and
return it. The calling function can now treat the content of `A` as a random
number. The trick the function uses to ensure that it returns a different
random number the next time it is called is to increment the location pointed
to by `currentMemoryPointer` by 1 byte from `$9A00` to `$9A01`. It does this by
directly manipulating that location in memory, in this case by calling `INC
addressOfCurrentMemoryPointer`. The variable `addressOfCurrentMemoryPointer`
points to the `00` in the instruction `LDA $9A00'. Incrementing
'addressOfCurrentMemoryPointer' by 1 changes the instruction from `LDA $9A00'
to `LDA $9A01'.

```asm
;------------------------------------------------------------------
; PutRandomByteInAccumulator
;------------------------------------------------------------------
addressOfCurrentMemoryPointer =*+$01

PutRandomByteInAccumulator   
        LDA currentMemoryPointer
        INC addressOfCurrentMemoryPointer
        RTS 
```

(Strictly speaking it changes the instruction from `LDA $009A` to `LDA $019A`,
because as you may remember byte pairs are little-endian in the C64, so the
'second' byte appears before the 'first byte'. The address `$9A00` is stored in
the order `$009A` in memory. This is also why the definition of
`addressOfCurrentMemoryPointer` is "*+$01" rather than "=*+$02": it tells the
compiler to skip ahead 1 byte rather than two to point to the location of
`currentMemoryPointer'. `LDA`, like all instructions in 6502 assembly is only
one byte long.)

So with all that in mind, you can see that this little function is treating the
bytes from `$9A00` onwards as good as random. Every time you call the function
it will give you another 'new' random byte, and move its pointer to the next
position in memory after $9A00 ready for the next caller.

## Handling Keyboard Input
The easiest way of reading keyboard input is to check the byte in memory
location `$00C5`. This stores the value of the most recently pressed key on the
keyboard.  [This table](https://www.c64-wiki.com/wiki/Keyboard_code) is a
useful reference providing a mapping from key pressed to the value stored in
`$00C5`.

The keyboard input routine in the [`dna.asm`] pause mode 'game' is
representative of how Minter typically codes for this sort of thing. When DNA
is running the user can manipulate a helix of large blinking eyeballs (!) by
tuning the speed, frequency and 'phase' of the helix: 

<img src="https://user-images.githubusercontent.com/58846/103443219-cfab3580-4c54-11eb-8046-0f5f3bac9c79.gif" width=700>

The routine that processes this user input I've called `DNA_CheckKeyBoardInput`
and it is called periodically in DNA during a 'raster interrupt' that runs
dozens of times every second. (We'll cover 'interrupts' in more detail later.)

Since assembly doesn't contain `if` or `switch` statements the challenge here
is to find a pattern that delivers both 'early returns' (i.e. exiting the
function as early as possible) and the ability to check a wide variety of
possible conditions. The least possible work the routine can do to is establish
that no key has been pressed and exit immediately. Since the value `$40` in
`$C005` tells us that no key has been pressed, this can be used to bail early
if there's no keyboard input to process. 

There's a problem though: we only want to act on changes to `lastKeyPressed`
(the name we'll give to `$C005`). So we need to be able to detect when it has
changed rather than acting on the last keypress repeatedly. Even if the user
presses the key only for a second, this routine will be called dozens of times
with the value for that key and it only wants to act on the keypress once: not
dozens of times.

Minter solves this by making the keyboard input routine slightly inefficient.
The routine will only act on a key the first time it sees it in `$00C5`. This
means noticing when the content has changed from `$40` to something else. The
way Minter does this here is to check the current key press when the previous
one was `$40` (i.e. no key pressed), otherwise return early:


```asm
;----------------------------------------------------------------
; DNA_CheckKeyBoardInput
;----------------------------------------------------------------
DNA_CheckKeyBoardInput   
        LDA dnaLastRecordedKey
        CMP #$40 ; No key pressed
        BEQ b1018

        ; No key was pressed. Update last recorded key and return.
        LDA lastKeyPressed
        STA dnaLastRecordedKey
        RTS 

b1018   LDA lastKeyPressed
        STA dnaLastRecordedKey
        CMP #$0C ; 'Z'
        BNE b1027
        ; Z pressed: decrease wave frequency.
        DEC dnaWave1Frequency
        JMP DNA_DrawStuff
        ; Returns
```

This has the inefficient result of checking against every possible valid
keypress (i.e. Z,X,A etc.) nearly every time the routine is called. This could
have been avoided with another check as follows:

```asm
b1018   LDA lastKeyPressed
        STA dnaLastRecordedKey
        CMP #$40 ; Additional check for 'no key pressed'
        BEQ ReturnEarly ; If no key pressed jump to an RTS and return.
        CMP #$0C ; 'Z'
        BNE b1027
        ; Z pressed: decrease wave frequency.
        DEC dnaWave1Frequency
        JMP DNA_DrawStuff
        ; Returns
```
The pattern in this paragraph is repeated throughout the routine. If the key value isn't the
one we're interested in (in this this case `$0C` (which is 'Z')) then move to the next paragraph,
otherwise act on the input and return.

## Handling Joystick Input

[`iridisalpha.asm`]: https://github.com/mwenge/iridisalpha/blob/master/src/iridisalpha.asm
[`madeinfrance.asm`]: https://github.com/mwenge/iridisalpha/blob/master/src/madeinfrance.asm
[`dna.asm`]: https://github.com/mwenge/iridisalpha/blob/master/src/dna.asm
[`charset.asm`]: https://github.com/mwenge/iridisalpha/blob/master/src/charset.asm
[`sprites.asm`]: https://github.com/mwenge/iridisalpha/blob/master/src/sprites.asm
[`bonusphase_graphics.asm`]: https://github.com/mwenge/iridisalpha/blob/master/src/bonusphase_graphics.asm
[`bonusphase.asm`]: https://github.com/mwenge/iridisalpha/blob/master/src/bonusphase.asm
[`README`]: https://github.com/mwenge/iridisalpha/blob/master/src/README.md
[Batalyx]: https://github.com/mwenge/batalyx/blob/master/src

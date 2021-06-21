# The Llamasoft Source Code Project
## An archive of the source code for Llamasoft software

<!-- vim-markdown-toc GFM -->

* [Introduction](#introduction)
* [The Games](#the-games)
  * [Tempest 2000 (1994) by Jeff Minter](#tempest-2000-1994-by-jeff-minter)
  * [Virtual Light Machine (1995) by Jeff Minter](#virtual-light-machine-1995-by-jeff-minter)
  * [Iridis Alpha](#iridis-alpha)
  * [Gridrunner](#gridrunner)
  * [Matrix](#matrix)
  * [Psychedelia](#psychedelia)
  * [Hellgate](#hellgate)
  * [Attack of the Mutant Camels](#attack-of-the-mutant-camels)
  * [Voidrunner](#voidrunner)
  * [Metagalactic Llamas: Battle at the Edge of Time](#metagalactic-llamas-battle-at-the-edge-of-time)
  * [Batalyx](#batalyx)
  * [Sheep in Space](#sheep-in-space)
  * [Revenge of the Mutant Camels](#revenge-of-the-mutant-camels)
  * [Hover Bovver](#hover-bovver)
  * [Mama Llama](#mama-llama)
  * [Ancipital](#ancipital)
  * [Return of the Mutant Camels](#return-of-the-mutant-camels)

<!-- vim-markdown-toc -->
# Introduction
One by one I'm disassembling some games and programs published for the
Commodore 64 and other platforms by Llamasoft (i.e. Jeff Minter).

For some games, such as Attack of the Mutant Camels on Konix and Tempest 2000 for the
Atari Jaguar, the original source code is already available so all I have done is
collect it in a form that allows you to compile and build the original game with
modern Linux build toolchains.

In the cases where the source code has to be reverse engineered the process
is often relatively straightforward. I can simply
disassemble the code (with a tool such as [Regenerator], split out the
characterset and sprite data from the game logic, and recompile to a binary
that matches exactly (byte for byte) the original game file. After that, I can
start labelling and commenting the code to make explicit the workings of the
game.

In other cases, the task isn't so trivial. Larger games such as Batalyx and
Iridis Alpha used compression and copy-protection software so it is much
harder, and may even be impossible, to produce a disassembled version that
compiles a target which will match the original `prg` file. For these guys,
I've had to work from a snapshot of the game while it's running
and just accept that the binary I end up compiling will not be a bytewise
match, and may have bugs. If I don't find a way of reverse-engineering the
compression and copy-protection that's what I will end up doing, for now.

All of the disassembled games below are a work in progress. At a minimum all
compile and run. They're listed in descending order of completeness so if you're
looking for further reading start with Iridis Alpha and work your way down.
The work that remains in all cases is to continue improving
the comments in the code and figuring out the operation of the routines while
assigning labels and variable names that are meaningful. For now, though, my
focus is on completing a first pass on as many games as possible. 


# The Games
## [Tempest 2000 (1994) by Jeff Minter](https://github.com/mwenge/tempest2k)
[<img src="https://user-images.githubusercontent.com/58846/121210319-7da9b400-c873-11eb-87c0-7a8e6f4b425b.png" height=300><img src="https://user-images.githubusercontent.com/58846/121211760-a8e0d300-c874-11eb-9fec-fe6a47e9be1d.gif" height=300>](https://github.com/mwenge/tempest2k)

This is the source code for Tempest 2000 by Jeff Minter originally published in 1994 for the ill-fated Atari Jaguar.

<br> 
<br> 
## [Virtual Light Machine (1995) by Jeff Minter](https://github.com/mwenge/vlm)
[<img src="https://user-images.githubusercontent.com/58846/122686598-c82f1700-d209-11eb-89b5-7f965b1cbec6.jpg" height=250><img src="https://user-images.githubusercontent.com/58846/122686679-6622e180-d20a-11eb-93db-3bb82dfb53a0.gif" height=250>](https://github.com/mwenge/vlm)

[<img src="https://img.shields.io/badge/Lastest%20Release-Jaguar-blue.svg">](https://github.com/mwenge/vlm/releases/download/v0.1/VirtualLightMachine.jag)

This is the reconstructed source code for the Virtual Light Machine by Jeff Minter originally published in 1995 for the ill-fated Atari Jaguar.

<br> 
<br> 
## [Iridis Alpha](https://github.com/mwenge/iridisalpha)
[<img src="https://www.c64-wiki.com/images/a/a2/Iridisalphacover.jpg" height=300><img src="https://user-images.githubusercontent.com/58846/103442991-ae494a00-4c52-11eb-9432-0f6ed61d3a5a.gif" height=300>](https://github.com/mwenge/iridisalpha)

Minter's magnum opus. This is the one I've spent most time on so far and the reverse-engineering
is well advanced. There are 3 additional games in here apart from the main game: a breakneck-paced vertical-scrolling
bonus phase, a pause-mode mini-game that is an interesting variation on 'Snakes', and a psychedelic light-machine
where the player can manipulate a double helix of technicolor eye-balls (!).

- Links to [a version you can try out in your browser.](https://iridisalpha.xyz)
- An overview of the [structure of the source code](https://github.com/mwenge/iridisalpha/tree/master/src). This gives you a good sense
of how the different games are split out and what each file contains.
- An overview of the [common patterns in Llamasoft C64 assembly](https://github.com/mwenge/iridisalpha/src/PATTERNS.md). I'm
trying to make this a good introduction to 'how things are done' in C64 assembly generally and in Llamasoft games in particular.
If you are completely new to both, this should be readable and informative.

The page also contains disassemblies and playable versions of the numerous demos Minter wrote preparing Iridis Alpha.

[<img src="https://user-images.githubusercontent.com/58846/103443219-cfab3580-4c54-11eb-8046-0f5f3bac9c79.gif" width=150>](https://github.com/mwenge/iridisalpha/tree/master/dna)[<img src="https://user-images.githubusercontent.com/58846/103443189-80650500-4c54-11eb-9a32-5b14fb383ca1.gif" width=150>](https://github.com/mwenge/iridisalpha/tree/master/torus)[<img src="https://user-images.githubusercontent.com/58846/103443165-527fc080-4c54-11eb-95f1-ee020255cee6.gif" width=150>](https://github.com/mwenge/iridisalpha/tree/master/torus2)[<img src="https://user-images.githubusercontent.com/58846/103442890-dd12f080-4c51-11eb-9a85-46404fbc6849.gif" width=150>](https://github.com/mwenge/iridisalpha/tree/master/iridis_spaceship)[<img src="https://user-images.githubusercontent.com/58846/103455890-eac78500-4ce8-11eb-9d92-867c0c3ea825.gif" width=150>](https://github.com/mwenge/iridisalpha/tree/master/mif)

<br> 
<br> 


## [Gridrunner](https://github.com/mwenge/gridrunner)

[<img src="https://www.mobygames.com/images/covers/l/34991-gridrunner-commodore-64-front-cover.jpg" height=300>](https://github.com/mwenge/gridrunner)[<img src="https://user-images.githubusercontent.com/58846/103443482-9fb16180-4c57-11eb-9403-4968bd16287f.gif" height=300>](https://github.com/mwenge/gridrunner)

- Contains a good overview of [how to go about disassembling a C64 game](https://github.com/mwenge/gridrunner).
- Check out [Gridrunner: The Little Black Book](https://github.com/mwenge/llamaSource/blob/main/GridrunnerTheLittleBlackBook.md), a work in progress discussion of the source code to the full Gridrunner series, including Gridrunner, Matrix, and Voidrunner.
- Links to [a version you can try out in your browser.](https://mwenge.github.io/gridrunner.xyz)
- [A good first pass at diassembling and documenting the source code.](https://github.com/mwenge/gridrunner)

<br> 
<br> 

## [Matrix](https://github.com/mwenge/matrix)
[<img src="https://user-images.githubusercontent.com/58846/102926230-8f95c700-448c-11eb-9895-d1f0827f2aff.png" height=300><img src="https://user-images.githubusercontent.com/58846/103443412-f8342f00-4c56-11eb-8658-065a48b5f8e3.gif" height=300>](https://github.com/mwenge/matrix)

The successor to Gridrunner. Faster, more enoyable. An underrated game.

- Links to [a version you can try out in your browser.](https://mwenge.github.io/matrix.xyz)
- [A good first pass at diassembling and documenting the source code.](https://github.com/mwenge/matrix)

<br> 
<br> 

## [Psychedelia](https://github.com/mwenge/psychedelia)
[<img src="https://user-images.githubusercontent.com/58846/103469199-9e685d80-4d59-11eb-96c8-386b3a530809.png" height=300><img src="https://user-images.githubusercontent.com/58846/103463469-7dd1e080-4d24-11eb-93d2-7673ba031074.gif" height=300>](https://github.com/mwenge/psychedelia)

Minter's first light synthesizer.

- Links to [a version you can try out in your browser.](https://mwenge.github.io/psychedelia)
- [Pretty complete.](https://github.com/mwenge/batalyx) What remains is to dig into the internals of the pattern generation code and unpick how it works.

<br> 
<br> 
## [Hellgate](https://github.com/mwenge/hellgate)
<img src="https://www.mobygames.com/images/covers/l/510954-hellgate-commodore-64-front-cover.jpg" height=300><img src="https://user-images.githubusercontent.com/58846/104652406-f9327b00-56b0-11eb-948b-101ce169ef71.gif" height=300>

One of Minter's later Vic 20 games, this is not very well known and as you can see above is let down by some very mediocre
box cover art. The most striking thing about Hellgate is its innovative gameplay and sheer frenetic pace.

- Links to [a version you can try out in your browser.](https://mwenge.github.io/hellgate)
- [A good first pass at diassembling and documenting the source code.](https://github.com/mwenge/hellgate)

<br> 
<br> 

## [Attack of the Mutant Camels](https://github.com/mwenge/attackofthemutantcamels)
<img src="https://upload.wikimedia.org/wikipedia/en/5/5b/Attack_of_the_Mutant_Camels_Cover_Art.jpg" height=300><img src="http://www.top80sgames.com/site/sites/default/files/images/screens/c64attackmutantcamels2.png" height=300>

- Contains the versions for C64, Atari 8-bit and the unreleased version made for Konix.

<br> 
<br> 

## [Voidrunner](https://github.com/mwenge/voidrunner)

<img src="https://user-images.githubusercontent.com/58846/103489314-9b2daa00-4e0b-11eb-8ba1-3206607f8c19.png" height=300><img src="https://user-images.githubusercontent.com/58846/103489278-4c801000-4e0b-11eb-92e2-db6386d1d4b5.gif" height=300>

Written for the Commodore 16 in 1987, Voidrunner is a continuation of the Gridrunner series. It takes advantage of the extra colors available to the C16 and has rapid gameplay. The disassembly is very clean as there is no compression or copy protection used in the binary. It should be possible to arrive at a very coherent disassembled source file in future work.

- [A good first pass at diassembling and documenting the source code.](https://github.com/mwenge/voidrunner)

<br> 
<br> 

## [Metagalactic Llamas: Battle at the Edge of Time](https://github.com/mwenge/metallama)
<img src="https://www.mobygames.com/images/covers/l/539848-metagalactic-llamas-battle-at-the-edge-of-time-vic-20-front-cover.jpg" height=300><img src="https://user-images.githubusercontent.com/58846/104136780-2b319d80-5390-11eb-8617-89bf4a598ded.gif" height=300>

More manically fast gameplay on the Vic 20. An extremely compact game.

- Links to [a version you can try out in your browser.](https://mwenge.github.io/metallama)
- [Mostly completely commented.](https://github.com/mwenge/metallama) Just some variables left over.

<br> 
<br> 

<<<<<<< HEAD
## [Psychedelia](https://github.com/mwenge/psychedelia)
[<img src="https://user-images.githubusercontent.com/58846/103469199-9e685d80-4d59-11eb-96c8-386b3a530809.png" height=300><img src="https://user-images.githubusercontent.com/58846/103463469-7dd1e080-4d24-11eb-93d2-7673ba031074.gif" height=300>](https://github.com/mwenge/psychedelia)

Minter's first light synthesizer.

- Links to [a version you can try out in your browser.](https://mwenge.github.io/psychedelia)
- [Pretty complete.](https://github.com/mwenge/psychedelia) What remains is to dig into the internals of the pattern generation code and unpick how it works.

<br> 
<br> 
=======
>>>>>>> Update READM

## [Batalyx](https://github.com/mwenge/batalyx)
<img src="http://www.computinghistory.org.uk/userdata/images/large/54/11/product-85411.jpg" height=300><img src="https://i.ytimg.com/vi/4KmcFkCIKCc/hqdefault.jpg" height=300>

A compendium of 5 bizarre sub-games, Batalyx is full of original gameplay and extremely original gameplay ideas.

- Links to [a version you can try out in your browser.](https://batalyx.xyz)
- [First pass, separating code and game data.](https://github.com/mwenge/batalyx)

<br> 
<br> 

## [Sheep in Space](https://github.com/mwenge/sheepinspace)
<img src="https://www.mobygames.com/images/covers/l/672845-sheep-in-space-commodore-64-front-cover.jpg" height=300><img src="https://user-images.githubusercontent.com/58846/104093087-3695a380-5280-11eb-8dfe-9181fd5f5969.gif" height=300>

A sort-of-predecessor to Iridis Alpha with many of the gameplay components present. Overall not a very fun game to play
as it feels comparatively slow compared to other Minger games.

- Links to [a version you can try out in your browser.](https://mwenge.github.io/sheepinspace)
- [First pass, separating code and game data.](https://github.com/mwenge/sheepinspace)

<br> 
<br> 

## [Revenge of the Mutant Camels](https://github.com/mwenge/revengeofthemutantcamels)
<img src="https://upload.wikimedia.org/wikipedia/en/5/50/Revenge_of_the_Mutant_Camels_Coverart.png" height=300><img src="https://user-images.githubusercontent.com/58846/108626235-0e848d00-7447-11eb-869a-ca974b865506.gif" height=300>

- Links to [a version you can try out in your browser.](https://mwenge.github.io/revengeofthemutantcamels)
- [First pass, separating code and game data.](https://github.com/mwenge/revengeofthemutantcamels)

<br> 
<br> 

## [Hover Bovver](https://github.com/mwenge/hoverbovver)
<img src="https://upload.wikimedia.org/wikipedia/en/f/f2/Hover_Bovver_cover.png" height=300><img src="https://user-images.githubusercontent.com/58846/112737654-f1664100-8f53-11eb-87a8-7d099ca455be.png" height=300>

- Links to [a version you can try out in your browser.](https://mwenge.github.io/hoverbovver)
- [First pass, separating code and game data.](https://github.com/mwenge/hoverbovver)

<br> 
<br> 

## [Mama Llama](https://github.com/mwenge/mamallama)
<img src="https://user-images.githubusercontent.com/58846/112850587-0f41bc00-90a2-11eb-8136-6943c4080076.png" height=300><img src="https://llamasoftarchive.org/wp-content/uploads/2017/06/IMG_2446.jpg" height=300>
- Links to [a version you can try out in your browser.](https://mwenge.github.io/mamallama)
- [First pass, separating code and game data.](https://github.com/mwenge/mamallama)

<br> 
<br> 

## [Ancipital](https://github.com/mwenge/ancipital)
<img src="http://www.the-commodore-zone.com/articlelive/content_images/cover_ancipital_minter.jpg" height=300><img src="http://www.simplygames.net/wp-content/uploads/2017/08/Anciptal-screenshot-1.png" height=300>
- Links to [a version you can try out in your browser.](https://mwenge.github.io/ancipital)
- [First pass, separating code and game data.](https://github.com/mwenge/ancipital)

<br> 
<br> 

## [Return of the Mutant Camels](https://github.com/mwenge/returnofthemutantcamels)
<img src="https://user-images.githubusercontent.com/58846/113047803-adfd1400-9199-11eb-8af3-bd1e80b08488.png" height=300><img src="https://www.myabandonware.com/media/screenshots/r/return-of-the-mutant-camels-5qa/return-of-the-mutant-camels_4.png" height=300>
- Links to [a version you can try out in your browser.](https://mwenge.github.io/returnofthemutantcamels)
- [First pass, separating code and game data.](https://github.com/mwenge/returnofthemutantcamels)

[C64 CharSet]:https://www.c64-wiki.com/wiki/Character_set
[CBM Prg Studio]:https://www.ajordison.co.uk/
[6502 tutorial]:https://skilldrick.github.io/easy6502/
[6502 opcodes]:http://www.6502.org/tutorials/6502opcodes.html
[C64 memory map]:https://www.c64-wiki.com/wiki/Memory_Map
[C64 wiki]:https://www.c64-wiki.com/wiki/Memory_Map#Cartridge_ROM
[Infiltrator]:https://csdb.dk/release/?id=100129
[Regenerator]:https://www.c64brain.com/tools/commodore-64-regenerator-1-7/


## What is this?

One by one I'm disassembling some games and programs published for the Commodore 64 by Llamasoft (i.e. Jeff Minter) in the 1980s.

Some of these are relatively straightforward. In such cases I can simply disassemble the code (with a tool such as [Regenerator], split out the characterset and sprite data from the game logic, and recompile to a binary that matches exactly (byte for byte) the original game file. After that, I can start labelling and commenting the code to make explicit the workings of the game.

In other cases, the task isn't so trivial. Larger games such as Batalyx and Iridis Alpha used compression and copy-protection software so it is much harder, and may even be impossible, to produce a disassembled version that compiles a target which will match the original `prg` file. For these guys, I think I'm going to have to work from a snapshot of the game while it's running and just accept that the binary I end up compiling will not be a bytewise match, and may have bugs. If I don't find a way of reverse-engineering the compression and copy-protection that's what I will end up doing, for now.

All of the disassembled games below are a work in progress. At a minimum all compile and run. The work that remains in all cases is to continue improving the comments in the code and figuring out the operation of the routines while assigning labels and variable names that are meaningful. For now, though, my focus is on completing a first pass on as many games as possible. 

## Games

### [Gridrunner](https://github.com/mwenge/gridrunner)

[<img src="https://www.mobygames.com/images/covers/l/34991-gridrunner-commodore-64-front-cover.jpg" height=300>](https://github.com/mwenge/gridrunner)[<img src="https://user-images.githubusercontent.com/58846/103443482-9fb16180-4c57-11eb-9403-4968bd16287f.gif" height=300>](https://github.com/mwenge/gridrunner)

- Contains a good overview of how to go about disassembling a C64 game.
- Links to [a version you can try out in your browser.](https://mwenge.github.io/gridrunner.xyz)
- A good first pass at documenting the source code.

### [Matrix](https://github.com/mwenge/matrix)
[<img src="https://user-images.githubusercontent.com/58846/102926230-8f95c700-448c-11eb-9895-d1f0827f2aff.png" height=300><img src="https://user-images.githubusercontent.com/58846/103443412-f8342f00-4c56-11eb-8658-065a48b5f8e3.gif" height=300>](https://github.com/mwenge/matrix)

The successor to Gridrunner. Faster, more enoyable. An underrated game.

- Links to [a version you can try out in your browser.](https://mwenge.github.io/matrix.xyz)
- First pass, commenting main game loop, character set data.

### [Psychedelia](https://github.com/mwenge/psychedelia)
[<img src="https://user-images.githubusercontent.com/58846/103469199-9e685d80-4d59-11eb-96c8-386b3a530809.png" height=300><img src="https://user-images.githubusercontent.com/58846/103463469-7dd1e080-4d24-11eb-93d2-7673ba031074.gif" height=300>](https://github.com/mwenge/psychedelia)

Minter's first light synthesizer.

- Links to [a version you can try out in your browser.](https://mwenge.github.io/psychedelia)
- First pass, separating code and game data.

### [Iridis Alpha](https://github.com/mwenge/iridisalpha)
[<img src="https://www.c64-wiki.com/images/a/a2/Iridisalphacover.jpg" height=300><img src="https://user-images.githubusercontent.com/58846/103442991-ae494a00-4c52-11eb-9432-0f6ed61d3a5a.gif" height=300>](https://github.com/mwenge/iridisalpha)

Minter's magnum opus.

- Links to [a version you can try out in your browser.](https://iridisalpha.xyz)

The page also contains disassemblies and playable versions of the numerous demos Minter wrote preparing Iridis Alpha.

[<img src="https://user-images.githubusercontent.com/58846/103443219-cfab3580-4c54-11eb-8046-0f5f3bac9c79.gif" width=300>](https://github.com/mwenge/iridisalpha/tree/master/dna)[<img src="https://user-images.githubusercontent.com/58846/103443189-80650500-4c54-11eb-9a32-5b14fb383ca1.gif" width=300>](https://github.com/mwenge/iridisalpha/tree/master/torus)

[<img src="https://user-images.githubusercontent.com/58846/103443165-527fc080-4c54-11eb-95f1-ee020255cee6.gif" width=300>](https://github.com/mwenge/iridisalpha/tree/master/torus2)[<img src="https://user-images.githubusercontent.com/58846/103442890-dd12f080-4c51-11eb-9a85-46404fbc6849.gif" width=300>](https://github.com/mwenge/iridisalpha/tree/master/iridis_spaceship)

[<img src="https://user-images.githubusercontent.com/58846/103455890-eac78500-4ce8-11eb-9d92-867c0c3ea825.gif" width=500>](https://github.com/mwenge/iridisalpha/tree/master/mif)


[C64 CharSet]:https://www.c64-wiki.com/wiki/Character_set
[CBM Prg Studio]:https://www.ajordison.co.uk/
[6502 tutorial]:https://skilldrick.github.io/easy6502/
[6502 opcodes]:http://www.6502.org/tutorials/6502opcodes.html
[C64 memory map]:https://www.c64-wiki.com/wiki/Memory_Map
[C64 wiki]:https://www.c64-wiki.com/wiki/Memory_Map#Cartridge_ROM
[Infiltrator]:https://csdb.dk/release/?id=100129
[Regenerator]:https://www.c64brain.com/tools/commodore-64-regenerator-1-7/


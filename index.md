## What is this about?

One by one I'm disassembling some games and programs published for the Commodore 64 by Llamasoft (i.e. Jeff Minter) in the 1980s.

Some of these are relatively straightforward. In such cases I can simply disassemble the code (with a tool such as [Regenerator], split out the characterset and sprite data from the game logic, and recompile to a binary that matches exactly (byte for byte) the original game file. After that, I can start labelling and commenting the code to make explicit the workings of the game.

In other cases, the task isn't so trivial. Larger games such as Batalyx and Iridis Alpha used compression and copy-protection software so it is much harder, and may even be impossible, to produce a disassembled version that compiles a target which will match the original `prg` file. For these guys, I think I'm going to have to work from a snapshot of the game while it's running and just accept that the binary I end up compiling will not be a bytewise match, and may have bugs. If I don't find a way of reverse-engineering the compression and copy-protection that's what I will end up doing, for now.

All of the disassembled games below are a work in progress. At a minimum all compile and run. The work that remains in all cases is to continue improving the comments in the code and figuring out the operation of the routines, assigning labels and variable names that are meaningful. For now, though, my focus is on completing a first pass on many games as possible. 

## Games

### [Gridrunner](https://github.com/mwenge/gridrunner)

<img src="https://www.mobygames.com/images/covers/l/34991-gridrunner-commodore-64-front-cover.jpg" height=300><img src="https://user-images.githubusercontent.com/58846/103443482-9fb16180-4c57-11eb-9403-4968bd16287f.gif" height=300>

- Contains a good overview of how to go about disassembling a C64 game.
- Links to a version you can try out in your browser.
- A good first pass at documenting the source code.

### [Matrix](https://github.com/mwenge/matrix)
The successor to Gridrunner. Faster, more enoyable. An underrated game.
<img src="https://user-images.githubusercontent.com/58846/102926230-8f95c700-448c-11eb-9895-d1f0827f2aff.png" height=300><img src="https://user-images.githubusercontent.com/58846/103443412-f8342f00-4c56-11eb-8658-065a48b5f8e3.gif" height=300>

- Links to a version you can try out in your browser.
- First pass, commenting main game loop, character set data.

### [Psychedelia](https://github.com/mwenge/psychedelia)
Minter's first light synthesizer.
<img src="https://user-images.githubusercontent.com/58846/103463469-7dd1e080-4d24-11eb-93d2-7673ba031074.gif" width=500>

- Links to a version you can try out in your browser.
- First pass, separating code and game data.




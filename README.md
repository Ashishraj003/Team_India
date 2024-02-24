# READ ME
## Minutes Meetings
**Date: $23^{rd}$ Feburary**
**Members : Anuj Sharma , Ashish Raj , Veerain Sood**
**Decisions** : Finalizing the project... 

**Date: $22^{nd}$ Feburary**
**Members : Anuj Sharma , Ashish Raj , Veerain Sood**
**Decisions** : Fixed Labels and Memory output not being shown... added red bar at each instuction being processed
Added functions to get value from editor 1 and editor 2 and stored them in "Instructions1" and "Instructions2" resp after compiling .data part 


**Date: $21^{st}$ Feburary**
**Members : Anuj Sharma , Ashish Raj , Veerain Sood**
**Decisions** : Debugging core class, and adding memory ,
adding styles to the memory.. 
Veerain and Anuj did Debugging of Core and Processor.
and Ashish was fixing front end display..
added registers to each core
added registers to front end and button to switch between core 1 register and core 2 register.

**Date: $19^{th}$ Feburary**
**Members : Anuj Sharma , Ashish Raj , Veerain Sood**
**Decisions** : Creation of Core class + decesion of creating 1024 blocks of memory (each 4bytes...).

**Date: $17^{th}$ Feburary**
**Members : Anuj Sharma , Ashish Raj , Veerain Sood**
**Decisions** : Decided on creating a processor class which will contain 2 cores. Each core will have its own 32 (4 byte each registers)... Added instruction class and parsing of each instruction to it.

**Date: $14^{th}$ Feburary**
**Members : Anuj Sharma , Ashish Raj , Veerain Sood**
**Decisions** : 
Added editors to the front end and designed + decorated frontend.

**Date: $10^{th}$ Feburary**
**Members : Anuj Sharma , Ashish Raj , Veerain Sood**
**Decisions** : 
Started Fronted and added backbone to the project. Decided to create classes as: 
* Processor
    * It will contain 2 core objects and common memory will be stored here
* Core
    * will contain its own 32 registers and will execute instruction objects passed to it by get and Set bus from processor.
    * each core has its own pc which will incremented when we push some button or click play....
    
* Editor
* Instructions
     * Parsing Happens here
     * all instructions will be stored as instruction objects...
    * Decided that we will support these instructions...,srli ,and ,add ,sub ,addi ,lw ,sw ,la ,li ,beq ,bne ,bgt ,blt ,bgeu ,bltu ,jalr ,jal  ,j ,jr






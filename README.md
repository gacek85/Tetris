JavaScript Tetris
====

This is a simple JavaScript implementation of popular brick game Tetris. The structure
of the app is flexible, contains several lossly coupled and reuseable components:


- Matrix tools (2D matrix representation, factory, transformer, moves, collisions detector, jQuery based stage renderer, position manager<!--Please, refactor me!!-->, lines detector, score counter, bricks provider)
- Event Dispatcher (Simple but useable) - the central point of the application


The main file and the renderer is currently based on jQuery, but the renderer component may easily be replaced by any other renderer.


The app contains pretty ugly styling, but it does the job.
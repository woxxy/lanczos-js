lanczos.js aka the death of a dream
===================================

Want to wait 7 seconds for an image to display? Then, go on. My only happiness, is that I learned Webworkers (thought it was a bigger deal) and Canvas (thought this would be easier...).
If one day I will get the time, I'll go reading some lanczos stuff and improve this webworker (that, between, sucks).

May at least the appearing image of Nagi-sama bring you joy, if you're the unlucky guy who decides to test this out.

----

This is an experiment to bring the lanczos3 algorithm to JavaScript with some decent performance, using the code provided in the [StackOverflow thread](http://stackoverflow.com/questions/2303690/resizing-an-image-in-an-html5-canvas), with some changes to try improving performance - and they did improve, but not enough.

I was just checking if there's any performance gain from using webworkers, but it seems more like an attempt to heat my legs even faster than without the multithreading.
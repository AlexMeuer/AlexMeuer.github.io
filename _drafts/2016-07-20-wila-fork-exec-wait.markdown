---
layout: post
title:  "What I learned about: fork(), exec(), wait()"
date:   2016-07-20 14:34:20 +0000
excerpt_separator: <!-- excerpt -->
---
<script type="text/javascript" src="{{ "/js/shBrushCpp.js" | prepend: site.baseurl }}"></script>I've been coding some pretty nifty stuff at work and one of the newest things I've had to learn was [fork()][man-fork], [exec()][man-exec] and [wait()][man-wait]. These are linux-specific C functions centered around creating and working with multiple processes. I'll give a super quick overview and what each on does, in case it's not totally obvious:

###Fork() :fork_and_knife:

`Fork()` creates a new instance of the calling program. It makes an exact duplicate: both programs continue on from the fork command. It's a pretty quick operation, the memory for the new process is _copy-on-write_ so there's no huge wait as all the momory is duplicated. `Fork()` returns 0 on the child process and the child process' pid on the original process, making it trivial to decide which code to run on each.

###Exec() :arrow_forward:

`Exec()` replaces the current process with the one passed to it. It's often used in tandem with `fork()` in order to create a new process without replacing the old one. i.e. The program forks, the child calls `exec()` and the parent continues on as usual. It's a really neat way of doing it.

###Wait() :hourglass:

`Wait()` is where is gets interesting; it blocks until the state of a child process changes.

[man-fork]: http://linux.die.net/man/3/fork
[man-exec]: http://linux.die.net/man/3/exec
[man-wait]: http://linux.die.net/man/3/wait

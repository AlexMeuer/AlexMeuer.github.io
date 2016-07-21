---
layout: post
title:  "What I learned about: fork(), exec(), wait()"
date:   2016-07-20 14:34:20 +0000
excerpt_separator: <!-- excerpt -->
---
<script type="text/javascript" src="{{ "/js/shBrushCpp.js" | prepend: site.baseurl }}"></script>I've been coding some pretty nifty stuff at work and one of the newest things I've learned is [fork()][man-fork], [exec()][man-exec] and [wait()][man-wait].<!-- excerpt --> These are linux-specific C functions centered around creating and working with multiple processes. I'll give a super quick overview and what each on does, in case it's not totally obvious:

<h3>Fork() :fork_and_knife:</h3>

`Fork()` creates a new instance of the calling program. It makes an exact duplicate: both programs continue on from the fork command. It's a pretty quick operation, the memory for the new process is _copy-on-write_ so there's no huge wait as all the momory is duplicated. `Fork()` returns 0 on the child process and the child process' pid on the original process, making it trivial to decide which code to run on each.  
For example:  
<pre class="brush: c;">
pid_t cpid = fork();
if(-1 == cpid) {
    // An error occurred. The fork failed.
}
else if (0 == cpid) {
    // This code will be executed by the child process.
}
else {
    // This code will be executed by the parent process.
}
</pre>

<h3>Exec() :arrow_forward:</h3>

`Exec()` replaces the current process with the one passed to it. It's often used in tandem with `fork()` in order to create a new process without replacing the old one. i.e. The program forks, the child calls `exec()` and the parent continues on as usual. It's a really neat way of doing it.  
Building on the previous example:  
<pre class="brush: c;">
pid_t cpid = fork();
if(-1 == cpid) {
    // An error occurred. The fork failed.
}
else if (0 == cpid) {
    // This code will be executed by the child process.
    execv("path/to/another/executable", argv);
    // execv() is only one of the small family of exec commands.
    // I find it the simplest to use.
    // You just pass the file to be executed and the command line args you want.
    // Remember: exec REPLACES the current process.
}
else {
    // This code will be executed by the parent process.
}
</pre>

<h3>Wait() :hourglass:</h3>

`Wait()` (and `waitpid()`) is where is gets interesting; it blocks until the state of a child process changes. It's really useful for monitoring a child process and can be used to tell if it exited abnormaly. Don't let the macros scare you; they're specific to wait/waitpid and are used to interpret the status variable. Quite straightforward really.  
The following code waits for the child process to change state and can react accordingly:  
<pre class="brush: c;">
pid_t cpid = fork();
if(-1 == cpid) {
    // An error occurred. The fork failed.
}
else if (0 == cpid) {
    // This code will be executed by the child process.
    execv("path/to/another/executable", argv);
    // execv() is only one of the small family of exec commands.
    // I find it the simplest to use.
    // You just pass the file to be executed and the command line args you want.
    // Remember: exec REPLACES the current process.
}
else {
    // This code will be executed by the parent process.

    int status; // The status code of the program after wait.

    do {
        // Wait until the state of the child process has changed.
        pid_t w = waitpid(cpid, &status, WUNTRACED | WCONTINUED);
        if (-1 == w) {
            // An error occurred. Waiting failed.
        }

        // The status changed, let's inspect it!
       if (WIFEXITED(status)) {

            // Program called exit() or returned from main.
            fprintf(stdout, "SiegeWaiter: siege exited, status=%d\n", WEXITSTATUS(status));

        } else if (WIFSIGNALED(status)) {

            // Program killed a signal (e.g. SIGSEGV or SIGKILL)
            fprintf(stdout, "SiegeWaiter: siege killed by signal %d\n", WTERMSIG(status));

        } else if (WIFSTOPPED(status)) {

            // The program was halted by a signal.
            fprintf(stdout, "SiegeWaiter: siege stopped by signal %d\n", WSTOPSIG(status));

        } else if (WIFCONTINUED(status)) {

            // The program continued after halting. (SIGCONT)
        }
    } while (!WIFEXITED(status) && !WIFSIGNALED(status));
    // Keep waiting until the program has exited/terminated.
}
</pre>  

That's it. It's not massively complicated and it's pretty powerful: a handy addition to a programmer's toolkit.

[man-fork]: http://linux.die.net/man/3/fork
[man-exec]: http://linux.die.net/man/3/exec
[man-wait]: http://linux.die.net/man/3/wait

---
layout: post
title:  "C++ Bounded Buffer Tutorial"
date:   2016-07-12 14:34:20 +0000
excerpt_separator: <!-- excerpt -->
---
In my last year of college we had a lab in which we were tasked to implement a bounded buffer. We had eight hours (4 x 2hr labs) but I actually completed it in the first lab, having used Boost before (we were tasked with using Boost for simplicity and ease of use) and having a prior interest in multithreading.

The bounded buffer is a fantastic tool for producer/consumer scenarios. My lab implementation of the bounded buffer showed how it could be used to implement a message queue, where some threads push notifications into the buffer and another thread pops them out and draws them to the screen. You can find the source for my Bounded Buffer Monitor lab [here][lab-repo].

__Anyways, enough waffle, time to program a bounded buffer!__

{% highlight C++ %}
#ifndef BOUNDED_BUFFER_H
#define BOUNDED_BUFFER_H

#include <vector>
#include <condition_variable>

/*
 *
 */
#endif // BOUNDED_BUFFER_H
{% endhighlight %}

[lab-repo]: https://github.com/AlexMeuer/BoundedBufferMonitor

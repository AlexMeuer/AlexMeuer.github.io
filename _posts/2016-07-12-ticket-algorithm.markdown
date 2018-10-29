---
layout: post
title:  "C++ Ticket Algorithm"
date:   2016-07-12 07:46:33 +0000
category: Tutorials
excerpt_separator: <!-- excerpt -->
---
This is a basic implementation of the ticket algorithm for multithreading in C++.<!-- excerpt --><br>
I mean it when I say basic, I programmed this in a single lab for _Software Engineering for Games_. It had to satisfy a strict layout and rubric so it's not the nicest looking code but it shouldn't prove difficult to read or understand (it also may not be 100% perfect, but I got full marks for it).<br>
The ticket algorithm aims to solve the problem of starvation: when one thread has to wait for ages before it is let acquire the mutex, while another thread (or multiple other threads) might be acquiring it over and over in the mean time. This can be detrimental to your program, you never want to starve out a thread. This algorithm works like a butcher shop or Argos: customers take a ticket and wait for their number to be called. This ensures that everyone gets served in the order they arrive (thus preventing any customer from being ignored in the corner).
{% highlight C++ %}
#include <iostream>
#include <atomic>
#include <thread>
#include <mutex>
#include <sstream>

using namespace std;

const int n = 10;
atomic_int _number;
atomic_int _next;
atomic_int _turn[n];
int numThreads;
mutex coutMutex;

ostringstream data;

void func() {
    int i = numThreads++;  //Intentional post-increment

    coutMutex.lock();
    cout << "Thread " << i << " reporting in." << endl;
    coutMutex.unlock();

    this_thread::sleep_for(chrono::milliseconds(rand() % 500 + 500));

    while (true)
    {
        //Take a ticket
        _turn[i] = _number.fetch_add(1);

        //Using a mutex for output so that threads don't uppercut each other on the console.
        coutMutex.lock();
        cout << "t" << i << "\tturn: " << _turn[i] << endl;
        coutMutex.unlock();

        //Slow down the program so that we can read the console.
        this_thread::sleep_for(chrono::milliseconds(rand() % 500 + 500));

        while (_turn[i] != _next)
        {
        	continue;
        }

        coutMutex.lock();
        cout << "t" << i << "\t+CS" << endl;
        coutMutex.unlock();

        //critical section
        data << " data_t" << i;

        //exit protocol
        _next += 1;

        coutMutex.lock();
        cout << data.str() << endl;
        cout << "t" << i << "\tnext = " << _next << endl;
        coutMutex.unlock();
    }
}


int _tmain(int argc, _TCHAR* argv[])
{
    srand(time(NULL));

    data = ostringstream();

    numThreads = 0;
    _number = 1;
    _next = 1;
    for (int i = 0; i < n; i++)
    {
        _turn[i] = 0;
    }

    thread t1 = thread(func);
    thread t2 = thread(func);
    //thread t3 = thread(func);  //Add as many threads as you like
    //thread t4 = thread(func);
    //thread t5 = thread(func);

    t1.join();
    t2.join();
    //t3.join();
    //t4.join();
    //t5.join();

    return 0;
}
{% endhighlight %}

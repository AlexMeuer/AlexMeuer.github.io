---
layout: post
title:  "Easy Boost install for Visual Studio"
date:   2016-07-12 12:33:12 +0000
category: Tutorial
featured_image: '/assets/posts/boost.png'
---
I wrote this ages ago when my fellow classmates were having trouble installing the Boost C++ library for college. It's just a little interactive batch script to make the process stress-free.<!-- excerpt -->
Currently I only have a script for Windows (Visual Studio) users but I may end up expanding it to cover other IDEs or (more likely) writing a bash script to cover Ubuntu (now my primary os).

The majority of my classmates had both VS2013 and VS2015 installed, so the script holds the user's hand through picking a toolset (Boost install will default to VS2015 toolset which means that trying to use it with VS2013 causes headaches). Apart from that, all it really does is run the two boost install scripts in the right order.

Follow these steps and you'll have boost in no time:  
 - [Download Boost][boost-dl] and extract it to wherever you want.  
 - Drop <a href="{{ mysite.url }}/assets/posts/boost_installer.bat" download>boost_installer.bat</a> into the Boost folder.  
 - Run the script!  
 - Win!  

The script is [hosted as a gist][gh-batch-link], so if you feel the urge to <s>fix it</s> <s>make it better</s> contribute you can be my guest.

Here's the contents of the batch file for your perusal:
<script src="https://gist.github.com/AlexMeuer/8f09d9c7fe56c0d4260d31f7eb9a4808.js"></script>

[boost-dl]: http://www.boost.org/users/download/
[gh-batch-link]: https://gist.github.com/AlexMeuer/8f09d9c7fe56c0d4260d31f7eb9a4808

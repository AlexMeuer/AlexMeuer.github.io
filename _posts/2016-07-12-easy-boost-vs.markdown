---
layout: post
title:  "Easy Boost install for Visual Studio"
date:   2016-07-12 12:33:12 +0000
catagories: programming
excerpt_separator: <!-- excerpt -->
---
<script type="text/javascript" src="{{ "/js/shBrushBash.js" | prepend: site.baseurl }}"></script>I wrote this ages ago when my fellow classmates were having trouble installing the Boost C++ library for college. It's just a little interactive batch script to make the process stress-free.<!-- excerpt -->
Currently I only have a script for Windows (Visual Studio) users but I may end up expanding it to cover other IDEs or (more likely) writing a bash script to cover Ubuntu (now my primary os).

The majority of my classmates had both VS2013 and VS2015 installed, so the script holds the user's hand through picking a toolset (Boost install will default to VS2015 toolset which means that trying to use it with VS2013 causes headaches). Apart from that, all it really does is run the two boost install scripts in the right order.

Follow these steps and you'll have boost in no time:  
 - [Download Boost][boost-dl] and extract it to wherever you want.  
 - Drop <a href="{{ mysite.url }}/assets/boost_installer.bat" download>boost_installer.bat</a> into the Boost folder.  
 - Run the script!  
 - Win!  

Here's the [checksums][gh-batch-checksums] for `boost_intaller.bat`:  
__md5:__ `3d6282fee61eabd3783caf2af5d3ec69`  
__sha1:__ `964bde0c2e7c5f7d438094680c1da09ab8e9f87c`  
If your batch file doesn't match these then __don't run it!__  
The script is [hosted on Github][gh-batch-link] as part of this website, so if you feel the urge to contribute you can be my guest.

Here's the contents of the batch file for your perusal:
<pre class="brush: bash">
@echo off
title Boost Installer --- C00165681 v1.0
color a
echo Copyright (c) 2016 Alexander Meuer
echo.
echo Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
echo.
echo The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
echo.
echo THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
echo.
echo oooooooooo.    .oooooo.     .oooooo.    .oooooo..o ooooooooooooo
echo `888'   `Y8b  d8P'  `Y8b   d8P'  `Y8b  d8P'    `Y8 8'   888   `8
echo  888     888 888      888 888      888 Y88bo.           888
echo  888oooo888' 888      888 888      888  `"Y8888o.       888
echo  888    `88b 888      888 888      888      `"Y88b      888
echo  888    .88P `88b    d88' `88b    d88' oo     .d8P      888
echo o888bood8P'   `Y8bood8P'   `Y8bood8P'  8""88888P'      o888o
echo.
echo.
echo ooooo                          .             oooo  oooo
echo `888'                        .o8             `888  `888
echo  888  ooo. .oo.    .oooo.o .o888oo  .oooo.    888   888   .ooooo.  oooo d8b
echo  888  `888P"Y88b  d88(  "8   888   `P  )88b   888   888  d88' `88b `888""8P
echo  888   888   888  `"Y88b.    888    .oP"888   888   888  888ooo888  888
echo  888   888   888  o.  )88b   888 . d8(  888   888   888  888    .o  888
echo o888o o888o o888o 8""888P'   "888" `Y888""8o o888o o888o `Y8bod8P' d888b
echo.
pause
echo Searching for boost files...
IF NOT EXIST bootstrap.bat GOTO noStrap
cls
call bootstrap
cls
:ts_select
title Toolset Select
color e
echo.
set TOOLSET_VER="msvc-14.0"
set /p vs_ver=Do you want boost for VS2013 or VS2015? (13\15) ['?' for help]
if %vs_ver%==13 set TOOLSET_VER="msvc-12.0"
if %vs_ver%==? goto tsHelp
echo.
echo Toolset set to: %TOOLSET_VER%
timeout 5
color a
call .\b2 toolset=%TOOLSET_VER%
color e
title Boost Installer --- C00165681 --- DONE!
echo.
echo Batch written by Alexander Meuer (C00165681/NotOnFire)
echo AlexMeuer.github.io
timeout 60
exit
:tsHelp
echo I'm asking you to pick a toolset version. You can change the toolset your using in the project settings in Visual Studio.
echo.
echo By default, VS2013 uses msvc-12.0 and VS2015 uses msvc-14.0
echo.
echo If you use both, just set the platform-toolset in your project to use version 12.
echo.
echo If you mix toolsets, you're gonna have a bad time, mmkay?
echo.
pause
goto ts_select
:noStrap
cls
color c
title Couldn't find bootstrap!
echo Couldn't find bootstrap.
echo.
echo Are you sure this file is in the right place?
echo Current directory: %CD%
echo.
pause
</pre>

[boost-dl]: http://www.boost.org/users/download/
[gh-batch-checksums]: https://github.com/AlexMeuer/AlexMeuer.github.io/blob/master/assets/checksums
[gh-batch-link]: https://github.com/AlexMeuer/AlexMeuer.github.io/blob/master/assets/boost_intaller.bat

@echo off
title Boost Installer --- C00165681
color a
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
echo.
echo Searching for boost files...
IF NOT EXIST bootstrap.bat GOTO noStrap
cls
call bootstrap
cls
title Done bootstrapping --- Ready to bjam!
echo Bootstrapping done!
echo.
echo Ready to jam!
echo.
color e
timeout 10
cls
color a
call .\b2
cls
title Boost Installer --- C00165681
color c
echo.
echo.
echo IMPORTANT!
echo Setting Environment Variable BOOST_ROOT
echo.
echo Setting BOOST_ROOT to %CD%
echo.
timeout 10
setx -m BOOST_ROOT %CD%
color e
cls
title Boost Installer --- C00165681 --- DONE!
echo oooooooooo.                                   
echo `888'   `Y8b                                  
echo  888      888  .ooooo.  ooo. .oo.    .ooooo.  
echo  888      888 d88' `88b `888P"Y88b  d88' `88b 
echo  888      888 888   888  888   888  888ooo888 
echo  888     d88' 888   888  888   888  888    .o 
echo o888bood8P'   `Y8bod8P' o888o o888o `Y8bod8P'
echo.
echo. Written by Alexander Meuer (C00165681/NotOnFire)
echo. Not0nFire.github.io
timeout 60
exit
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
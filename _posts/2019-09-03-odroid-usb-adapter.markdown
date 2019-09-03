---
layout: post
title:  "Odroid and the usb-ethernet adapter"
subtitle: "Adventures in building from source"
date:   2019-09-03 07:17:00 +0000
category: Tutorial
featured_image: '/assets/posts/hacker.jpg'
description: 'So you want a single board computer with 2 ethernet connections, do ya?<br>Time to hack the kernel then, I guess.'
---
Following on from my post about [fabricating a poor network][fabricating-a-poor-network-post], I needed to connect a second ethernet cable to my device so that I could set up a rig to test peer-to-peer connections over varying network qualities. However, I wasn't using a Raspberry PI anymore, I was using an [Odroid XU4][odroid-xu4] and a UGREEN brand [usb-to-ethernet adapter][ugreen-adapter]. If you thought you could just plug the adapter into the usb port of the Odroid then you are in for a shock; **It's time to modify the kernel.**

---

We have to download and build the Linux drivers from source. However, first we need to obtain and build the source for the kernel.

Sidenote: If you're _not_ on an Odroid you can most likely just `sudo apt install linux-headers linux-source` and skip the step of building the Odroid source.

---

# Obtaining the kernel source

We're going to need install build tools/dependencies:  
```
sudo apt install git gcc g++ build-essential libssl-dev bc
```

Next, leave the driver folders and clone the Odroid source repo for our version. The repo will, by default, be called `linux`, feel free to name it something else as when we extract the usb-ethernet adapter drivers later, they'll extract into a folder called `Linux` (capitalised).
```
git clone --depth 1 https://github.com/hardkernel/linux -b odroidxu4-4.14.y
```
---

# Building and installing the kernel
As part of this, the kernel running on the Odroid will be upgraded, this is a good thing.
```
# Generate build config, takes a couple seconds
make odroidxu4_defconfig
# Build the kernel, takes 20-25 minutes
make -j8
# These all upgrade the kernel. Doesn't take long. Don't skip these.
make modules_install
sudo cp -f arch/arm/boot/zImage /media/boot
sudo cp -f arch/arm/boot/zImage /media/boot
sudo cp -f arch/arm/boot/dts/exynos5422-odroidxu3.dtb /media/boot
sudo cp -f arch/arm/boot/dts/exynos5422-odroidxu4.dtb /media/boot
sudo cp -f arch/arm/boot/dts/exynos5422-odroidxu3-lite.dtb /media/boot
```
If you get any popups during the process (i.e. warning you about the kernel) just say ok and continue. We know we're messing with the kernel here.  
Flush any pending disk writes and reboot the Odroid:
```
sync
sudo reboot
```
Running `uname -r` should now reveal that we're running kernel version `4.14.111` or higher.

---

# Building the UGREEN adapter driver

Download the driver.

 - For the adapter I used: https://www.ugreen.com/upload/file/AX88772A_Linux.zip.
 - For other models, look [here](https://www.ugreen.com/drivers/).

Extract the contents onto the Odroid. Inside the newly extracted folder ("`Linux`"), there will be two tarballs. One is for older kernels and the other for newer kernels. Go ahead and unzip the one for newer kernels:  
```
tar zxvf AX88772C_772B_772A_760_772_178_LINUX_DRIVER_v4.20.0_Source.tar.gz
```

`cd` into the new directory and build the driver:
```
make
sudo make install
```
Mount the driver with
```
sudo modprobe asix
```
and you're good to go!

[fabricating-a-poor-network-post]: {% post_url 2019-03-01-fabricating-a-poor-network %}
[odroid-xu4]: https://www.odroid.co.uk/hardkernel-odroid-xu4
[ugreen-adapter]: https://www.amazon.co.uk/dp/B00MYT481C/ref=psdc_4913457031_t2_B00MYTSN18
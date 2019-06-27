---
layout: post
title:  "Fabricating a poor network"
subtitle: "aka Bullying your devices"
date:   2019-03-02 18:34:00 +0000
category: Tutorial
featured_image: '/assets/posts/fab-net-photo.jpg'
description: 'How to throttle the life out of a network bridge:<br>Emulating wide area network delays and generally crippling a network.'
---
{% comment %}
  TODO: Anchor links
  TODO: Maybe include a section or something about compiling the usb-ethernet adapter drivers from source for the Pi?
 - Hardware Setup
 - Bridging the connection
 - Making the network slow and/or unreliable
   - Adding a fixed delay
   - Adding a delay that's closer to real life
   - Dropping packets
   - Duplicating packets
   - Corrupting packets
   - Re-ordering packets
   - Putting it all together
   - Clearing all previously set rules
 - Controlling the traffic via internet browser
 - References
 {% endcomment %}
 Perhaps, like me, you've got a cool peer-to-peer (P2P) game and you want to test it. _Great!_ However, because it's P2P, there's no middleman server that you can use to throttle traffic between the test devices. _Oh no! What do we do!?_

 Well, we could use `tc` (traffic control) on our (maybe, linux) router to slow down the traffic, but that's the router we use to access the internet; it's a no go.

 **Eureka!** We set up a second access point and use a Raspberry Pi or other linux machine to bridge it to our router. We can then use `tc` to control traffic moving through the Pi and, therefore, all traffic in and out of the access point. _Genius_.

 [td;dr][alexmeuer-tcgui]

# Hardware Setup
You will need:

 - Router
 - Access Point
 - 2 ethernet cables
 - Raspberry Pi (actually, any Debian machine ought to work; _heck_, almost any _Linux_ machine ought to work)

Connect everything together with the ethernet cables:

![][diagram]

I used a TP-LINK travel router, set-up in Access Point mode.

# Bridging the connection

SSH into, or otherwise gain terminal access to, the debian machine.

If you know the mac address (Raspberry Pi mac addresses start with `b8:27:eb`) but the ip address is unknown, you can find it by running `arp -a` in any unix terminal. This will show a map of mac addresses to their respective ip addresses.

Install `bridge-utils`; can't bridge anything without these.

Double check the interfaces you'll be bridging. They'll most likely be eth0 and eth1, and this is how they'll be referred to from here on.

Check the interfaces with: `ip addr show`

Create the new bridge interface and add the interfaces to be bridged. br0 is the name of our new bridge interface. The ordering of `eth0` and `eth1` doesn't matter, the bridge id bi-directional.

 - `brctl addbr br0`
 - `brctl addif br0 eth0 eth1`

Set up the bridge in `/etc/network/interfaces`. Use your editor of choice.

```bash
# The loopback network interface
auto lo
iface lo inet loopback

# These interfaces will be set up by our bridge.
iface eth0 inet manual
iface eth1 inet manual

# Bridge setup
#    'auto' will cause the interface to be brought up at boot.
#    If you omit this, use `ifup br0` to bring up the bridge.
auto br0
iface br0 inet static
    bridge_ports eth0 eth1
    # Set a static ip address for our Debian machine.
    address 10.0.0.100
    broadcast 10.0.0.255
    netmask 255.255.255.0
    gateway 10.0.0.1
```

Reboot.

Connecting to the access point should now be indistinguishable from connecting directly to the router.

# Making the network slow and/or unreliable

The Linux kernel has built-in traffic control, which we can use to delay, drop, corrupt and re-order packets. The command for this is tc.

The commands in this section will affect all traffic on the given interfaces, this includes your ssh session.

## Adding a fixed delay

`tc qdisc add dev eth0 root netem delay 100ms`

The `add` in this commands is adding a rule to the specified interface (`eth0`). This command will slow all outgoing traffic on `eth0`. We can run the command again for `eth1` to slow traffic leaving that interface too. This way, we will have achieved delaying traffic going both ways.

## Adding a delay that's closer to real life

So we've added a fixed delay (and tested it, I hope!), but that's not representative of how a real connection works. We can change the rule to use a range and a non-uniform distribution:

`tc qdisc change dev eth0 root netem delay 100ms 20 ms distribution normal`

This will add a delay of 100ms ± 20ms with a distribution that is closer to how delays occur in real life. Other valid distributions are `pareto` and `paretonormal`.

## Dropping packets

We can specify a number of packets to drop and we can supply or omit a correlation. Adding a correlation with cause it to be less random and emulate packet burst losses.

`tc qdisc change dev eth0 root netem loss 0.3% 25%`

This will cause 3% of packets to be lost, and each successive probability depends by 25% on the last one.

## Duplicating packets

Duplicating is as simple as providing a percentage:

`tc qdisc change dev eth0 root netem duplicate 1%`

## Corrupting packets

Similar to duplication, we need only supply a percentage:

`tc qdisc change dev eth0 root netem corrupt 0.1%`

Corruption introduces a single bit error at a random offset in the packet.

## Re-ordering packets

Reorder needs to be used in tandem with a delay rule. Also, if using a delay with a ± variance, then that could cause re-ordering due to different delay times.

`tc qdisc change dev eth0 root netem delay 10ms reorder 25% 50%`

The above command will cause 25% of packets (with a correlation of 50%) to be sent immediately, others will simply be delayed.

Try not to mix forms of reordering.

## Putting it all together

So far, each of our commands has overwritten the previous traffic control rule on the interface, but what if we want to delay, re-order, drop, duplicate _and_ corrupt packets?

`tc qdisc change dev eth0 root netem delay 100ms 20ms distribution normal loss 0.3% 25% duplicate 1% corrupt 0.1% reorder 25% 50%``

The above command will delay, drop, duplicate, corrupt and re-order packets.

## Clearing all previously set rules

You'll likely want to undo your changes at some point. You can simply reboot the machine or run:

`tc qdisc del dev eth0 root`



Be careful not to make the network completely unusable as you'll lose your ssh connection and be forced to reboot or log into the machine directly to change the rules back.

## Controlling the traffic via internet browser

tcgui is a Python-based web-gui for `tc`.

~~[tum-lkn/tcgui][tum-lkn-tcgui] is the root repo but doesn't support delay variance, nor correlation on loss or reordering. (Although there is a pull request for this: https://github.com/tum-lkn/tcgui/pull/2)~~ **UPDATE:** Pull request was merged, both repos now support variance and correlation.

[AlexMeuer/tcgui][alexmeuer-tcgui] (a fork) also supports delay correlation, a feature that was added after the above-mentioned PR was merged.

To feel the ~~wrath~~ effects of the traffic controller, simply connect to the access point and twiddle with the rules.

The same warning for the commands above also applies to the web-gui.



# References

**Bridging:** https://wiki.debian.org/BridgeNetworkConnections

**Traffic Control:** https://wiki.linuxfoundation.org/networking/netem

**tc man page:** https://linux.die.net/man/8/tc

[diagram]: /assets/posts/fab-net-delays-diag.png
[tum-lkn-tcgui]: https://github.com/tum-lkn/tcgui
[alexmeuer-tcgui]: https://github.com/AlexMeuer/tcgui

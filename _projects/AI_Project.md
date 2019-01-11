---
layout: post
title: Ai Project
permalink: /ArnieBoids/
doxylink: http://shovelware.github.io/arnieboids
featured_image: 'https://img.itch.zone/aW1hZ2UvMjI0Mjg4LzEwNTkzMzMucG5n/315x250%23c/%2F%2BLdqw.png'
description: "A top-down shooter showcasing various enemy AI behaviours!<br>Written in C++ using the SFML framework for graphics and audio."
---
# Update: The results are in!

![91 out of 100][results]

>Allow me to break the ice...

In my final year of college we had to do a two-man project ([Davy Whelan][shovel-gh] and myself) for our _Artificial Intelligence for Games_ module. The resulting game had to be an asteroids clone with a focus on artificial intelligence. There was a bunch of stuff on the brief, which can be found on the [doxygen site][doxygen] for the project, but here I'll just go over the interesting parts. (All the sound effects were Arnold move quotes, so forgive the references!)

## Planning
Apart from making a fantastic team, a large part of why we scored so highly in this assignment was that we nailed down the architecture from day one and stuck to it. We hashed out our class diagram and domain model and they barely changed, if at all, over the course of the project. We were very confident going into this that we knew how to construct a game like this with SFML, the only challenge was the AI (which, being an AI assignment, was exactly the way it should've been).
As far as planning the AI goes we had implemented each behaviour separately in the weeks prior to starting so it was mostly just a case of putting them all in one project. As I'll mention in a minute, the hardest part was dealing with the movement and prediction systems.

## Architecture

We took a simple approach to designing our classes. We wanted a single container of ships that we could just update and draw each tick. We were using [SFML][sfml] so we were also able to have the ship class derive from `sf::ConvexShape`, making drawing that much easier (the focus was on AI after all).  
Clicking classes in the hierarchy will bring you to the relevant doxygen page:    
<img src="{{ page.doxylink }}/inherit_graph_0.png" alt="Class Hierarchy" usemap="#archmap" border="0">
<map name="archmap" id="archmap">
<area shape="rect" id="node2" href="{{ page.doxylink }}/class_bullet.html" title="Bullet class. A simple bullet that moves in a direction for a lifetime. Dies if it hits something..." alt="" coords="159,12,213,39">
<area shape="rect" id="node4" href="{{ page.doxylink }}/class_pickup.html" title="Pickup class. A multi-purpose pickup that assists a Player or Predator. A pickup will add as much hea..." alt="" coords="155,75,217,101">
<area shape="rect" id="node5" href="{{ page.doxylink }}/class_ship.html" title="Base Ship class. Abstract class that inherits from sf::ConvexShape. Contains members common to all sh..." alt="" coords="162,151,210,177">
<area shape="rect" id="node3" href="{{ page.doxylink }}/class_missile.html" title="Missile" alt="" coords="278,5,341,32">
<area shape="rect" id="node6" href="{{ page.doxylink }}/class_asteroid.html" title="Asteroid class. Asteroids are technically ships but do things a little differently. Constantly move forward at fixed speed, collisions impart some velocity change. " alt="" coords="274,56,345,83">
<area shape="rect" id="node7" href="{{ page.doxylink }}/class_mothership.html" title="Mothership" alt="" coords="266,107,353,133">
<area shape="rect" id="node8" href="{{ page.doxylink }}/class_player.html" title="Controllable player class. Has no AI behaviour. Controlled through keyboard input in Game::handleEven..." alt="" coords="280,157,339,184">
<area shape="rect" id="node9" href="{{ page.doxylink }}/class_predator.html" title="Predator" alt="" coords="274,208,345,235">
<area shape="rect" id="node10" href="{{ page.doxylink }}/class_swarm_boid.html" title="SwarmBoid" alt="" coords="265,259,353,285">
</map> <!-- end of class hierarchy map -->
It's a very simple way of doing it, but it was perfectly effective for what we wanted: create a ship and then forget about its type.

## Ships
We had five "ships" in all, each with a different behaviour. The base `Ship` class defined methods common to all ships, as you might expect. The main ones were `thrust()` (applied acceleration to the forward vector), `turnToward()` (a _very_ useful function for turning the shortest distance toward a point) and `trigger()` (returned true if the ship was allowed to fire right now). The main thing derived ships had to do was implement the _pure virtual_ `update()` method with their own behaviour. The fact that a ship's __forward__ and __velocity__ vector were independent (i.e. A ship could face left but be travelling right) made programming the AI more challenging, but we ended up with movement that felt much better to play with rather than having ships always travel the direction they were facing. A great example of that is the predators, who will drift and fire and generally never face the way they're moving.

# Player
![Player ship][player-pic]

>Get your ass to mars.

The player's ship was, of course, the only controllable one. The `Player` class didn't really do anything by itself except move by its velocity and cool its gun. We stored an extra `Ship` pointer in the `Game` class, assigned a `Player` ship to it and passed it commands from `Game::handleEvents` when a key was pressed (e.g. <kbd>W</kbd> => `thrust()`, <kbd>Space</kbd> => `shoot()`).

# SwarmBoids
![SwarmBoids][swarmboids-pic]  

This little guys made use of the Lenard-Jones potential function. It allowed them to swarm like bees and, once we add swarm target functionality, we could get them swarming toward the player ship. Swarming toward the player is nice and all, but we were going for great. Instead of just swarming toward the current location of their target, they plotted an intercept course. This looked really cool when we got it working; SwarmBoids were only as fast as the player, so running close to a swarm would cause the members to begin keeping pace with the ship, before going kamikaze and falling in on him. :smiling_imp:

![Swarm example pic][example-swarm-pic]

# Motherships
![Mothership][mothership-pic]  

The mother ships are like mobile factories. Big, slow and armed with homing missiles, these gals pop a sprog every few seconds. They wander aimlessly, fleeing the player if he comes close and flocking loosely with other motherships they come across. They're flocking algorithm is pretty standard: __Separate__ (avoid colliding with others), __Cohese__ (group up with others), __Align__ (go same way as others). When the player is within a certain distance, the flocking is overridden and they flee, turning away from the player and thrusting until the player is out of range. The missiles they fire can't turn as fast as the player but are just as fast; You've got to dodge them until they run out of time and detonate.

![Mothership battle pic][example-mothership-pic]

# Predators  
![Predators][predator-pic]

>If it can bleed, we can kill it.

These are what the motherships spawn. They'll hang around in groups and, when they spot the player, will go full assault. They can fire bullets just like the player, accounting for where he'll be when the bullet arrives, forcing the player to not only dodge them but also their fire. Unlike the `SwarmBoids`, these guys have a sense of self-preservation: they'll avoid colliding with each other or the player if at all possible. Did I mention that they will also collect the pickups around the map? (More on pickups below!)

![Hunting pic][example-predator-pic]

# Asteroids  
![Asteroid][asteroid-pic]  

Big "_ships_" that just wreck everything they touch. When we create an `Asteroid`, we plot a number of points equally around a (randomly sized) circle, then we randomly shift all the points a little, to give it a proper look (but we gotta keep it convex). Asteroids have a massive amount of health but, if they kill enough ships or absorb enough fire, they'll split, spawning two smaller asteroids (both equally dangerous as the first). When a ship or bullet hits an asteroid, it'll impart some of its velocity on it, changing its direction; This can be particularly cool around swarms :wink:. Part of the brief was to make everything avoid asteroids, however, this was the only thing we failed to achieve. :disappointed_relieved:

![Random gen example pic][example-asteroids-pic]

## Things that aren't ships...

# Pickups
![Pickup][pickup-pic]

> You are mine now! You belong to me!

Pickups provided a shield for the player if they were at full health, or healed them if they were wounded. They could also be picked up by the Predator ships (the Predator shield would be yellow) and had the same effect. The shields had a duration and would obliterate anything that touched them (expect asteroids, which just strolled through and ruined your day), so seeing a predator come at you with one of these was a sign to run the other way!

# Radar
![Radar][radar-pic]

The radar was all Davy's work. The player is always at the centre and the coloured circles represent other ships. The smaller a circle is, the closer the ship is (which looks super cool). It really shines when showing off swarms of boids or packs of predators. In the picture above, you can see a couple of swarms and some asteroid to the left and some motherships to the right. It's a dangerous world out there.


[fyp]: {{ mysite.url }}/fyp_redirect/
[shovel-gh]: https://github.com/shovelware
[doxygen]: {{ page.doxylink }}
[results]: https://raw.githubusercontent.com/shovelware/arnieboids/master/arnie_boids_result.PNG
[open-game-art]: http://opengameart.org
[sfml]: http://sfml-dev.org
[player-pic]: {{ mysite.url }}/assets/posts/arnieboids/arnie.png
[swarmboids-pic]: {{ mysite.url }}/assets/posts/arnieboids/boid.png
[mothership-pic]: {{ mysite.url }}/assets/posts/arnieboids/mothership.png
[predator-pic]: {{ mysite.url }}/assets/posts/arnieboids/predator.png
[asteroid-pic]: {{ mysite.url }}/assets/posts/arnieboids/asteroid.png
[pickup-pic]: {{ mysite.url }}/assets/posts/arnieboids/pickup.png
[radar-pic]: {{ mysite.url }}/assets/posts/arnieboids/radar.png
[example-asteroids-pic]: {{ mysite.url }}/assets/posts/arnieboids/asteroids_rock.png
[example-mothership-pic]: {{ mysite.url }}/assets/posts/arnieboids/mama_no_like.png
[example-predator-pic]: {{ mysite.url }}/assets/posts/arnieboids/prey.png
[example-swarm-pic]: {{ mysite.url }}/assets/posts/arnieboids/swarm.png

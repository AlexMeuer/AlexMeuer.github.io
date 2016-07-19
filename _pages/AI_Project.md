---
layout: page
title: Ai Project
permalink: /ArnieBoids/
doxylink: http://shovelware.github.io/
---
#The results are in!:rocket:  
![91 out of 100][results]

{% comment %}
rem: Fill this with Arnie quotes!
{% endcomment %}

>Allow me to break the ice...

In my final year of college we had to do a two-man project ([Davy Whelan][shovel-gh] and myself) for our _Artificial Intelligence for Games_ module. The resulting game had to be an asteroids clone with a focus on artificial intelligence. There was a bunch of stuff on the brief, which can be found on the [doxygen site][doxygen] for the project, but here I'll just go over the interesting parts.

##Planning
<!-- to be expanded -->

##Architecture

We took a simple approach to designing our classes. We wanted a single container of ships that we could just update and draw each tick. We were using [SFML][sfml] so we were also able to have the ship class derive from `sf::ConvexShape`, making drawing that much easier (the focus was on AI after all).  
Clicking classes in the hierarchy will bring you to the relevant doxygen page:    
<img src="{{ page.doxylink }}/arnieboids/inherit_graph_0.png" alt="Class Hierarchy" usemap="#archmap" border="0">
<map name="archmap" id="archmap">
<area shape="rect" id="node2" href="class_bullet.html" title="Bullet class. A simple bullet that moves in a direction for a lifetime. Dies if it hits something..." alt="" coords="159,12,213,39">
<area shape="rect" id="node4" href="class_pickup.html" title="Pickup class. A multi-purpose pickup that assists a Player or Predator. A pickup will add as much hea..." alt="" coords="155,75,217,101">
<area shape="rect" id="node5" href="class_ship.html" title="Base Ship class. Abstract class that inherits from sf::ConvexShape. Contains members common to all sh..." alt="" coords="162,151,210,177">
<area shape="rect" id="node3" href="class_missile.html" title="Missile" alt="" coords="278,5,341,32">
<area shape="rect" id="node6" href="class_asteroid.html" title="Asteroid class. Asteroids are technically ships but do things a little differently. Constantly move forward at fixed speed, collisions impart some velocity change. " alt="" coords="274,56,345,83">
<area shape="rect" id="node7" href="class_mothership.html" title="Mothership" alt="" coords="266,107,353,133">
<area shape="rect" id="node8" href="class_player.html" title="Controllable player class. Has no AI behaviour. Controlled through keyboard input in Game::handleEven..." alt="" coords="280,157,339,184">
<area shape="rect" id="node9" href="class_predator.html" title="Predator" alt="" coords="274,208,345,235">
<area shape="rect" id="node10" href="class_swarm_boid.html" title="SwarmBoid" alt="" coords="265,259,353,285">
</map> <!-- end of class hierarchy map -->
It's a very simple way of doing it, but it was perfectly effective for what we wanted: create a ship and then forget about its type.

##Ships
We had five "ships" in all, each with a different behaviour. <!-- talk about the base class and about every ship only had thrust,turn,brake and how that impacted ai -->

#Player
![Player ship][player-pic]

>Get your ass to mars.

The player's ship was, of course, the only controllable one. The `Player` class didn't really do anyhting by itself except move by its velocity and cool its gun. We stored an extra `Ship` pointer in the `Game` class, assigned a `Player` ship to it and passed it commands from `Game::handleEvents` when a key was pressed (e.g. <kbd>W</kbd> => `thrust()`, <kbd>Space</kbd> => `shoot()`).

#SwarmBoids
![SwarmBoids][swarmboids-pic]  
This little guys made use of the Lenard-Jones potential function. It allowed them to swarm like bees and, once we add swarm target functionality, we could get them swarming toward the player ship. Swarming toward the player is nice and all, but we were going for great. Instead of just swarming toward the current location of their target, they plotted an intercept course. This looked really cool when we got it working; SwarmBoids were only as fast as the player, so running close to a swarm would cause the members to begin keeping pace with the ship, before going kamekaze and falling in on him. :smiling_imp:

#Motherships
![Mothership][mothership-pic]  
The mother ships are like mobile factories. Big, slow and armed with homing missiles, these gals pop a sprog every few seconds. They wander aimlessly, fleeing the player if he comes close and flocking loosely with other motherships they come across. They're flocking algorithm is pretty standard: __Separate__ (avoid colliding with others), __Cohese__ (group up with others), __Align__ (go same way as others). When the player is within a certain distance, the flocking is overriden and they flee, turning away from the player and thrusting until the player is out of range. The missiles they fire can't turn as fast as the player but are just as fast; You've got to dodge them until they run out of time and detonate.

#Predators  
![Predators][predator-pic]

>If it can bleed, we can kill it.

These are what the motherships spawn. They'll hang around in groups and, when they spot the player, will go full assault. They can fire bullets just like the player, accounting for where he'll be when the bullet arrives, forcing the player to not only dodge them but also their fire. Unlike the `SwarmBoids`, these guys have a sense of self-preservation: they'll avoid colliding with the player if at all possible.

#Asteroids  
![Asteroid][asteroid-pic]  
Big "_ships_" that just wreck everything they touch. When we create an `Asteroid`, we plot a number of points equally around a (randomly sized) circle, then we randomly shift all the points a little, to give it a proper look (but we gotta keep it convex). Asteroids have a massive amount of health but, if they kill anough ships or absorb enough fire, they'll split, spawning two smaller asteroids (both equally dangerous as the first). Part of the breif was to make everything avoid asteroids, however, this was the only thing we failed to achieve. :disappointed_relieved:


[fyp]: {{ mysite.url }}/fyp_redirect/
[shovel-gh]: https://github.com/shovelware
[doxygen]: {{ page.doxylink }}/arnieboids/
[results]: https://raw.githubusercontent.com/shovelware/arnieboids/master/arnie_boids_result.PNG
[open-game-art]: http://opengameart.org
[sfml]: http://sfml-dev.org
[player-pic]: #
[swarmboids-pic]: #
[mothership-pic]: #
[predator-pic]: #
[asteroid-pic]: #

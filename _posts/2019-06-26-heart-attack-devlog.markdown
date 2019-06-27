---
layout: post
title:  "DevLog: Heart Attack"
subtitle: "It's a bullet-hell game, except you can't shoot!"
date:   2019-06-26 19:13:00 +0000
category: DevLog
featured_image: '/assets/posts/heartAttack/screenshot_001.png'
description: "This has been, on and off, a game I've wanted to make for quite a while, so I thought I'd start writing about it."
---
I really enjoy [Bullet Hell][giantbomb-bullethell] games and, being a game developer, I wanted to make my own. I made a little proof of concept about 2 years ago with [Unity][unity] but life was far too hectic at the time to follow through with it. I recently picked up [Godot][godot], which is a neat little engine with its own [Python-esque scripting language][gdscript], so I figured I'd give this idea another shot.

The twist of the game is that the player cannot shoot like they would normally in a bullet-hell game, instead they have to reflect enemy bullets off of their shield! 🛡️

---

**What I've got done so far:**

- Movable player with rotatable shield (twin-stick controls)  
- Working device builds (iOS & Android)  
- Localisation. Currently just English and Japanese, because their character spacing, etc are worlds apart.
- Basic enemy movement behaviours: Strafe, Zig-Zag, Chase
- Basic enemy firing behaviours: Ring, (Single-/Multi-/Arc-)Spiral,

**In progress:**

- Lock-On (laser) weapon system (video below)  
- Level data composition (How the levels are structured / put together)  

**What's next?**

I want to get a level written up and get it onto the Play Store (as an alpha release) so that I can get feedback from my friends/family/coworkers/cat and iterate on it. I want to have the core gameplay feeling pretty damn good before I even think about any other fluff.

---

Writing about it is all well and good but bread is quite boring if that's all you eat, so here's a quick video showing the state of the game right now:

<video controls preload='metadata'>
  <source src='/assets/posts/heartAttack/sandbox.webm' type='video/webm;codecs="vp8, vorbis"'>
  Sorry, your browser doesn't support embedded videos.
</video>

At the moment, almost every sprite in the game is just the [Godot][godot] logo with a tint applied; I want to get the core gameplay down before I begin to fiddle about with art and sound.

Because it's not shown in the video above, here's the laser weapon system demo:

<video controls preload='metadata'>
  <source src='/assets/posts/heartAttack/lazor.webm' type='video/webm;codecs="vp8, vorbis"'>
  Sorry, your browser doesn't support embedded videos.
</video>

[giantbomb-bullethell]: https://www.giantbomb.com/bullet-hell/3015-321
[unity]: https://unity.com/
[godot]: https://godotengine.org/
[gdscript]: https://docs.godotengine.org/en/3.1/getting_started/scripting/gdscript/gdscript_basics.html

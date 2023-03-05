---
layout: post
title: "Slack Queue Bot"
subtitle: "A simple per-channel queue for Slack"
date: 2022-09-27 16:14:00 +0200
featured_image: "https://source.unsplash.com/ZAbIO5eas9Q/1600x900"
published: false
---

> If you were redirected to this page by the SlackQueue bot, it means you installed it successfully!

## What

SlackQueue is a simple, self-hosted, GPLv3 licenced, per-channel queue for Slack. It's written in Go and (as of writing) supports both in-memory and firestore storage backends.

## Why

I needed a queueing app with two critical criteria:

- It had to be free (as in speech).
- Unlimited queue length (no arbitrary freemium limits).

I couldn't find anything that met both of these criteria, so I wrote SlackQueue.

## How

Since the licence is [GPLv3](https://github.com/AlexMeuer/slackqueue/blob/main/LICENSE), you can find the [source on GitHub](https://github.com/AlexMeuer/slackqueue). The most up-to-date documentation is in the README.

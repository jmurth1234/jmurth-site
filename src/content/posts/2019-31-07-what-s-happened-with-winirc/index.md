---
type: post
title: What's happened with WinIRC?
date: 2019-07-31
url: /2019/07/what-s-happened-with-winirc
description: It's not dead, I've just been focusing on a different IRC client.
---

So firstly -- WinIRC is not dead. I am still working on it, even if there's been no commits to the repo, I've still been working on fixes and new features in IrcClientCore, which will end up in WinIRC. Eventually, I hope to finish the current update for WinIRC, which although isn't the recode I mentioned in the last release, is a major decoupling of the IRC logic from WinIRC into IrcClientCore. It also has a number of UI tweaks including coloured nick names, and displaying the number of unread messages in the channels on the sidebar. This update is planned to happen soon.

The reason I've not been working on it as much (apart from university / being employed) is a WIP project currently called Signal IRC. This is an IRC client based upon the same IrcClientCore library as WinIRC, but rather than running as a native UWP application, it's an ASP.NET web application.

{{< link href="signal-screenshot.png" >}}
{{< img src="signal-screenshot.png" alt="Client Screenshot" >}}
{{< /link >}}

This is essentially the spiritual successor to an older project I had, namely [Comet IRC](https://github.com/rymate1234/Comet-IRC). The major differences is that the backend and frontend is not nearly as tightly coupled -- the backend utilises a mixture of ASP.NET Web APIs for login / server management and SignalR for real time messaging. The frontend is a Vue single page application that's served by the ASP.NET server portion.

I plan to have a public release of Signal IRC as an alpha on Github at some point this year assuming I have time, once a few key features are completed, including storing message scrollback within a database.

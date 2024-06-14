---
type: post
title: Issues releasing WinIRC 1.5
date: 2017-08-24T16:38:09.000Z
url: /2017/08/issues-releasing-winirc-1-5/
---

[WinIRC 1.5](https://www.microsoft.com/en-us/store/apps/winirc/9nblggh2p0rf) is finally making it's way to the Windows Store, with a host of new features - the main one being a refreshed UI. However, the release of the application has left much to be desired.

Just over two weeks ago, I pushed the final 1.5 changelog to the [WinIRC Github](https://github.com/rymate1234/WinIRC/commit/2c2cf7797e5a3b3cec1ede2bc55ec62f53085236#diff-4ac32a78649ca5bdd8e0ba38b7006a1e), as I was hoping in the next couple of days the release would be live on the Windows Store. As it turns out, this wasn't the case - I forgot to test it locally, and the Store based certification process marked two issues that needed to be fixed before it would be certified, specifically:

- The twitter library used had uploaded binaries to NuGet built in debug mode
- Metadata issues with the UWP MenuBar lib I created

So I fixed the first issue by building a local NuGet package for the twitter library, then tested with the local Windows App Certification Kit (WACK) and my app passed, with no mention of the other metadata issues. So logically, I tried to release it on the store, and it failed the store WACK test with **the same errors as last time!** I first assumed it was my machine, so I tried it on my tablet and then a Creators Update VM, and failed to reproduce on both

After trying (and failing) to get help from MS support, I tried last night to rename the filename of the package that was uploaded to the store, as all of the ones I'd uploaded were the default filename. **This worked!** Although there was still a difference with the store results to my results, I managed to fix the metadata issues with my UWP MenuBar (by importing the source as a c# class library to the main WinIRC source tree) meaning WinIRC passed it's validation tests.

So what's next? For WinIRC development, the next step is to refactor the app to properly use an actual design pattern, probably MVVM. I also want to add some scripting support to WinIRC, so users can add their own commands and functionality to WinIRC. For distribution, I want to work on alternative distribution channels for WinIRC and other UWP / AppX applications, so it isn't entirely centralised in the Microsoft ecosystem, and hopefully so apps don't need to have a special signed certificate. More on this if I actually manage to make a prototype

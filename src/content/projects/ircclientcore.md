---
type: project
title: IrcClientCore
description: A shared library between the various .NET IRC clients I've created
source: 'https://github.com/rymate1234/IrcClientCore'
site: 'https://github.com/rymate1234/IrcClientCore'
category: OSS Library
status: active
date: 2019-05-19T15:43:24.874Z
---

In 2017, I [published](http://rymate.co.uk/2017/08/issues-releasing-winirc-1-5/) an article with some some future plans for WinIRC, including refactoring the app. This is the first major result of that refactor - the IRC cnnection portion decoupled entirely from the UI, and distributed as a Nuget package. This will be the base of a future WinIRC 2.0 and SignalIRC, an as yet unreleased ASP.NET IRC client I'm working on

### Tech Used

- **Development**: .NET Core 2 (distibuted as a .NET Standard library)
- **CI**: Gitlab CI to start with, has since moved to Azure Pipelines

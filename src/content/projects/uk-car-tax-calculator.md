---
type: project
title: UK Car Tax calculator
description: >-
  A node module to calculate vehicle tax rates for cars and vans in the UK based
  on the fuel type, engine size and when the vehicle was registered.
source: 'https://github.com/rymate1234/uk-car-tax-calculator'
site: 'https://github.com/rymate1234/uk-car-tax-calculator'
category: OSS Library
status: active
date: 2019-05-19T06:18:09.247Z
---

At work, we needed a library to calculate the vehicle tax for a vehicle, and as far as I could gather at the time one did not exist. So I created a library that could be used to calculate road tax for most cars and vans.

### Tech Used

- **Development**: JavaScript, no reliance on Node or the browser, developed with ES Modules and transpiled with `microbundle`
- **Testing**: Uses ESLint for linting and Jest to run test suites
- **CI**: Uses Microsoft Azure Pipelines to run tests for PRs and master commits

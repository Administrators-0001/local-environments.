---
title: Internal details
pcx_content_type: concept
weight: 6
---

# Internal details

This page gives an overview of how the Workers Vitest pool runs your tests, how it isolates tests from each other and how it imports modules.

## Running tests

When you run your tests with the Workers Vitest pool, Vitest will...

1. Read and evaluate your configuration file using Node.js
2. Run any [`globalSetup`](https://vitest.dev/config/#globalsetup) files using Node.js
3. Collect and sequence test files
4. For each Vitest project, depending on its configured isolation and concurrency, start one or more `workerd` processes each running one or more Workers
5. Run [`setupFiles`](https://vitest.dev/config/#setupfiles) and test files in `workerd` using the appropriate Workers
6. Watch for changes, re-running test files using the same Workers if the configuration has not changed

## Isolation and concurrency models

The [`isolatedStorage` and `singleWorker`](/workers/testing/vitest/configuration/#workerspooloptions-definition) configuration options both control isolation and concurrency. The Workers Vitest pool tries to minimise the number of `workerd` processes it starts, reusing Workers and their module caches between test runs where possible. Our current implementation of isolated storage requires each `workerd` process to run one test file at a time, and does not support `.concurrent` tests. A copy of all auxiliary `workers` exists in each `workerd` process.

### `isolatedStorage: ❌ singleWorker: ❌`

In this model, a single `workerd` process is started with a Worker for each test file. Tests files are executed concurrently and `.concurrent` tests are supported. Every test will read/write from the same shared storage, and bind to the same auxiliary `workers`.

**TODO: diagram**

### `isolatedStorage: ❌ singleWorker: ✅`

In this model, a single `workerd` process is started with a single Worker for all test files. Test files are executed in serial but `.concurrent` tests are supported. Every test will read/write from the same shared storage, and bind to the same auxiliary `workers`.

**TODO: diagram**

### `isolatedStorage: ✅ singleWorker: ❌`

In this model, a `workerd` process is started for each test file. Test files are executed concurrently but `.concurrent` tests are not supported. Each test will read/write from an isolated storage environment, and bind to its own set of auxiliary `workers`.

**TODO: diagram**

### `isolatedStorage: ✅ singleWorker: ✅`

In this model, a single `workerd` process is started with a single Worker for all test files. Test files are executed in serial and `.concurrent` tests are not supported. Each test will read/write from an isolated storage environment, and binding to the same auxiliary `workers`.

**TODO: diagram**

## Modules

Each Worker has its own module cache. As Workers are reused between test runs, so too are their module caches. Vitest invalidates parts of the module cache at the start of each test run based on changed files.

The Workers Vitest pool works by running code that Vitest would usually run inside a [Node.js worker thread](https://nodejs.org/api/worker_threads.html) inside a Cloudflare Worker instead. To make this work, the pool requires the `nodejs_compat` and `export_commonjs_default` compatibility flags to be enabled. It also configures `workerd` to use Node-style module resolution and polyfill required `node:*` modules not provided by `nodejs_compat`.

{{<Aside type="warning">}}

This may cause your Worker to behave **differently when deployed than under test**, as Node-style resolution and additional polyfills will be available to your Worker's source code and dependencies too.

{{</Aside>}}

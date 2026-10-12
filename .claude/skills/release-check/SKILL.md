---
name: release-check
description: Checks whether changed services are ready to release. Use
  before tagging a release, or when someone asks if a service is ready
  to ship.
argument-hint: "[service name]"
allowed-tools:
  - Bash(git describe *)
  - Bash(git diff *)
---

Check the service named in $ARGUMENTS. If no service is named, check every
service changed since the last release tag.

1. Find the last release tag with `git describe --tags --abbrev=0`, then list
   the files changed since that tag with `git diff --name-only <tag>`.
2. For each changed service, run its type check and tests from the service
   folder, using the commands in CLAUDE.md.
3. Check that the service's version number is higher than at the last tag.
4. Check that CHANGELOG.md has an "Unreleased" entry for the service.

Do not tag or publish anything. Report only. For each service, list each
check as PASS or FAIL with one line of evidence, then READY or NOT READY.

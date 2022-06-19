# Setup

```
npm install
npm start
```

# Logs

-   on Linux: ~/.config/{app name}/logs/{process type}.log
-   on macOS: ~/Library/Logs/{app name}/{process type}.log
-   on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log

# Links

-   [splinterlands-updater page](https://splintersuite-updater-zjqp.vercel.app/)
-   [splinterlands-updater dashboard](https://vercel.com/hoodsy44/splintersuite-updater-zjqp/3LJFen52sAyZmNpdjpLWJotXzV5T)
-   splinterlands-api IP: `54.161.248.145`
-   [digital ocean db](https://cloud.digitalocean.com/databases?i=c68d38)
-   [splintersuite.com](splintersuite.com)

# Release Process

1. Bump version in `package.json`
2. Tag a new release `git tag -a v0.0.1 -m "tag message"`
3. Push code and tags: `git push && git push --tags`
4. On Github, wait for action to finish building binaries.
5. Create a release from the draft.
6. In the `splinterlands-updater` repository, create a matching tag: `git tag -a v0.0.1 -m "tag message"`
7. Push this tag `git push --tags`
8. Create a release in `splinterlands-updater` and attach the binaries from the original release.
9. Check for update at [https://splintersuite-updater-zjqp-lezqvw7ay-hoodsy44.vercel.app/](https://splintersuite-updater-zjqp-lezqvw7ay-hoodsy44.vercel.app/)

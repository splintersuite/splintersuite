# Setup

```
npm install
npm start
```

# File Structure

```
/src
	/main.js			- root
	/client 			- React app
	/api				- API (main thread)
	/bot				- Rental bot
```

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

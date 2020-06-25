# Release process

## Release candidate

Quite often a change in k-charted impacts the interfacing with Kiali, so it's better to do a release candidate as a first step so that it can be consumed and tested before the final release.

This is roughly the same steps as a normal release, with version being like `x.y.z-rcN`.
Ideally 2-3 days before the end of a sprint, the final release should be done to avoid having Kiali release pointing to RC. It's just as a matter of cleanliness, as the code remains the same.

In Kiali, `glide.yaml` and `package.json` need to be updated according to version change.

## Final release

This is currently a manual process:

- Bump version in `web/pf4/package.json`

- Commit bumped version, with commit message such as "Release x.y.z"

- Build / lint / test everything

```bash
make go pf4
```

- Push upstream

- Tag (`git tag -a vx.y.z -m "vx.y.z"`). Don't forget the `v` prefix as it's more common in go... although this prefix is not used in the NPM versioning.

- Push tag (`git push upstream --tags`)

- Publish NPM modules

```bash
cd web/pf4 && npm publish
```

- Go to Github: https://github.com/kiali/k-charted/releases/new and fill-in new release (from tag vx.y.z, named vx.y.z), including some description + link to the commits list, e.g.:
https://github.com/kiali/k-charted/compare/v0.2.0...v0.2.1

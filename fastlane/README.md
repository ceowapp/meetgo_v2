fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios build_dev

```sh
[bundle exec] fastlane ios build_dev
```

Push a new release ipa file to the Firebase distribution

### ios build_ipa_dev

```sh
[bundle exec] fastlane ios build_ipa_dev
```



### ios upload_ipa_distribution

```sh
[bundle exec] fastlane ios upload_ipa_distribution
```



----


## Android

### android build_dev

```sh
[bundle exec] fastlane android build_dev
```

Push a new release apk file to the Firebase distribution

### android build_apk_dev

```sh
[bundle exec] fastlane android build_apk_dev
```



### android upload_apk_distribution

```sh
[bundle exec] fastlane android upload_apk_distribution
```

Upload android to Firebase

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

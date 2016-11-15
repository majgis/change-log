# change-log

Command line generation of a [Semantic Versioning][0]
based change log.

This project is still in the early stages of development, so it is 
still rough around the edges, with more features to come.  For example,
the tool intelligence is currently low, so be careful removing 
sections created by `change-log init`, especially under the Unreleased 
section.

## API

### Help

View a list of command arguments and options

    change-log

### Initialize

Create a new CHANGELOG.md file.
The name is taken from package.json if it exists, and from the folder
name if it does not.

    change-log init
    
### Major

Add an entry under Major in the Unreleased section.

    change-log major "What was changed"

### Minor

Add an entry under Minor in the Unreleased section.

    change-log minor "What was added"

### Patch

Add an entry under Patch in the Unreleased section.

    change-log patch "What was fixed"
    
### Release

Marks the unreleased section as a release:
- Calculates the SemVer based on the previous release in the change log 
 and on unreleased Major, Minor and Patch entries.
- Adds a new empty unreleased section.

```
change-log release
```

## Example

See the [change log][1] for this project for a full working example of
the format.

Here is an example of creating a new file, adding changes and cutting
a release:

### Intialize a new CHANGELOG.md file:
```
$ change-log init && cat CHANGELOG.md
# change-log Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased] - YYYY-MM-DD

### Major

### Minor

### Patch

[Unreleased]: https://github.com/majgis/change-log/commits/v1.0.0
```

### Add a minor entry:
```
$ change-log minor "Addded a new feature" && cat CHANGELOG.md 
# change-log Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased] - YYYY-MM-DD

### Major

### Minor
- Addded a new feature

### Patch

[Unreleased]: https://github.com/majgis/change-log/commits/v1.0.0
```

### Add a patch entry:
```
$ change-log patch "Fixed an issue" && cat CHANGELOG.md 
# change-log Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased] - YYYY-MM-DD

### Major

### Minor
- Addded a new feature

### Patch
- Fixed an issue

[Unreleased]: https://github.com/majgis/change-log/commits/v1.0.0
```

### Cut a release:
```
$ change-log release && cat CHANGELOG.md 
# change-log Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased] - YYYY-MM-DD

### Major

### Minor

### Patch

## [v1.0.0] - 2016-11-15

### Minor
- Addded a new feature

### Patch
- Fixed an issue

[Unreleased]: https://github.com/majgis/change-log/compare/v1.0.0...master
[v1.0.0]: https://github.com/majgis/change-log/commits/v1.0.0

```


  
[0]: http://semver.org/
[1]: https://github.com/majgis/change-log/blob/master/CHANGELOG.md

# change-log

Command line generation of a [Semantic Versioning][0]
based change log.

Please note: the tool intelligence is currently low.  Be careful not to 
remove sections created by `change-log init`, especially under the 
Unreleased section.

You can see an editable example of this format [here][3].

This project was inspired by [Keep a Change Log][2] but the format is 
different, with a focus on the SemVer versions.

## API

Execute without arguments to view a list of command arguments and options

    change-log

### init

Create a new CHANGELOG.md file.
The name is taken from package.json if it exists, and from the folder
name if it does not.

    change-log init
    
### major

Add an entry under Major in the Unreleased section.
- The message is echoed to stdout.

    change-log major "What was changed"

### minor

Add an entry under Minor in the Unreleased section.
- The message is echoed to stdout.

    change-log minor "What was added"

### patch

Add an entry under Patch in the Unreleased section.
- The message is echoed to stdout.

    change-log patch "What was fixed"
    
### release

Marks the unreleased section as a release:
- Calculates the SemVer based on the previous release in the change log 
 and on unreleased Major, Minor and Patch entries.
- Adds a new empty unreleased section.
- Writes release version to the console
- Update package.json, npm-shrinkwrap.json and package-lock.json if they exist

```
change-log release
```

## Include Commit Message in Change Log

    # major
    git commit -am "$(change-log major 'message')" 

    # minor
    git commit -am "$(change-log minor 'message')" 

    # patch
    git commit -am "$(change-log patch 'message')" 
    
    # release
    git commit -am "$(change-log release)" 


## Options

Default settings can be overridden using a `.changelog` file in the 
current working directory or in your home directory.  You can also 
specify the same options at command line.

Here are the options that can be provided to override the defaults:

### unreleasedUriTemplate
- A string template for a git uri of changes not yet published
- Used during release

### startUriTemplate
- A string template for a git uri of changes from the first commit
- Used during init and release

### uriTemplate
- A string template for a git uri of changes between releases.
- Used during release

### organization
- The group name associated with a git repository
- Used during init and release

### name
- The project name associated with a git repository
- The default comes from the repository field of package.json, the 
    name in package.json or the containing directory.
- Used during init and release

Here are the recognized tokens that will be replaced in each string 
template above:

- ${organization}
    - This is the git repository group name
    - Taken from the repository field of package.json by default
- ${name}
    - The git repository project name
    - Taken from repository field of package.json, name in package.json 
    or directory
- ${fromVersion}
    - In the case of startUriTemplate, this value will be an empty string
    - The version prior to release
- ${toVersion}
    - The current release version

These tokens are replaced with a simple find and replace operation, 
with no evaluation of what is between the braces.

Example `.changelog` file:
```
{
  "unreleasedUriTemplate": "https://github.com/${organization}/${name}/compare/v${toVersion}...master",
  "startUriTemplate": "https://github.com/${organization}/${name}/commits/v${toVersion}",
  "uriTemplate": "https://github.com/${organization}/${name}/compare/v${fromVersion}...v${toVersion}",
  
  "organization": "myOrg",
  "name": "projectName"
}
```

Example cli options:

    change-log release --unreleasedUriTemplate="https://github.com/${organization}/${name}/compare/v${toVersion}...master"


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
$ change-log minor "Added a new feature" && cat CHANGELOG.md 
# change-log Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased] - YYYY-MM-DD

### Major

### Minor
- Added a new feature

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
- Added a new feature

### Patch
- Fixed an issue

[Unreleased]: https://github.com/majgis/change-log/commits/v1.0.0
```

### Cut a release:
```
$ change-log release && cat CHANGELOG.md 
v1.0.0
# change-log Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased] - YYYY-MM-DD

### Major

### Minor

### Patch

## [v1.0.0] - 2016-11-15

### Minor
- Added a new feature

### Patch
- Fixed an issue

[Unreleased]: https://github.com/majgis/change-log/compare/v1.0.0...master
[v1.0.0]: https://github.com/majgis/change-log/commits/v1.0.0

```


  
[0]: http://semver.org/
[1]: https://github.com/majgis/change-log/blob/master/CHANGELOG.md
[2]: http://keepachangelog.com
[3]: https://majgis.github.io/change-log/


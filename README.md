# change-log

Command line generation of a [Semantic Versioning][0]
based change log.

This project is still in the early stages of development, so it is 
still rough around the edges, with more features to come.  For example,
the tool intelligence is currently low, so be careful removing 
sections created by `change-log init`, especially under the Unreleased 
section.

## Example

See the [change log][1] for this project for an example of the format

## Help

View a list of command arguments and options

    change-log

## Initialize

Create a new CHANGELOG.md file. A package.json file must be present.

    change-log init
    
## Major

Add an entry under Major in the Unreleased section.

    change-log major "What was changed"

## Minor

Add an entry under Minor in the Unreleased section.

    change-log minor "What was added"

## Patch

Add an entry under Patch in the Unreleased section.

    change-log patch "What was fixed"
    
[0]: http://semver.org/
[1]: https://github.com/majgis/change-log/blob/master/CHANGELOG.md

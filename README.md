# Pillar 2 Service Guide

## Overview

Service guide microservice for Pillar 2 project. Pillar 2 refers to the Global Minimum Tax being introduced by the Organisation for Economic Cooperation and Development (OECD).

The Pillar 2 Tax will ensure that global Multinational Enterprises (MNEs) with a turnover of >€750m are subject to a minimum Effective Tax Rate of 15%, i.e. a top-up tax for Medium to Large MNEs.

## Editing Service Guide pages

Template files are located in `./source/documentation`. All pages are written in [Markdown](https://en.wikipedia.org/wiki/Markdown).

To add new pages simply copy and paste one of the existing pages, it will automatically appear in the menu.

## Previewing

#### Option 1 - Using Docker (recommended)

Requirements:
* [Docker](https://www.docker.com/)

To live preview:
```shell
./batect preview
```
The local URL and port where the files can be previewed will be output, this is normally http://localhost:4567.

NB The first time this is run it builds the Docker image and installs dependencies so may take 5 mins.
Subsequent runs will be much quicker.

#### Option 2 - Local install (Not recommended)

Requirements:
* [Ruby Version Manager][rbenv]
* [Node Version Manager][nodenv]

After installing ruby, change the gem sources to use HMRC's artefact repository:
```shell
gem sources -r https://rubygems.org/
gem sources -a https://artefacts.tax.service.gov.uk/artifactory/api/gems/gems/
````

To live preview:
```shell
bundle install
bundle exec middleman serve
```
The local URL and port where the files can be previewed will be output, this is normally http://localhost:4567.

## Running the Scala Application
HTML files are generated and then served by a simple Scala Play application.

Requirements:
* Scala/sbt

### Build the HTML files
```shell
./batect build
```

### Run the Scala Application
```shell
sbt run
```

The local URL and port where the files can be previewed will be output, this is normally http://localhost:9000.

## FAQ

### How do I update the Service Guide

The easiest and safest option would be:

1. Clone the [service-guide-skeleton](https://github.com/hmrc/service-guide-skeleton) repository into a new directory.
2. Follow the _Getting started_ section of the `service-guide-skeleton`, copying the settings from the original Pillar 2
   Service Guide project.
3. Copy the `./source` directory from the original project.
4. Copy all files from the new directory to overwrite the original Pillar 2 Service Guide project. (except the `.git` directory)
5. Commit and push changes from your original project.

### How do I update the Ruby Gems
To update the Ruby Gems to the latest versions, run:
```shell
./batect update
```
This will update the `Gemfile.lock`

In some cases, the [latest release](https://github.com/alphagov/tech-docs-gem/releases) of the gem might not be fetched.
If this happens, edit the Gemfile to specify the latest version explicitly, for example
```
gem 'govuk_tech_docs', '5.0.1'
```
and run the update command again. Once updated, remove the explicit version and run the update once more.

### How do I change the Ruby version
Edit `.ruby-version` with the required version of Ruby.

## License
This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").

[rbenv]: https://github.com/rbenv/rbenv
[nodenv]: https://github.com/nodenv/nodenv

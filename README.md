# Pillar 2 Service Guide

## Overview

Service guide microservice for Pillar 2 project. Pillar 2 refers to the Global Minimum Tax being introduced by the Organisation for Economic Cooperation and Development (OECD).

The Pillar 2 Tax will ensure that global Multinational Enterprises (MNEs) with a turnover of >€750m are subject to a minimum Effective Tax Rate of 15%, i.e. a top-up tax for Medium to Large MNEs.

## Prerequisites
```shell
brew install rbenv
brew install nodenv
```

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

To live preview:
```shell
bundle install
bundle exec middleman serve
```
The local URL and port where the files can be previewed will be output, this is normally http://localhost:4567.

## Running the Scala Application

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

### How do I update the Ruby Gems
To update the Ruby Gems to the latest versions, run
```shell
./batect update
```
This will update the `Gemfile.lock`

### How do I change the Ruby version
Edit `.ruby-version` with the required version of Ruby.

### How do I change the Node version
Edit `.node-version` with the required version of Node.

## License
This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").


[rbenv]: https://github.com/rbenv/rbenv
[nodenv]: https://github.com/nodenv/nodenv

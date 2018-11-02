# Diroctor

Diroctor is a node.js command line tool that looks after the most precious thing a software developer has `the source code!`

Given a path to the root folder where source code is kept it will create a .diroctor.lock file with all git repositories and folder tree. Keep this file backed up on Dropbox or Google Drive and use it to fully restore all your repositories with one convenient command.

This is extremely valuable in case of a hardware failure or a quick way to set up your development environment on a new machine.

# Install

The most convenient way to use `diroctor` is to install it as a global `npm` module.

    npm i diroctor -g
    yarn global add diroctor

# Usage

Diroctor has some sensible defaults with the possibility to override them using CLI arguments.

Default source and restore path is `code`.
Default .diroctor.lock file is generated in `HOME` path

All paths in `diroctor` are relative to `HOME` environment variable. So `code` points to `~/code` on the filesystem.

Running `diroctor` in the command with no arguments line will look for a `~/code`folder, go through all of the folders recursively until it finds a `git` repository, save that and create a `~/.diroctor.lock` file.

Running `diroctor -r` or `diroctor --restore` will read the `.diroctor.lock` file and restore the folder structure and check out all `git` repositories in the same place and with same folder name as before.

## CLI options

Options:

| Option                     | Details                                                               |
| -------------------------- | --------------------------------------------------------------------- |
| -v, --version              | output the version number                                             |
| -r, --restore              | Re-install repository directory tree. To specify a path use -s <path> |
| -d, --diroctor-lock <path> | Location of the diroctor.lock file relative to the HOME directory     |
| -s, --source <path>        | Path to the root of git repositories relative to the HOME directory   |
| -h, --help                 | output usage information                                              |

## Override defaults

    diroctor -s projects

Will look for `~/projects` folder and traverse to create the `.diroctor.lock` file

    diroctor -r -s myCode

Will read `.diroctor.lock` file and restore the repository folder structure to `~/myCode` folder.

# Motivation

Having to re-install all projects every time I re-install OS or change a machine is a pain. This little utility makes it easy to restore a complete project structure in case of a machine failure or even use it to share a complex project structure with several people in the team, e.g. set up multiple git repositories using only one command.

# Licence

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

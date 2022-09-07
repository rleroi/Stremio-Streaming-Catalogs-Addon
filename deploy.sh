#!/usr/bin/env zsh

set -e

cd vue && nnpm run build && cd ../
git add --all
git commit -am "Deploy"
git push origin master && git push beamup master

#!/usr/bin/env zsh

set -env

git add --all
git commit -m "Deploy"
cd vue && nnpm run build && cd ../
git push origin master && git push beamup master

#!/usr/bin/env bash
set -xe

if ! command -v yarn -v &> /dev/null
then
  echo "yarn package manager not found, installing..."
  curl -o- -L https://yarnpkg.com/install.sh | bash
fi

cd fastai-video-browser
yarn build
rm -rf ../docs/videos/*
cp -r build/* ../docs/videos/
rm -rf ../docs/static
cd ../docs
mv videos/static ./
git add -A .
git commit -am rebuild


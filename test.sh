#!/bin/bash -e

submodules=( web desktop )
for submodule in "$submodules"
do
  (cd "$submodule" && npm test);
done

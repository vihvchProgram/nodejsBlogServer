#!/bin/sh
cd ../../logs
cp access.log $(date +%Y-%m-%d-%H).access.log
echo "" > access.log

#!/bin/bash

# This script deploys the application to the production server.
mkdir dist

cp -r scripts dist/
cp -r styles dist/
cp -r assets dist/
cp index.html dist/



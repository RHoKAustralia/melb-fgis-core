#!/bin/sh
echo 'start setting script'

if [ ! -d "mbtiles-server" ]; then

echo "New install. mbtiles-server folder dosen't exsit."

# For fresh install . . .
sudo apt-get update
sudo apt-get install -y git python-software-properties software-properties-common
sudo apt-add-repository -y ppa:chris-lea/node.js-legacy
sudo apt-get update
sudo apt-get install -y nodejs npm

# Install MBTiles-server
git clone https://github.com/chelm/mbtiles-server
cd mbtiles-server

npm install -s sphericalmercator splite3
npm install

wget http://cycletour.org:5004/fgis_z13.mbtiles

else

cd mbtiles-server

fi

echo 'Starting mbtiles server..'
# Run MBTiles-server (default port 3000)
node server.js fgis_z13.mbtiles &

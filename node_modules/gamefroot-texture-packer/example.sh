#!/bin/bash

rm -R example
mkdir -p example

node index.js -p example/kiwi -f kiwi --algorithm growing-binpacking assets/platform*.png --trim --gutter 4

# node index.js -p example/json -f json --trim --padding 10 assets/*.png
# node index.js -p example/json_50% -f json --trim --padding 10 --scale 50% assets/*.png
# node index.js -p example/starling_sparrow -f starling --trim assets/*.png
# node index.js -p example/easel_js -f easel.js --trim assets/*.png
# node index.js -p example/cocos2d -f cocos2d --trim assets/*.png
# node index.js -p example/css -f css --trim assets/*.png

# node ../index.js --name vertical --algorithm vertical --trim assets/*.png
# node ../index.js --name horizontal --algorithm horizontal --trim assets/*.png
# node ../index.js --name growing-binpacking --algorithm growing-binpacking --trim assets/*.png
# node ../index.js --name binpacking --algorithm binpacking --width 1000 --height 1000 --trim assets/*.png
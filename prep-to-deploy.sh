rm -fr deploy
mkdir deploy
cp -r build/ package.json package-lock.json servCards.js .env src/ public/ servAuth/ deploy

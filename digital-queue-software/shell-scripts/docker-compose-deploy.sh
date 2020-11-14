rm -rf build/ node_modules/
npm install
yarn build-website
yarn build-server
rm -rf node_modules
npm install --only-prod
yarn start
ls -al

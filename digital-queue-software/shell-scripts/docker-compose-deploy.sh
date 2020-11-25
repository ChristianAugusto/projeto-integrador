rm -rf build/ node_modules/
npm install
npm run build-website
npm run build-server
rm -rf node_modules
npm install --only-prod
npm start
ls -al

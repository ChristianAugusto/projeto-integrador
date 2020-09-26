rm -rf build
rm -rf node_modules
npm install --only-dev
npm run build-website
npm run build-server
rm -rf node_modules
npm install --only-prod
npm run start

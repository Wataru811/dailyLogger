
npx electron-builder --mac
npx electron-builder --dir --mac --universal
npx electron-forge package --arch=x64 --platform=darwin
npx electron-froge package --arch=universal --platform=darwin
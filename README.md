# CrimsonCode-Village
CrimsonCode 2026
Team: Zachary Marseglia and Evan Glasscock

## How to run Chron with Expo

To run Chron with Expo, run the following command:

```
cd chron
npx expo start
````

Then select the platform you wish to run on.

Note that some actions may not be available on platforms or via the Expo app.

## Building for Android

To build for android, first ensure Android Studio is installed and the platform components for the platform you want to build for is installed. Then run the following command:

```
cd chron
npx expo prebuild --platform android
cd android
./gradlew assembleDebug
```

## Building for iOS

```
cd chron
npx expo prebuild --platform ios
```

Then open the xcworkspace file and build the project in XCode.

# CrimsonCode-Village
CrimsonCode 2026
Team: Zachary Marseglia and Evan Glasscock

## How to run Chron with Expo

To run Chron with Expo, run the following command:

```
npx expo start
````

Then select the platform you wish to run on.

Note that some actions may not be available on platforms or via the Expo app.

## Building for Android

To build for android, first ensure Android Studio is installed and the platform components for the platform you want to build for is installed. Then run the following command:

```
eas build -p android --profile preview --local
```

## Building for iOS

```
eas build -p ios --profile preview --local
```
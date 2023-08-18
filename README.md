# React Native Setup Guide
**Development OS:** Ubuntu 22.04
**Target OS:** Android
### Step 1: Install NodeJS 16 or newer.
### Step 2: Install JDK.
```console
sudo apt install default-jdk
```
To confirm installation:
```console
javac -version
```
### Step 3: Android development environment
#### Step 3.1: Install Android Studio
1. Download Android Studio at [Android Developer](https://developer.android.com/studio)
2. Install the required libraries for 64-bit machines.
    ```console
    sudo apt-get install libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1 libbz2-1.0:i386
    ```
3. Unzip downloaded file.
4. Move unzipped file to `/opt/`
    ```console
    sudo mv ./android-studio /opt/
    ```
5. Create shortcut
    Create shortcut file:
    
    ```console
    sudo nano /usr/share/applications/android-studio.desktop
    ```
    Add the following code snippet and save:
    ```
    [Desktop Entry]
    Version=1.0
    Type=Application
    Name=Android Studio
    Comment=Android Studio
    Exec=bash -i "/opt/android-studio/bin/studio.sh" %f
    Icon=/opt/android-studio/bin/studio.png
    Categories=Development;IDE;
    Terminal=false
    StartupNotify=true
    StartupWMClass=jetbrains-android-studio
    Name[en_GB]=android-studio.desktop
    ```
6. Lauch Android Studio with created shortcut and follow its setup guides (just click next and next).
#### Step 3.2: Install the Android SDK
1. Open Android Studio -> More Actions -> SDK Manager.
2. Select the `SDK Platforms` tab from within the SDK Manager, then check the box next to `Show Package Details` in the bottom right corner. Look for and expand the `Android 13 (Tiramisu)` entry, then make sure the following items are checked:
    * `Android SDK Platform 33`
    * `Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image`

3. Select the `SDK Tools` tab and check the box next to `Show Package Details` here as well. Look for and expand the `Android SDK Build-Tools` entry, then make sure that `33.0.0` is selected.
4. Click "Apply" to download and install the Android SDK and related build tools.

#### Step 3.3: Configure the ANDROID_HOME environment variable
1. Add the following lines to `$HOME/.bashrc` (if you are using zsh then `~/.zprofile` or `~/.zshrc`) config file:

    ```
    export ANDROID_HOME=$HOME/Android/Sdk
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    ```
2. Type source `$HOME/.bashrc` or reopen terminal to load new config.

### Step 4: Install Watchman:
1. Download Watchman package for Ubuntu 22.04 at [Watchman release v2023.08.14.00](https://github.com/facebook/watchman/releases/tag/v2023.08.14.00)
2. Open downloaded file with `Software Install` and install.
3. Check Watchman installed with:
```console
watchman --version
```
### Step 5: Create React Native project:
```console
npx react-native@latest init ProjectName
```
### Step 6: Preparing the Android device
1. Lauch Android Studio -> More Actions -> Virtual Device Manager.
2. Choose `Create Device`
3. Create an Android 13 Tiramisu API 33 device with recommneded configs (more detail [Android Developer Docs](https://developer.android.com/studio/run/managing-avds#createavd)).
4. Lauch created virtual device.

### Step 7: Running React Native application
1. Running command:
    ```console
    npm start
    ```
2. Press `a` to run on android.
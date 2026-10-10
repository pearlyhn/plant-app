// Where the app finds the ESP32 on Wi-Fi.
// After the board connects, it prints its address in the Serial Monitor,
// for example "Open http://172.20.10.5/" -> paste that here.
export const ESP_URL = 'http://172.20.10.5/';

// Sensor calibration: the numbers you saw in the Serial Monitor.
// Used to turn the raw reading into a 0-100% moisture level.
export const DRY_READING = 3000; // sensor in the air
export const WET_READING = 1300; // sensor in a cup of water
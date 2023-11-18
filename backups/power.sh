#!/bin/bash

if [[ $(dumpsys power | grep 'Display Power') == "Display Power: state=ON" ]]; then
  echo "Layar dalam keadaan menyala."
else
  echo "Layar dalam keadaan mati. Menghidupkan layar..."
  su -c "input keyevent KEYCODE_POWER"
  su -c "input swipe 10 1000 10 10"
  su -c "input keyevent KEYCODE_1"
  su -c "input keyevent KEYCODE_7"
  su -c "input keyevent KEYCODE_2"
  su -c "input keyevent KEYCODE_0"
  su -c "input keyevent KEYCODE_0"
  su -c "input keyevent KEYCODE_1"
  su -c "input keyevent KEYCODE_ENTER"
fi




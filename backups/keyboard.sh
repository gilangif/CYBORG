#!/bin/bash

if [[ $(dumpsys input_method | grep mInputShown) == "mShowRequested=true mShowExplicitlyRequested=true mShowForced=false mInputShown=true" ]]; then
  echo "Keyboard muncul"
else
 su -c input keyevent 4
fi




#!/bin/bash

{

images=()

  # Loop through all files in the specified directory
  for file in ./public/*; do

    # Check if it's a file
    if [[ -f "$file" ]]; then
      filename=$(basename "$file")
      # Check if the file is an image based on its extension
      case "$file" in
        *.jpg|*.gif|*.png|*.JPG)
          images+=("<a href=\"bigthumbs/$filename\">$filename</a>") # A
          ;;
        *)
        echo $file
          ;;
      esac
    fi

  done

# Echo the array of non-image files after the loop
  echo '<div id="images">'
  printf '%s\n' "${images[@]}"



} > index.html

node makecompositeimage.js

for dir in o hi lo; do
  for file in "$dir"/*; do
    mv "$file" "${file//drawinggif/drawing}"
  done
done
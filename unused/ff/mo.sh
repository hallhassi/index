for file in *; do
  newname=$(echo "$file" | sed "s/ //g")
  mv "$file" "$newname"
done
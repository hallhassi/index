#!/bin/bash
set -e  # Exit the script if any command fails

# Enable case-insensitive pattern matching for file extensions
shopt -s nocaseglob

# Start generating the HTML file
{
cat <<EOF
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>img{max-width:100vw;}</style></head><body>
EOF

# Use find to loop through all files in the current directory and subdirectories
find . -type f | while read -r filepath; do
    # Extract the filename from the full path
    filename=$(basename "$filepath")
    
    # Check if the file is an image based on its extension
    case "$filepath" in
        *.jpg|*.jpeg|*.png|*.webp)
            # Output an image tag for supported image files
            echo "<img src=\"unusedthumbnails/$filename\">"
            ;;
        *)
            # Optionally, you could handle non-image files differently (e.g., log them, ignore them)
            echo "$filename"
            ;;
    esac
done

# Close the HTML structure
cat <<EOF
</body></html>
EOF

} > index.html


node makethumbnails.js

#!/bin/bash

#!/bin/bash

# # Define the target directory
# target_dir="public"

# # Check if the target directory exists, create it if not
# if [[ ! -d "$target_dir" ]]; then
#     mkdir "$target_dir"
# fi

# # Loop through directories starting with "20"
# for dir in 20*/; do
#     # Check if the item is indeed a directory
#     if [[ -d "$dir" ]]; then
#         # Move the directory to the target directory
#         git mv "$dir" "$target_dir/"
#     fi
# done


# # Loop through each directory in the current directory
# for dir in */; do
#     # Remove the trailing slash from the directory name
#     dir_name=${dir%/}
    
#     # Loop through each file in the directory
#     for file in "$dir"*; do
#         # Check if it is a file
#         if [[ -f "$file" ]]; then
#             # Move the file to the parent directory with the new name
#             git mv "$file" "${dir_name}-${file##*/}"
#         fi
#     done
# done



# Counter for new filenames
counter=1

# Loop through all files in the current directory
for file in IMG_2017*; do
    # Check if it is a regular file
    if [[ -f "$file" ]]; then
        # Get the file extension
        extension="${file##*.}"
        # Format the new filename with leading zeros
        new_file="$(printf "%spublic/blaiselarmee-2016-drawinghomework-%02d.%s" "$directory" "$counter" "$extension")"
        
        # Rename the file
        git mv "$file" "$new_file"
        echo "Renamed: $file to $new_file"

        # Increment the counter
        ((counter++))
    fi
done

 

# # Initialize counter
# counter=1

# # Loop through files matching the pattern 2022-*
# for file in blaiselarmee-2022-drawing*; do
#     # Check if it is a regular file
#     if [[ -f "$file" ]]; then
#         # Format the counter with leading zeros
#         formatted_counter=$(printf "%02d" "$counter")
#         # Create the new filename
#         new_file="blaiselarmee-2019-drawing-${formatted_counter}.gif"
        
#         # Rename the file
#         # git mv "$file" "$new_file"
#         echo "Renamed '$file' to '$new_file'"
        
#         # Increment the counter
#         ((counter++))
#     fi
# done

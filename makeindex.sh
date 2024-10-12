#!/bin/bash

{

cat <<EOF
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="scrub.css"><style>body{white-space:pre;background:red;margin:1em 0 calc(100vh - 2em) 1em}a{all:unset;cursor:pointer;}</style></head><body>
<div>
<a href="https://mp4.bar ">https://mp4.bar </a>
<a href="https://larmee.org ">https://larmee.org </a>
<a href="https://2dcloud.com ">https://2dcloud.com </a>
<a href="https://altcomics.tumblr.com">https://altcomics.tumblr.com</a>
<a href="https://davidhockney.tumblr.com">https://davidhockney.tumblr.com</a>
<a href="https://instagram.com/hitosteyerl">https://instagram.com/hitosteyerl</a>
</div>
<div><!-- 
<s>blaiselarmee-2008-architecture</s>
<s>blaiselarmee-2008-poolboys</s>
<a href="blaiselarmee-2010-aidankoch.html">blaiselarmee-2010-aidankoch \$20</a>
<s>blaiselarmee-2010-studygroup124</s>
<s>blaiselarmee-2010-taffyhips8</s>
<s>blaiselarmee-2010-yokoono</s>
<a href="blaiselarmee-2010-younglions.html">blaiselarmee-2010-younglions \$20</a>
<s>blaiselarmee-2011-astraltalk</s>
<s>blaiselarmee-2011-cruise</s>
<s>blaiselarmee-2011-danquayl</s>
<s>blaiselarmee-2011-mouldmap2</s>
<s>blaiselarmee-2011-na680</s>
<s>blaiselarmee-2011-sonatina1</s>
<s>blaiselarmee-2012-sonatina2</s>
<s>blaiselarmee-2012-theliftedbrow</s>
<s>blaiselarmee-2013-limner2</s>
<a href="blaiselarmee-2014-cometscomets.html">blaiselarmee-2014-cometscomets \$5</a>
<s>blaiselarmee-2014-mouldmap3</s>
<a href="blaiselarmee-2015-3-books.html">blaiselarmee-2015-3-books \$100</a>
<s>blaiselarmee-2015-altcomicsmagazine1</s>
<s>blaiselarmee-2016-altcomicsmagazine2</s>
<s>blaiselarmee-2016-altcomicsmagazine4</s>
<a href="blaiselarmee-2016-altcomicsmagazine5.html">blaiselarmee-2016-altcomicsmagazine5 \$5</a>
<a href="blaiselarmee-2016-altcomicsmagazine6.html">blaiselarmee-2016-altcomicsmagazine6 \$5</a>
<a href="blaiselarmee-2016-mirrormirror.html">blaiselarmee-2016-mirrormirror \$30</a>
<a href="blaiselarmee-2017-2001.html">blaiselarmee-2017-2001 \$27</a>
<s>blaiselarmee-2024-iud</s>
<a href="blaiselarmee-2024-classclass.html">blaiselarmee-2024-classclass \$10</a>
</div>-->
<div>
EOF

images=()

  # Loop through all files in the specified directory
  for file in ./public/*; do

    # Check if it's a file
    if [[ -f "$file" ]]; then
      filename=$(basename "$file")
      # Check if the file is an image based on its extension
      case "$file" in
        *.pdf|*.mov|*.m4a|*.mp4)
          # size=$(stat -c%s "$file")
          echo "<a href=\"public/$filename\">$filename</a>"
          ;;
        *)
          images+=("<a href=\"public/$filename\">$filename</a>") # Add to the array if not an image
          ;;
      esac
    fi

  done

# Echo the array of non-image files after the loop
  echo '</div>'
  echo '<div id="images">'
  printf '%s\n' "${images[@]}"

echo '</div><div id="sticky"></div><div id="wrapper"><canvas id="tv" width="0" height="0"></canvas></div><script src="scrub.js"></script></body></html>'


} > index.html


# #!/bin/bash

# {

# echo '<table><thead><th>name</th><th>size</th><tbody>'

#   # Loop through all files in the specified directory
#   for file in ./public/*; do
#     if [ -f "$file" ]; then
#       filename=$(basename "$file")
#       size=$(stat -c%s "$file" | awk '{ printf "%.2f\n", $1/1024/1024 }')
#       echo "<tr><td><a href=\"public/$filename\">$filename</a></td><td>$size</td></tr>"
#     fi
#   done

# } > index.html

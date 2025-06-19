import os
import argparse

def generate_html_tree(startpath, output_file="tree_of_links.html", exclude_dirs=None, exclude_files=None):
    """
    Generates an HTML file with a directory tree of links.

    Args:
        startpath (str): The starting directory to scan.
        output_file (str): The name of the HTML file to create.
        exclude_dirs (list): A list of directory names to exclude.
        exclude_files (list): A list of file names to exclude.
    """
    if exclude_dirs is None:
        exclude_dirs = []
    if exclude_files is None:
        exclude_files = []

    html_content = [
        "<!DOCTYPE html>",
        "<html lang='en'>",
        "<head>",
        "    <meta charset='UTF-8'>",
        "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>",
        "    <title>Directory Tree</title>",
        "    <style>",
        "        body { font-family: monospace; }",
        "        .dir-entry { margin-left: 20px; }",
        "        .file-entry { margin-left: 20px; }",
        "        .directory { font-weight: bold; color: #333; }",
        "        a { text-decoration: none; color: #007bff; }",
        "        a:hover { text-decoration: underline; }",
        "    </style>",
        "</head>",
        "<body>",
        f"    <h1>Directory Tree of: <code>{os.path.abspath(startpath)}</code></h1>",
        "    <ul>"
    ]

    def build_tree_html(current_path, indent_level=0):
        try:
            items = sorted(os.listdir(current_path))
        except PermissionError:
            html_content.append(f"<li><span style='color: red;'>Permission Denied: {current_path}</span></li>")
            return

        for item in items:
            item_path = os.path.join(current_path, item)
            relative_path = os.path.relpath(item_path, startpath) # Get path relative to startpath

            if os.path.isdir(item_path):
                if item in exclude_dirs:
                    continue
                html_content.append(f"{' ' * (indent_level * 4)}<li><span class='directory'>{item}/</span>")
                html_content.append(f"{' ' * (indent_level * 4)}    <ul>")
                build_tree_html(item_path, indent_level + 1)
                html_content.append(f"{' ' * (indent_level * 4)}    </ul>")
                html_content.append(f"{' ' * (indent_level * 4)}</li>")
            elif os.path.isfile(item_path):
                if item in exclude_files:
                    continue
                # For local files, direct links will open them in the browser if supported
                # Otherwise, they might download or display as plain text.
                html_content.append(f"{' ' * (indent_level * 4)}<li><a href='./{relative_path}' class='file-entry'>{item}</a></li>")
        
    build_tree_html(startpath)
    html_content.append("    </ul>")
    html_content.append("</body>")
    html_content.append("</html>")

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(html_content))
    print(f"HTML tree generated successfully at: {os.path.abspath(output_file)}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate an HTML directory tree with links.")
    parser.add_argument("path", nargs='?', default=".", help="The starting directory to scan (default: current directory).")
    parser.add_argument("-o", "--output", default="tree_of_links.html", help="Name of the output HTML file (default: tree_of_links.html).")
    parser.add_argument("-xd", "--exclude-dirs", nargs='*', default=[], help="Space-separated list of directory names to exclude.")
    parser.add_argument("-xf", "--exclude-files", nargs='*', default=[], help="Space-separated list of file names to exclude.")

    args = parser.parse_args()

    # Get the absolute path to ensure correct relative links
    start_path = os.path.abspath(args.path)

    generate_html_tree(start_path, args.output, args.exclude_dirs, args.exclude_files)